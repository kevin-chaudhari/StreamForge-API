# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned

- Frontend React/Next.js client ([yt-clone-fullstack](https://github.com/DoDoxD1/yt-clone-fullstack))
- Unit and integration test suite (Jest + Supertest)
- Rate limiting middleware
- Video search with full-text MongoDB indexing
- Watch history deduplication

---

## [1.1.0] — 2025-06-20

### Added

- `.env.example` with documented descriptions for all environment variables
- `CONTRIBUTING.md` — contribution guide with branch naming and commit conventions
- `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1
- `SECURITY.md` — responsible disclosure policy and deployment security guidelines
- `docker-compose.yml` — local development stack with MongoDB
- `.github/workflows/ci.yml` — GitHub Actions CI pipeline
- `.eslintrc.json` — ESLint configuration for Node.js ES modules
- Global Express error handler middleware in `app.js`
- `NODE_ENV` environment variable support for conditional stack trace exposure
- MIT `LICENSE` file

### Fixed

- **Critical:** `isImage()` in `video.validator.js` always returned `true` — now correctly uses `.some()` with `.endsWith()`
- **Critical:** `isVideo()` in `video.validator.js` used `.map()` causing only the last extension to be checked — fixed to use `.some()`
- **Critical:** `APIError` (OpenAI class) used instead of `ApiError` (local class) in `video.controller.js` — would crash at runtime
- **Bug:** HTTP status code `5000` (invalid) used in `tweet.controller.js` — corrected to `500`
- **Bug:** Typos `playlsit` → `playlist` in two error messages in `playlist.controller.js`
- **Bug:** Unused variable `response` in `dashboard.controller.js`
- **Bug:** Standalone no-op reference `mongooseAggregatePaginate;` removed from `comment.model.js`
- **Config:** Typo `trainlingComma` → `trailingComma` in `.prettierrc` — Prettier was silently ignoring trailing comma rules
- Typos `feild` → `field` in `user.validator.js` error messages

### Changed

- `multer.middleware.js` — unique filename generation using `Date.now()` + random suffix to prevent collisions and path-traversal issues
- `app.js` — route imports moved to top of file (ESM best practice); `urlencoded` body parser now applies `JSON_LIMIT`
- `src/index.js` — removed large commented-out dead code block; added Express `app.on("error")` listener; improved log messages
- `.gitignore` — expanded from 3 lines to comprehensive Node.js coverage (logs, coverage, OS artifacts, editor files)
- `.prettierrc` — added `printWidth: 100`
- `video.controller.js` — `generateAiDescription` refactored from mixed `.then()/.catch()` pattern to proper `async/await`

---

## [1.0.0] — 2025-03-01

### Added

- Initial release of Watchly REST API
- JWT authentication with access + refresh token rotation
- User registration, login, logout, and profile management
- Video upload, retrieval, and deletion with Cloudinary storage
- Automatic video preview generation via Cloudinary transformations
- AI-powered video description generation using OpenAI GPT-4o-mini
- Playlist CRUD with video management (add/remove)
- Like/unlike system for videos, comments, and tweets
- Comment system with pagination (add, update, delete)
- Tweet system (create, read, update, delete)
- Channel subscription system
- Watch history tracking
- Creator dashboard with channel stats and video management
- Category system with admin-only management
- Cursor-based pagination for scalable video listings
- Role-based authorization (`verifyJWT`, `verifyAdmin` middleware)
- Healthcheck endpoint
- Docker image published to Docker Hub (`dodoxd/watchly`)
- Dockerfile for containerized deployment
