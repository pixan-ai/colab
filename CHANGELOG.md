# Changelog

All notable changes to this project. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2026-11-21

### Added

- First public release: a clean copy, without history, of the genAI orchestrator that has run on pixan.ai since late 2025.
- The interface (`pages/index.js`), the sandboxed preview (`components/AppPreview.js`) and three API routes behind a password (`lib/auth.js`).
- Acceptance scenarios in Gherkin, run against `next start` with the gateway replaced by a local double, and CI.
