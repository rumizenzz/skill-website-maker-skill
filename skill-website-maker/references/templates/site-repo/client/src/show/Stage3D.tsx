import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";

export type PilotScript = {
  version: string;
  introEndSec: number;
  characters: { id: string; displayName: string; color: string }[];
  scenes: { id: string; fromSec: number; toSec: number; camera?: string }[];
  events: Array<
    | { type: "line"; fromSec: number; toSec: number; speaker: string; text: string }
    | { type: "gesture"; atSec: number; target: string; kind: "shrug" | "point" | "wave" | "nod" | "facepalm" }
    | { type: "laugh"; atSec: number; intensity: number }
  >;
};

export type Stage3DApi = {
  enableAudioAnalysis: () => void;
};

type Rig = {
  id: string;
  root: THREE.Group;
  body: THREE.Mesh;
  head: THREE.Mesh;
  eyeL: THREE.Mesh;
  eyeR: THREE.Mesh;
  browL: THREE.Mesh;
  browR: THREE.Mesh;
  mouth: THREE.Mesh;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function seedFromId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 10_000) / 10_000;
}

export const Stage3D = forwardRef<
  Stage3DApi,
  {
    className?: string;
    video: HTMLVideoElement | null;
    script: PilotScript | null;
    reduceMotion: boolean;
    audienceMode: boolean;
    activeSpeaker: string | null;
  }
>(function Stage3D(props, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const audioRef = useRef<{
    ctx: AudioContext;
    source: MediaElementAudioSourceNode;
    analyser: AnalyserNode;
    data: Uint8Array;
  } | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      enableAudioAnalysis: () => {
        if (audioRef.current) return;
        const v = props.video;
        if (!v) return;
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        const ctx = new Ctx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        const source = ctx.createMediaElementSource(v);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        audioRef.current = { ctx, source, analyser, data: new Uint8Array(analyser.fftSize) };
        void ctx.resume();
      },
    }),
    [props.video],
  );

  const gestures = useMemo(() => {
    const events = props.script?.events ?? [];
    return events
      .filter((e) => e.type === "gesture")
      .map((e) => e as Extract<(typeof events)[number], { type: "gesture" }>)
      .slice()
      .sort((a, b) => a.atSec - b.atSec);
  }, [props.script]);

  const laughs = useMemo(() => {
    const events = props.script?.events ?? [];
    return events
      .filter((e) => e.type === "laugh")
      .map((e) => e as Extract<(typeof events)[number], { type: "laugh" }>)
      .slice()
      .sort((a, b) => a.atSec - b.atSec);
  }, [props.script]);

  const scenes = useMemo(() => {
    const list = props.script?.scenes ?? [];
    return list.slice().sort((a, b) => a.fromSec - b.fromSec);
  }, [props.script]);

  const lines = useMemo(() => {
    const events = props.script?.events ?? [];
    return events
      .filter((e) => e.type === "line")
      .map((e) => e as Extract<(typeof events)[number], { type: "line" }>)
      .slice()
      .sort((a, b) => a.fromSec - b.fromSec);
  }, [props.script]);

  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    rigById: Map<string, Rig>;
    setById: Map<string, THREE.Group>;
    activeSetId: string;
    sceneIdx: number;
    crowd: THREE.InstancedMesh | null;
    gestureIdx: number;
    laughIdx: number;
    gestureState: Map<string, { kind: string; startedAt: number }>;
    laughPulseUntil: number;
    lastSpeaker: string | null;
    speakerPopUntil: number;
    rigMotion: Map<string, { lastX: number; lastZ: number; nextBlinkAt: number; blinkUntil: number }>;
    clock: THREE.Clock;
    ro: ResizeObserver | null;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // If WebGL is unavailable, fail silently (player will still work).
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070c, 0.08);

    const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 100);
    camera.position.set(0, 1.35, 4.2);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(2.2, 3.2, 1.8);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x88b7ff, 0.55);
    rim.position.set(-2.6, 2.2, -2.4);
    scene.add(rim);

    // Sets: keep them lightweight so templates stay fast.
    const setById = new Map<string, THREE.Group>();
    const addSet = (id: string) => {
      const g = new THREE.Group();
      g.visible = false;
      scene.add(g);
      setById.set(id, g);
      return g;
    };

    // "stage" set
    const stageSet = addSet("stage");
    stageSet.visible = true;

    const stageFloorGeo = new THREE.CircleGeometry(3.4, 80);
    const stageFloorMat = new THREE.MeshStandardMaterial({ color: 0x090a10, roughness: 0.9, metalness: 0.05 });
    const stageFloor = new THREE.Mesh(stageFloorGeo, stageFloorMat);
    stageFloor.rotation.x = -Math.PI / 2;
    stageFloor.position.y = 0;
    stageSet.add(stageFloor);

    const stageWallGeo = new THREE.PlaneGeometry(9, 5);
    const stageWallMat = new THREE.MeshStandardMaterial({ color: 0x05060a, roughness: 1, metalness: 0 });
    const stageWall = new THREE.Mesh(stageWallGeo, stageWallMat);
    stageWall.position.set(0, 1.6, -3);
    stageSet.add(stageWall);

    // "cafe" set
    const cafeSet = addSet("cafe");
    const cafeFloor = new THREE.Mesh(
      new THREE.CircleGeometry(3.5, 80),
      new THREE.MeshStandardMaterial({ color: 0x090804, roughness: 0.95, metalness: 0.02 }),
    );
    cafeFloor.rotation.x = -Math.PI / 2;
    cafeSet.add(cafeFloor);

    const cafeWall = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 5),
      new THREE.MeshStandardMaterial({ color: 0x050509, roughness: 1, metalness: 0 }),
    );
    cafeWall.position.set(0, 1.6, -3);
    cafeSet.add(cafeWall);

    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 0.06, 28),
      new THREE.MeshStandardMaterial({ color: 0x1a1110, roughness: 0.85, metalness: 0.05 }),
    );
    table.position.set(0, 0.66, 0.15);
    cafeSet.add(table);

    // "apartment" set
    const apartmentSet = addSet("apartment");
    const aptFloor = new THREE.Mesh(
      new THREE.CircleGeometry(3.5, 80),
      new THREE.MeshStandardMaterial({ color: 0x070810, roughness: 0.9, metalness: 0.03 }),
    );
    aptFloor.rotation.x = -Math.PI / 2;
    apartmentSet.add(aptFloor);

    const aptWall = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 5),
      new THREE.MeshStandardMaterial({ color: 0x04040a, roughness: 1, metalness: 0 }),
    );
    aptWall.position.set(0, 1.6, -3);
    apartmentSet.add(aptWall);

    const couch = new THREE.Mesh(
      new THREE.BoxGeometry(1.65, 0.45, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x101423, roughness: 0.8, metalness: 0.02 }),
    );
    couch.position.set(0, 0.28, 0.25);
    apartmentSet.add(couch);

    // "workshop" set
    const workshopSet = addSet("workshop");
    const wsFloor = new THREE.Mesh(
      new THREE.CircleGeometry(3.5, 80),
      new THREE.MeshStandardMaterial({ color: 0x05060d, roughness: 0.95, metalness: 0.03 }),
    );
    wsFloor.rotation.x = -Math.PI / 2;
    workshopSet.add(wsFloor);

    const wsWall = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 5),
      new THREE.MeshStandardMaterial({ color: 0x040409, roughness: 1, metalness: 0 }),
    );
    wsWall.position.set(0, 1.6, -3);
    workshopSet.add(wsWall);

    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.22, 0.62),
      new THREE.MeshStandardMaterial({ color: 0x0c0f1a, roughness: 0.85, metalness: 0.03 }),
    );
    bench.position.set(0, 0.56, 0.2);
    workshopSet.add(bench);

    const rigById = new Map<string, Rig>();

    const createRig = (id: string, color: string, x: number) => {
      const root = new THREE.Group();
      root.position.set(x, 0, 0);

      const toon = new THREE.MeshToonMaterial({ color: new THREE.Color(color) });
      const accent = new THREE.MeshToonMaterial({ color: 0x141826 });
      const skin = new THREE.MeshToonMaterial({ color: 0xe8e2d8 });

      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.5, 6, 18), toon);
      body.position.y = 0.92;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), skin);
      head.position.y = 1.36;
      root.add(head);

      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), accent);
      eyeL.position.set(-0.07, 0.04, 0.18);
      head.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), accent);
      eyeR.position.set(0.07, 0.04, 0.18);
      head.add(eyeR);

      const browMat = new THREE.MeshToonMaterial({ color: 0x0a0c14 });
      const browL = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.012, 0.02), browMat);
      browL.position.set(-0.07, 0.085, 0.19);
      head.add(browL);

      const browR = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.012, 0.02), browMat);
      browR.position.set(0.07, 0.085, 0.19);
      head.add(browR);

      const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.035, 0.035), accent);
      mouth.position.set(0, -0.07, 0.19);
      head.add(mouth);

      const armL = new THREE.Group();
      armL.position.set(-0.28, 1.08, 0);
      const armLMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.34, 5, 12), toon);
      armLMesh.rotation.z = Math.PI / 2;
      armL.add(armLMesh);
      const handL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.05), skin);
      handL.position.set(-0.25, -0.02, 0.02);
      armL.add(handL);
      root.add(armL);

      const armR = new THREE.Group();
      armR.position.set(0.28, 1.08, 0);
      const armRMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.34, 5, 12), toon);
      armRMesh.rotation.z = -Math.PI / 2;
      armR.add(armRMesh);
      const handR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.05), skin);
      handR.position.set(0.25, -0.02, 0.02);
      armR.add(handR);
      root.add(armR);

      // Legs: minimal rig so characters can "walk" between sets.
      const hipY = 0.43;
      const legGeo = new THREE.CapsuleGeometry(0.07, 0.28, 5, 12);
      const legMat = new THREE.MeshToonMaterial({ color: new THREE.Color(color).multiplyScalar(0.55) });
      const footMat = new THREE.MeshToonMaterial({ color: 0x0b0e18 });

      const legL = new THREE.Group();
      legL.position.set(-0.12, hipY, 0);
      const legLMesh = new THREE.Mesh(legGeo, legMat);
      legLMesh.position.y = -0.21;
      legL.add(legLMesh);
      const footL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.26), footMat);
      footL.position.set(0, -0.42, 0.08);
      legL.add(footL);
      root.add(legL);

      const legR = new THREE.Group();
      legR.position.set(0.12, hipY, 0);
      const legRMesh = new THREE.Mesh(legGeo, legMat);
      legRMesh.position.y = -0.21;
      legR.add(legRMesh);
      const footR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.26), footMat);
      footR.position.set(0, -0.42, 0.08);
      legR.add(footR);
      root.add(legR);

      scene.add(root);

      const rig: Rig = { id, root, body, head, eyeL, eyeR, browL, browR, mouth, armL, armR, legL, legR };
      rigById.set(id, rig);
    };

    // Default lineup (script can override count; we just mirror what's provided when available).
    const chars = props.script?.characters ?? [
      { id: "host", displayName: "Host", color: "#7CF7D4" },
      { id: "friend1", displayName: "Friend 1", color: "#6EA8FF" },
      { id: "friend2", displayName: "Friend 2", color: "#FFC38A" },
      { id: "ops", displayName: "Ops", color: "#E6E6E6" },
    ];
    const xs = [-1.1, -0.35, 0.35, 1.1];
    for (let i = 0; i < Math.min(chars.length, xs.length); i++) {
      createRig(chars[i].id, chars[i].color, xs[i]);
    }

    // Crowd: instanced tiny silhouettes (only visible in Audience mode)
    const crowdGeo = new THREE.BoxGeometry(0.07, 0.16, 0.05);
    const crowdMat = new THREE.MeshToonMaterial({ color: 0x0f1320 });
    const crowd = new THREE.InstancedMesh(crowdGeo, crowdMat, 240);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 240; i++) {
      const row = Math.floor(i / 40);
      const col = i % 40;
      const z = -1.15 - row * 0.16;
      const x = (col - 20) * 0.12 + (row % 2 ? 0.05 : 0);
      const y = 0.08 + row * 0.02;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.9 + Math.random() * 0.6);
      dummy.rotation.y = (Math.random() - 0.5) * 0.25;
      dummy.updateMatrix();
      crowd.setMatrixAt(i, dummy.matrix);
    }
    crowd.visible = false;
    scene.add(crowd);

    const clock = new THREE.Clock();

    const ro = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(canvas);

    stateRef.current = {
      renderer,
      scene,
      camera,
      rigById,
      setById,
      activeSetId: "stage",
      sceneIdx: 0,
      crowd,
      gestureIdx: 0,
      laughIdx: 0,
      gestureState: new Map(),
      laughPulseUntil: 0,
      lastSpeaker: null,
      speakerPopUntil: 0,
      rigMotion: new Map(),
      clock,
      ro,
    };

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      ro.disconnect();
      renderer.dispose();
      stateRef.current = null;
    };
  }, [props.script]);

  useEffect(() => {
    const st = stateRef.current;
    if (!st) return;

    const getAmp = (t: number) => {
      const audio = audioRef.current;
      if (audio) {
        audio.analyser.getByteTimeDomainData(audio.data);
        let sum = 0;
        for (let i = 0; i < audio.data.length; i++) {
          const v = (audio.data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / audio.data.length);
        const amp = clamp01((rms - 0.02) * 10);
        // If the audio is effectively silent (e.g., placeholder pilot), keep the stage lively.
        if (amp > 0.02) return amp;
      }
      // Fallback pseudo-lipsync: deterministic jitter when speaking.
      return clamp01(0.55 + 0.45 * Math.sin(t * 14.5) * Math.sin(t * 2.7));
    };

    const tick = () => {
      const dt = st.clock.getDelta();
      const v = props.video;
      const tMedia = v ? v.currentTime : st.clock.elapsedTime;
      const tAnim = st.clock.elapsedTime;

      const currentLine = lines.find((l) => l.fromSec <= tMedia && tMedia <= l.toSec) || null;
      const resolvedSpeaker = props.activeSpeaker || currentLine?.speaker || null;
      const lineText = currentLine?.text || "";

      if (resolvedSpeaker !== st.lastSpeaker) {
        st.lastSpeaker = resolvedSpeaker;
        st.speakerPopUntil = tAnim + 0.45;
      }

      // Current scene: drives lightweight set + camera + layout changes.
      let sceneId = "stage";
      let camMode = "wide";
      if (scenes.length) {
        let idx = st.sceneIdx;
        const current = scenes[idx];
        if (!current || tMedia < current.fromSec || tMedia >= current.toSec) {
          idx = scenes.findIndex((s) => tMedia >= s.fromSec && tMedia < s.toSec);
          if (idx < 0) idx = Math.max(0, scenes.length - 1);
          st.sceneIdx = idx;
        }
        const sc = scenes[st.sceneIdx];
        if (sc) {
          sceneId = sc.id || "stage";
          camMode = sc.camera || "wide";
        }
      }

      const resolvedSetId = st.setById.has(sceneId) ? sceneId : "stage";
      if (resolvedSetId !== st.activeSetId) {
        for (const [id, g] of st.setById.entries()) {
          g.visible = id === resolvedSetId;
        }
        st.activeSetId = resolvedSetId;
      }

      // Trigger gesture events (best effort).
      while (st.gestureIdx < gestures.length && gestures[st.gestureIdx].atSec <= tMedia) {
        const g = gestures[st.gestureIdx];
        st.gestureState.set(g.target, { kind: g.kind, startedAt: tMedia });
        st.gestureIdx += 1;
      }

      while (st.laughIdx < laughs.length && laughs[st.laughIdx].atSec <= tMedia) {
        const e = laughs[st.laughIdx];
        st.laughPulseUntil = Math.max(st.laughPulseUntil, tAnim + 0.8 + e.intensity * 0.6);
        st.laughIdx += 1;
      }

      if (st.crowd) st.crowd.visible = props.audienceMode && st.activeSetId === "stage";

      // Camera motion (disabled on reduced motion).
      if (!props.reduceMotion) {
        const focus = resolvedSpeaker ? st.rigById.get(resolvedSpeaker) : null;
        const xMul = camMode === "close" ? 0.55 : camMode === "two" ? 0.45 : 0.35;
        const baseZ = camMode === "close" ? 3.15 : camMode === "two" ? 3.75 : 4.2;
        const baseY = camMode === "close" ? 1.25 : 1.35;
        const targetX = focus ? focus.root.position.x * xMul : 0;
        st.camera.position.x = THREE.MathUtils.lerp(st.camera.position.x, targetX, 0.06);
        st.camera.position.z = THREE.MathUtils.lerp(st.camera.position.z, baseZ, 0.05);
        st.camera.position.y = THREE.MathUtils.lerp(st.camera.position.y, baseY + Math.sin(tAnim * 0.35) * 0.03, 0.04);
        st.camera.lookAt(targetX, 1.2, 0);
      } else {
        st.camera.position.x = 0;
        st.camera.position.y = 1.35;
        st.camera.position.z = 4.2;
        st.camera.lookAt(0, 1.2, 0);
      }

      const breath = props.reduceMotion ? 0 : Math.sin(tAnim * 0.9) * 0.015;
      const laughBounce = props.audienceMode && !props.reduceMotion && tAnim < st.laughPulseUntil ? Math.sin(tAnim * 12) * 0.02 : 0;

      const layout =
        st.activeSetId === "cafe"
          ? {
              host: { x: -0.9, z: 0.35 },
              friend1: { x: -0.25, z: -0.05 },
              friend2: { x: 0.35, z: 0.25 },
              ops: { x: 0.95, z: -0.08 },
            }
          : st.activeSetId === "apartment"
            ? {
                host: { x: -0.75, z: 0.2 },
                friend1: { x: -0.15, z: 0.05 },
                friend2: { x: 0.35, z: 0.18 },
                ops: { x: 0.9, z: 0.02 },
              }
            : st.activeSetId === "workshop"
              ? {
                  host: { x: -0.85, z: 0.15 },
                  friend1: { x: -0.2, z: 0.0 },
                  friend2: { x: 0.35, z: 0.1 },
                  ops: { x: 0.95, z: 0.0 },
                }
              : {
                  host: { x: -1.1, z: 0.0 },
                  friend1: { x: -0.35, z: 0.0 },
                  friend2: { x: 0.35, z: 0.0 },
                  ops: { x: 1.1, z: 0.0 },
                };

      const focusRig = resolvedSpeaker ? st.rigById.get(resolvedSpeaker) || null : null;

      for (const rig of st.rigById.values()) {
        const speaking = rig.id === resolvedSpeaker;
        const amp = speaking ? getAmp(tMedia) : 0;

        const target = (layout as Record<string, { x: number; z: number }>)[rig.id] || { x: 0, z: 0 };
        const beforeX = rig.root.position.x;
        const beforeZ = rig.root.position.z;
        rig.root.position.x = THREE.MathUtils.lerp(rig.root.position.x, target.x, 0.06);
        rig.root.position.z = THREE.MathUtils.lerp(rig.root.position.z, target.z, 0.06);

        // Track motion so we can blend in a walk cycle when moving between layouts.
        const motion = st.rigMotion.get(rig.id) || { lastX: beforeX, lastZ: beforeZ, nextBlinkAt: tAnim + 2, blinkUntil: 0 };
        const dx = rig.root.position.x - motion.lastX;
        const dz = rig.root.position.z - motion.lastZ;
        const speed = Math.hypot(dx, dz) / Math.max(1e-4, dt);
        motion.lastX = rig.root.position.x;
        motion.lastZ = rig.root.position.z;

        const walkEnergy = props.reduceMotion ? 0 : clamp01(speed * 0.8);
        const idSeed = seedFromId(rig.id);
        const walkPhase = tAnim * (4.1 + walkEnergy * 1.1) + idSeed * Math.PI * 2;

        rig.legL.rotation.x = THREE.MathUtils.lerp(rig.legL.rotation.x, Math.sin(walkPhase) * 0.65 * walkEnergy, 0.2);
        rig.legR.rotation.x = THREE.MathUtils.lerp(rig.legR.rotation.x, -Math.sin(walkPhase) * 0.65 * walkEnergy, 0.2);

        // Micro-bounce: breathe + subtle laugh reaction.
        rig.root.position.y = breath + laughBounce + (walkEnergy > 0.05 ? Math.abs(Math.sin(walkPhase)) * 0.015 * walkEnergy : 0);

        // Facial: blink + look-at.
        if (!props.reduceMotion && tAnim >= motion.nextBlinkAt) {
          motion.blinkUntil = tAnim + 0.13;
          motion.nextBlinkAt = tAnim + 2.2 + Math.random() * 3.4;
        }
        const blinking = !props.reduceMotion && tAnim <= motion.blinkUntil;
        const eyeScaleY = blinking ? 0.12 : 1;
        rig.eyeL.scale.y = THREE.MathUtils.lerp(rig.eyeL.scale.y, eyeScaleY, 0.25);
        rig.eyeR.scale.y = THREE.MathUtils.lerp(rig.eyeR.scale.y, eyeScaleY, 0.25);

        const look = focusRig && focusRig !== rig ? clamp((focusRig.root.position.x - rig.root.position.x) * 0.18, -0.25, 0.25) : 0;
        const speakYaw = speaking ? Math.sin(tAnim * 0.6 + idSeed * 3) * 0.15 : 0;
        const targetHeadY = (speaking ? speakYaw : look) + (!speaking ? Math.sin(tAnim * 0.18 + idSeed * 12) * 0.03 : 0);
        const targetHeadX = speaking ? Math.sin(tAnim * 1.1 + idSeed * 2) * 0.07 : Math.sin(tAnim * 0.25 + idSeed * 8) * 0.02;
        rig.head.rotation.y = THREE.MathUtils.lerp(rig.head.rotation.y, targetHeadY, 0.06);
        rig.head.rotation.x = THREE.MathUtils.lerp(rig.head.rotation.x, targetHeadX, 0.06);

        // Eyebrows: react to questions/exclamations.
        const isQuestion = speaking && lineText.includes("?");
        const isExcited = speaking && lineText.includes("!");
        const browLift = isQuestion ? 0.06 : isExcited ? 0.03 : 0;
        rig.browL.position.y = THREE.MathUtils.lerp(rig.browL.position.y, 0.085 + browLift, 0.12);
        rig.browR.position.y = THREE.MathUtils.lerp(rig.browR.position.y, 0.085 + browLift, 0.12);

        const mouthScale = 0.6 + amp * 1.6;
        rig.mouth.scale.y = THREE.MathUtils.lerp(rig.mouth.scale.y, mouthScale, 0.35);
        rig.mouth.scale.x = THREE.MathUtils.lerp(rig.mouth.scale.x, 0.9 + amp * 0.35, 0.25);

        // Subtle arm motion
        const walkSwing = Math.sin(walkPhase) * 0.35 * walkEnergy;
        const talkSwing = speaking && !props.reduceMotion ? Math.sin(tMedia * 3.2) * 0.22 : 0.06;
        const armSwing = speaking ? talkSwing : walkSwing * 0.5;
        rig.armL.rotation.z = THREE.MathUtils.lerp(rig.armL.rotation.z, armSwing, 0.12);
        rig.armR.rotation.z = THREE.MathUtils.lerp(rig.armR.rotation.z, -armSwing, 0.12);

        // Gesture overrides (short impulses)
        const g = st.gestureState.get(rig.id);
        if (g) {
          const age = tMedia - g.startedAt;
          const k = 1 - clamp01(age / 0.9);
          if (age > 0.9) {
            st.gestureState.delete(rig.id);
          } else if (!props.reduceMotion) {
            if (g.kind === "shrug") {
              rig.armL.rotation.x = k * 0.8;
              rig.armR.rotation.x = k * 0.8;
            } else if (g.kind === "wave") {
              rig.armR.rotation.z = -0.8 + Math.sin(tAnim * 18) * 0.25;
            } else if (g.kind === "point") {
              rig.armR.rotation.z = -1.1;
              rig.armR.rotation.y = 0.6;
            } else if (g.kind === "nod") {
              rig.head.rotation.x += k * 0.35;
            } else if (g.kind === "facepalm") {
              rig.armL.rotation.z = 1.4;
              rig.armL.rotation.y = -0.6;
            }
          }
        }

        // Speaker emphasis: a short pop at speaker changes.
        const pop = speaking && tAnim < st.speakerPopUntil && !props.reduceMotion ? (st.speakerPopUntil - tAnim) * 0.06 : 0;
        rig.body.scale.setScalar(1 + pop);
        st.rigMotion.set(rig.id, motion);
      }

      // Crowd pulse on laughs.
      if (st.crowd && props.audienceMode && !props.reduceMotion) {
        const pulse = tAnim < st.laughPulseUntil ? Math.sin(tAnim * 16) * 0.03 + 0.03 : 0;
        st.crowd.position.y = THREE.MathUtils.lerp(st.crowd.position.y, pulse, 0.18);
      } else if (st.crowd) {
        st.crowd.position.y = 0;
      }

      st.renderer.render(st.scene, st.camera);
      rafRef.current = window.requestAnimationFrame(tick);
      void dt;
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [gestures, laughs, lines, scenes, props.activeSpeaker, props.audienceMode, props.reduceMotion, props.video]);

  return <canvas ref={canvasRef} className={props.className} />;
});
