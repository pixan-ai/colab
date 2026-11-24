# Changelog

All notable changes to this project. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-11-24

### Fixed

- Seven of the ten models were no longer in the Vercel AI Gateway catalog under the id we used, three of them in group mode, so a group query failed in three of its four answers. The list now uses the current generation from each provider at standard price, with no previews, betas or codenames (those are the ids that disappear): Claude Opus 5.5 and Sonnet 5.5, GPT-5.5, Gemini 3.8 Flash, Gemini 2.5 Pro, Gemini 3.5 Flash Lite, Sonar, DeepSeek V4 Pro, Grok 4.7 and Kimi K3.1 Pro.

### Changed

- `/api/chat` no longer sends `temperature`: Claude Opus 5.5 and Sonnet 5.5 reject it, and the other models use their default.
- Claude models get `reasoning: { enabled: false }`. Claude 5.x thinks by default and that thinking comes out of the same token cap as the answer, which is all genAI shows.
- Context size and the per-token figures used for the estimated cost come from the public gateway catalog as of 24 November 2026.

## [1.0.0] - 2026-11-21

### Added

- First public release: a clean copy, without history, of the genAI orchestrator that has run on pixan.ai since late 2025.
- The interface (`pages/index.js`), the sandboxed preview (`components/AppPreview.js`) and three API routes behind a password (`lib/auth.js`).
- Acceptance scenarios in Gherkin, run against `next start` with the gateway replaced by a local double, and CI.
