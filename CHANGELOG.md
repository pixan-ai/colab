# Changelog

All notable changes to this project. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-11-21

### Fixed

- Seven of the ten models were no longer in the Vercel AI Gateway catalog under the id we used, three of them in group mode. Three only changed id (Claude Opus 4.5, Gemini 3 Flash, DeepSeek v3.2); four were retired and move to the closest model from the same provider: Gemini 3.8 Flash, Sonar, Grok 4.20 and Kimi K2.5.

### Changed

- Context size and the per-token figures used for the estimated cost come from the public gateway catalog as of 21 November 2026.

## [1.0.0] - 2026-11-21

### Added

- First public release: a clean copy, without history, of the genAI orchestrator that has run on pixan.ai since late 2025.
- The interface (`pages/index.js`), the sandboxed preview (`components/AppPreview.js`) and three API routes behind a password (`lib/auth.js`).
- Acceptance scenarios in Gherkin, run against `next start` with the gateway replaced by a local double, and CI.
