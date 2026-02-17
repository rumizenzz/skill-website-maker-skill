# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## [Unreleased]

## [1.1.0] - 2026-02-17
### Added
- Site template: full i18n with 9 languages enabled (en, es, fr, de, pt, ja, ko, zh, ar), including RTL for Arabic.
- Site template: "What it does" and FAQ sections for non-coders.
- Site template: original "SkillStream Originals" Pilot section with a 3D animated stage, captions, and Audience mode.
- Maintainer tooling: deterministic pilot asset generation scripts (captions offline; optional audio via ElevenLabs + ffmpeg with caching).

### Changed
- Template rendering: ignore heavy build artifacts (node_modules/dist/output) when copying templates into generated repos.

## [1.0.1] - 2026-02-17
### Fixed
- Avoid clobbering existing skill repo docs on re-publish; only the skill folder is replaced.
- Correct template substitutions for LICENSE year vs CHANGELOG date.
- Windows: run pnpm .cmd shims reliably from Python subprocess.

### Changed
- Site template: improved TypeScript strictness in Changelog renderer.

## [1.0.0] - 2026-02-16
### Added
- Initial public release.

