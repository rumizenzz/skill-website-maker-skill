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
  head: THREE.Mesh;
  mouth: THREE.Mesh;
  armL: THREE.Group;
  armR: THREE.Group;
};

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
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

  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    rigById: Map<string, Rig>;
    crowd: THREE.InstancedMesh | null;
    gestureIdx: number;
    laughIdx: number;
    gestureState: Map<string, { kind: string; startedAt: number }>;
    laughPulseUntil: number;
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

    // Stage floor
    const floorGeo = new THREE.CircleGeometry(3.4, 80);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x090a10, roughness: 0.9, metalness: 0.05 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    // Back wall
    const wallGeo = new THREE.PlaneGeometry(9, 5);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x05060a, roughness: 1, metalness: 0 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 1.6, -3);
    scene.add(wall);

    const rigById = new Map<string, Rig>();

    const createRig = (id: string, color: string, x: number) => {
      const root = new THREE.Group();
      root.position.set(x, 0, 0);

      const toon = new THREE.MeshToonMaterial({ color: new THREE.Color(color) });
      const accent = new THREE.MeshToonMaterial({ color: 0x141826 });
      const skin = new THREE.MeshToonMaterial({ color: 0xe8e2d8 });

      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.62, 6, 18), toon);
      body.position.y = 0.78;
      root.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), skin);
      head.position.y = 1.38;
      root.add(head);

      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), accent);
      eyeL.position.set(-0.07, 0.04, 0.18);
      head.add(eyeL);

      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), accent);
      eyeR.position.set(0.07, 0.04, 0.18);
      head.add(eyeR);

      const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.035, 0.035), accent);
      mouth.position.set(0, -0.07, 0.19);
      head.add(mouth);

      const armL = new THREE.Group();
      armL.position.set(-0.28, 1.08, 0);
      const armLMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.34, 5, 12), toon);
      armLMesh.rotation.z = Math.PI / 2;
      armL.add(armLMesh);
      root.add(armL);

      const armR = new THREE.Group();
      armR.position.set(0.28, 1.08, 0);
      const armRMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.34, 5, 12), toon);
      armRMesh.rotation.z = -Math.PI / 2;
      armR.add(armRMesh);
      root.add(armR);

      scene.add(root);

      const rig: Rig = { id, root, head, mouth, armL, armR };
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
      crowd,
      gestureIdx: 0,
      laughIdx: 0,
      gestureState: new Map(),
      laughPulseUntil: 0,
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
        return clamp01((rms - 0.02) * 10);
      }
      // Fallback pseudo-lipsync: deterministic jitter when speaking.
      return clamp01(0.55 + 0.45 * Math.sin(t * 14.5) * Math.sin(t * 2.7));
    };

    const tick = () => {
      const dt = st.clock.getDelta();
      const v = props.video;
      const t = v ? v.currentTime : st.clock.elapsedTime;

      // Trigger gesture events (best effort).
      while (st.gestureIdx < gestures.length && gestures[st.gestureIdx].atSec <= t) {
        const g = gestures[st.gestureIdx];
        st.gestureState.set(g.target, { kind: g.kind, startedAt: t });
        st.gestureIdx += 1;
      }

      while (st.laughIdx < laughs.length && laughs[st.laughIdx].atSec <= t) {
        const e = laughs[st.laughIdx];
        st.laughPulseUntil = Math.max(st.laughPulseUntil, t + 0.8 + e.intensity * 0.6);
        st.laughIdx += 1;
      }

      if (st.crowd) st.crowd.visible = props.audienceMode;

      // Camera motion (disabled on reduced motion).
      if (!props.reduceMotion) {
        const focus = props.activeSpeaker ? st.rigById.get(props.activeSpeaker) : null;
        const targetX = focus ? focus.root.position.x * 0.35 : 0;
        st.camera.position.x = THREE.MathUtils.lerp(st.camera.position.x, targetX, 0.06);
        st.camera.position.y = THREE.MathUtils.lerp(st.camera.position.y, 1.35 + Math.sin(t * 0.35) * 0.03, 0.04);
        st.camera.lookAt(targetX, 1.2, 0);
      } else {
        st.camera.position.x = 0;
        st.camera.position.y = 1.35;
        st.camera.lookAt(0, 1.2, 0);
      }

      const breath = props.reduceMotion ? 0 : Math.sin(t * 0.9) * 0.015;

      for (const rig of st.rigById.values()) {
        const speaking = rig.id === props.activeSpeaker;
        const amp = speaking ? getAmp(t) : 0;

        rig.root.position.y = breath;
        rig.head.rotation.y = THREE.MathUtils.lerp(rig.head.rotation.y, speaking ? Math.sin(t * 0.6) * 0.15 : 0, 0.06);
        rig.head.rotation.x = THREE.MathUtils.lerp(rig.head.rotation.x, speaking ? Math.sin(t * 1.1) * 0.06 : 0, 0.06);

        const mouthScale = 0.6 + amp * 1.6;
        rig.mouth.scale.y = THREE.MathUtils.lerp(rig.mouth.scale.y, mouthScale, 0.35);

        // Subtle arm motion
        const armSwing = speaking && !props.reduceMotion ? Math.sin(t * 3.2) * 0.22 : 0.06;
        rig.armL.rotation.z = THREE.MathUtils.lerp(rig.armL.rotation.z, armSwing, 0.12);
        rig.armR.rotation.z = THREE.MathUtils.lerp(rig.armR.rotation.z, -armSwing, 0.12);

        // Gesture overrides (short impulses)
        const g = st.gestureState.get(rig.id);
        if (g) {
          const age = t - g.startedAt;
          const k = 1 - clamp01(age / 0.9);
          if (age > 0.9) {
            st.gestureState.delete(rig.id);
          } else if (!props.reduceMotion) {
            if (g.kind === "shrug") {
              rig.armL.rotation.x = k * 0.8;
              rig.armR.rotation.x = k * 0.8;
            } else if (g.kind === "wave") {
              rig.armR.rotation.z = -0.8 + Math.sin(t * 18) * 0.25;
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
      }

      // Crowd pulse on laughs.
      if (st.crowd && props.audienceMode && !props.reduceMotion) {
        const pulse = t < st.laughPulseUntil ? Math.sin(t * 16) * 0.03 + 0.03 : 0;
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
  }, [gestures, laughs, props.activeSpeaker, props.audienceMode, props.reduceMotion, props.script, props.video]);

  return <canvas ref={canvasRef} className={props.className} />;
});
