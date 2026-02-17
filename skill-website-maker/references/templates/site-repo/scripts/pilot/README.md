# Pilot Assets (Maintainers Only)

This folder contains a deterministic pipeline to generate the "Pilot: Skillception" show assets shipped by this site template.

Public-safe default:
- The deployed site plays static files under `client/public/show/pilot-v1/`.
- The site never calls ElevenLabs (or any voice API) at runtime.

## What Gets Generated
- `client/public/show/pilot-v1/script.json` (Stage3D cues: speakers + gestures + laughs)
- `client/public/show/pilot-v1/captions/*.vtt` (WebVTT subtitles in 9 languages)
- Optional: `client/public/show/pilot-v1/pilot.mp3` (audio-first episode)

## Generate Captions Only (No Network)
```bash
python scripts/pilot/translate_captions.py
```

## Generate Script + Captions (No Network)
```bash
python scripts/pilot/generate_pilot_assets.py
```

## Generate Audio With ElevenLabs (Network + ffmpeg)
Security:
- Never commit API keys.
- If you ever pasted an API key into a chat log, treat it as compromised and rotate it.

Requirements:
- `ffmpeg` and `ffprobe` available on `PATH`
- Env vars:
  - `ELEVENLABS_API_KEY`
  - `ELEVENLABS_VOICE_ID_HOST`
  - `ELEVENLABS_VOICE_ID_FRIEND1`
  - `ELEVENLABS_VOICE_ID_FRIEND2`
  - `ELEVENLABS_VOICE_ID_OPS`

Run:
```bash
python scripts/pilot/generate_pilot_assets.py --audio
```

Repair mode:
```bash
python scripts/pilot/generate_pilot_assets.py --audio --force --keep-backup
```

