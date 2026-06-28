<div align="center">

# 🎬 StreamForge API

**A production-grade, full-featured YouTube-inspired video platform REST API**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_Storage-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
[![Docker](https://img.shields.io/badge/Docker-Hub-2496ED?style=flat-square&logo=docker&logoColor=white)](https://hub.docker.com/r/dodoxd/watchly)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/DoDoxD1/youtube-clone/ci.yml?style=flat-square&label=CI)](/.github/workflows/ci.yml)

[**Docker Hub**](https://hub.docker.com/r/dodoxd/watchly) · [**API Reference**](#-api-reference) · [**Architecture**](#-architecture) · [**Quick Start**](#-quick-start)

</div>

---

## 📖 Overview

Watchly is a **scalable, RESTful backend API** that replicates the core functionality of YouTube. Built with modern Node.js best practices, it provides a complete content platform backend including media management, social engagement features, creator analytics, and AI-powered tooling.

| What it solves                                      | Who it's for                                          |
| --------------------------------------------------- | ----------------------------------------------------- |
| Bootstrapping a video-sharing backend from scratch  | Developers building video/content platforms           |
| Learning production-grade Node.js API architecture  | Students & engineers studying full-stack development  |
| A portfolio-ready backend to pair with any frontend | Engineers targeting SWE interviews & job applications |

---

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based auth** with stateless access tokens (short-lived) + stateful refresh tokens (long-lived)
- **Secure token rotation** — every refresh generates a new refresh token and invalidates the old
- **Role-based access control** — regular users vs. admin users enforced at middleware level
- **HttpOnly cookie delivery** + `Authorization: Bearer` header support for flexible client integration

### 🎥 Video Platform

- **Video upload** with automatic Cloudinary CDN storage and duration extraction
- **Auto-generated video previews** — 3-segment highlight clips via Cloudinary video transformations
- **AI-powered description generation** using OpenAI GPT-4o-mini with SEO optimization
- **Cursor-based pagination** for infinite-scroll feeds — O(1) query performance regardless of dataset size
- **Category system** — 15 predefined categories with admin-only management
- **View tracking** per video

### 👥 Social Features

- **Channel subscriptions** — subscribe/unsubscribe with subscriber count aggregation
- **Like / unlike toggle** on videos, comments, and tweets
- **Threaded comments** — nested reply support with paginated loading
- **Tweets** — short-form text posts attached to a user's channel (YouTube Community Posts equivalent)
- **Watch history** — per-user history with full video + owner data via MongoDB `$lookup` pipelines
- **Liked videos feed** — aggregated list of all content a user has liked

### 📊 Creator Dashboard

- **Channel analytics** — total views, subscribers, likes, videos, and tweets in a single query
- **Video management** — list, view, update, and delete your own videos
- **Thumbnail updates** — replace video thumbnails with automatic Cloudinary cleanup

### 🛠 Developer Features

- **Consistent API shape** — every endpoint returns `{ statusCode, data, message, success }`
- **Centralized error handling** — global Express error middleware with dev stack traces
- **Multer file handling** — collision-safe unique filename generation
- **Healthcheck endpoint** for load balancer / container orchestration probes
- **Docker-ready** — single-command startup with Docker Compose

---

## 🏗 Architecture

### System Design Overview

```mermaid
graph TB
    Client["🌐 Client\n(Browser / Mobile / Postman)"]

    subgraph API["Watchly API — Express.js"]
        MW["Middleware Layer\ncors · cookieParser · multer"]
        AUTH["Auth Middleware\nverifyJWT · verifyAdmin"]
        ROUTES["Route Layer\n9 resource routers"]
        CTRL["Controller Layer\nBusiness logic"]
        VAL["Validators\nuser · video"]
        UTILS["Utilities\nApiError · ApiResponse · asyncHandler"]
    end

    subgraph Storage["External Storage"]
        MONGO[("MongoDB Atlas\nwatchly database")]
        CLOUD["☁️ Cloudinary CDN\nVideos · Thumbnails · Avatars"]
        OAI["🤖 OpenAI API\nGPT-4o-mini"]
    end

    Client -->|"HTTP Request"| MW
    MW --> AUTH
    AUTH --> ROUTES
    ROUTES --> CTRL
    CTRL --> VAL
    CTRL --> UTILS
    CTRL <-->|"Mongoose ODM"| MONGO
    CTRL <-->|"SDK"| CLOUD
    CTRL <-->|"SDK"| OAI
    UTILS -->|"JSON Response"| Client
```

### Data Flow — Authenticated Request

```mermaid
sequenceDiagram
    participant C as Client
    participant MW as Middleware
    participant JWT as verifyJWT
    participant CTRL as Controller
    participant DB as MongoDB

    C->>MW: POST /api/v1/videos (Bearer token)
    MW->>JWT: Extract token from cookie/header
    JWT->>DB: User.findById(decodedToken._id)
    DB-->>JWT: User document
    JWT->>MW: req.user = user
    MW->>CTRL: Forward request + user context
    CTRL->>DB: Video.create({...})
    DB-->>CTRL: Saved document
    CTRL-->>C: 200 { success, data, message }
```

### Token Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Login: POST /users/login
    Login --> Active: Issue access + refresh tokens (HttpOnly cookies)
    Active --> Expired: Access token expires (1d default)
    Expired --> Active: POST /users/refresh-token → new token pair
    Active --> LoggedOut: POST /users/logout → unset refreshToken in DB
    LoggedOut --> [*]
```

### Database Schema

```mermaid
erDiagram
    User {
        ObjectId _id PK
        string username UK
        string email UK
        string fullName
        string avatar
        string coverImage
        string password
        boolean admin
        string refreshToken
        ObjectId[] watchHistory FK
    }
    Video {
        ObjectId _id PK
        string videoFile
        string thumbnail
        string videoPreview
        string title
        string description
        number duration
        number views
        boolean isPublished
        ObjectId owner FK
        ObjectId category FK
    }
    Comment {
        ObjectId _id PK
        string content
        ObjectId video FK
        ObjectId owner FK
        ObjectId comment FK
    }
    Like {
        ObjectId _id PK
        ObjectId likedBy FK
        ObjectId video FK
        ObjectId comment FK
        ObjectId tweet FK
    }
    Subscription {
        ObjectId _id PK
        ObjectId subscriber FK
        ObjectId channel FK
    }
    Playlist {
        ObjectId _id PK
        string name
        string description
        ObjectId owner FK
        ObjectId[] videos FK
    }
    Tweet {
        ObjectId _id PK
        string content
        ObjectId owner FK
    }
    Category {
        ObjectId _id PK
        string title UK
    }

    User ||--o{ Video : "owns"
    User ||--o{ Comment : "writes"
    User ||--o{ Tweet : "posts"
    User ||--o{ Playlist : "curates"
    User ||--o{ Like : "gives"
    User ||--o{ Subscription : "subscriber"
    User ||--o{ Subscription : "channel"
    Video ||--o{ Comment : "receives"
    Video ||--o{ Like : "receives"
    Video }o--|| Category : "belongs to"
    Comment ||--o{ Like : "receives"
    Tweet ||--o{ Like : "receives"
    Playlist }o--o{ Video : "contains"
```

---

## 🧰 Tech Stack

| Layer                | Technology                       | Purpose                             |
| -------------------- | -------------------------------- | ----------------------------------- |
| **Runtime**          | Node.js 20 LTS                   | JavaScript server runtime           |
| **Framework**        | Express 4                        | HTTP server & middleware            |
| **Database**         | MongoDB + Mongoose 8             | Document store + ODM                |
| **Pagination**       | mongoose-aggregate-paginate-v2   | Aggregate query pagination          |
| **Auth**             | JSON Web Tokens (`jsonwebtoken`) | Stateless auth tokens               |
| **Password Hashing** | bcrypt                           | Secure password storage (10 rounds) |
| **Media Storage**    | Cloudinary SDK v2                | Video, thumbnail, avatar CDN        |
| **File Uploads**     | Multer                           | Multipart form handling             |
| **AI**               | OpenAI SDK (GPT-4o-mini)         | Description generation              |
| **CORS**             | `cors`                           | Cross-origin resource sharing       |
| **Cookies**          | `cookie-parser`                  | HttpOnly cookie handling            |
| **Config**           | `dotenv`                         | Environment variable management     |
| **Containerization** | Docker + Docker Compose          | Portable deployment                 |
| **CI/CD**            | GitHub Actions                   | Lint, format, build validation      |
| **Formatting**       | Prettier                         | Code style consistency              |
| **Linting**          | ESLint                           | Static code analysis                |

---

## 📁 Project Structure

```
watchly-api/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── public/
│   └── temp/                   # Temporary multer upload staging
├── src/
│   ├── controllers/            # Business logic per resource
│   │   ├── category.controller.js
│   │   ├── comment.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── healthcheck.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── tweet.controller.js
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   ├── db/
│   │   └── index.js            # MongoDB connection setup
│   ├── middlewares/
│   │   ├── auth.middleware.js  # verifyJWT + verifyAdmin
│   │   └── multer.middleware.js # File upload handling
│   ├── models/                 # Mongoose schemas
│   │   ├── category.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   ├── tweet.model.js
│   │   ├── user.model.js
│   │   └── video.model.js
│   ├── routes/                 # Express routers per resource
│   │   ├── category.routes.js
│   │   ├── comment.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── healthcheck.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── tweet.routes.js
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   ├── utils/
│   │   ├── ApiError.js         # Custom Error class with statusCode
│   │   ├── ApiResponse.js      # Consistent response shape
│   │   ├── asyncHandler.js     # Promise rejection wrapper
│   │   └── Cloudinary.js       # Upload + delete + public ID extraction
│   ├── validators/
│   │   ├── user.validator.js   # Field presence + email regex
│   │   └── video.validator.js  # File extension validation
│   ├── app.js                  # Express app setup + global error handler
│   ├── constants.js            # DB_NAME, JSON_LIMIT
│   └── index.js                # Server bootstrap + DB connection
├── .dockerignore
├── .env.example                # Environment variable template
├── .eslintrc.json
├── .gitignore
├── .prettierignore
├── .prettierrc
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── Dockerfile
├── docker-compose.yml
├── LICENSE
├── README.md
├── SECURITY.md
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement        | Version | Notes                                           |
| ------------------ | ------- | ----------------------------------------------- |
| Node.js            | ≥ 20.x  | [Download](https://nodejs.org)                  |
| npm                | ≥ 10.x  | Bundled with Node.js                            |
| MongoDB            | ≥ 6.x   | Atlas (cloud) or local                          |
| Cloudinary account | —       | [Sign up free](https://cloudinary.com)          |
| OpenAI API key     | —       | [Get key](https://platform.openai.com/api-keys) |
| Docker (optional)  | ≥ 24.x  | For containerized setup                         |

---

### Option A — Local Development

```bash
# 1. Clone the repository
git clone https://github.com/DoDoxD1/youtube-clone.git
cd youtube-clone

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Open .env and fill in your values (see Environment Variables section)

# 4. Start in development mode (auto-restart on changes)
npm run dev

# 5. Verify the server is running
curl http://localhost:3000/api/v1/healthcheck
# → { "statusCode": 200, "data": {}, "message": "Ok", "success": true }
```

---

### Option B — Docker Compose (Recommended)

Spins up the API **and** a local MongoDB instance together:

```bash
# 1. Clone and enter directory
git clone https://github.com/kevin-chaudhari/youtube-clone.git
cd youtube-clone

# 2. Configure environment
cp .env.example .env
# Edit .env — for Docker Compose, set MONGO_URI=mongodb://mongo:27017

# 3. Start the full stack
docker compose up --build

# 4. Run in background
docker compose up -d
```

---

### Option C — Docker Hub (Fastest)

Pull the pre-built image and run with your own `.env`:

```bash
# Pull the image
docker pull dodoxd/watchly

# Run with your environment file
docker run --env-file .env -p 3000:3000 dodoxd/watchly
```

🔗 [Docker Hub: dodoxd/watchly](https://hub.docker.com/r/dodoxd/watchly)

---

## ⚙️ Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

| Variable                | Description                           | Required                    | Example                                       |
| ----------------------- | ------------------------------------- | --------------------------- | --------------------------------------------- |
| `PORT`                  | HTTP server port                      | No (default: 3000)          | `3000`                                        |
| `MONGO_URI`             | Full MongoDB connection string        | ✅ Yes                      | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `CORS_ORIGIN`           | Allowed client origin(s)              | ✅ Yes                      | `https://yourapp.com` or `*` (dev only)       |
| `ACCESS_TOKEN_SECRET`   | JWT signing secret for access tokens  | ✅ Yes                      | Long random string (≥32 chars)                |
| `ACCESS_TOKEN_EXPIRY`   | Access token lifetime                 | No (default: `1d`)          | `15m`, `1h`, `1d`                             |
| `REFRESH_TOKEN_SECRET`  | JWT signing secret for refresh tokens | ✅ Yes                      | Different long random string                  |
| `REFRESH_TOKEN_EXPIRY`  | Refresh token lifetime                | No (default: `10d`)         | `7d`, `30d`                                   |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name            | ✅ Yes                      | `my-cloud`                                    |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                    | ✅ Yes                      | `123456789012345`                             |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                 | ✅ Yes                      | `abc123...`                                   |
| `OPENAI_API_KEY`        | OpenAI API key for AI descriptions    | ✅ Yes                      | `sk-...`                                      |
| `NODE_ENV`              | Runtime environment                   | No (default: `development`) | `production`                                  |

> **⚠️ Security:** In production, set `CORS_ORIGIN` to your exact frontend URL, never `*`. Set `NODE_ENV=production` to suppress stack traces in error responses.

---

## 📡 API Reference

**Base URL:** `http://localhost:3000/api/v1`

> 🔒 = Requires `Authorization: Bearer <token>` header or `accessToken` cookie  
> 👑 = Requires admin role

---

### 🙍 Users — `/users`

| Method  | Endpoint             | Auth | Description                                   |
| ------- | -------------------- | ---- | --------------------------------------------- |
| `POST`  | `/register`          | —    | Register with avatar + optional cover image   |
| `POST`  | `/login`             | —    | Login, receive access + refresh token cookies |
| `POST`  | `/logout`            | 🔒   | Logout and clear token cookies                |
| `POST`  | `/refresh-token`     | 🔒   | Rotate access + refresh tokens                |
| `POST`  | `/change-password`   | 🔒   | Change password (validates old password)      |
| `GET`   | `/get-user`          | 🔒   | Get current authenticated user's profile      |
| `PATCH` | `/update-user`       | 🔒   | Update `fullName` and/or `email`              |
| `PATCH` | `/update-avatar`     | 🔒   | Replace avatar image (Cloudinary)             |
| `PATCH` | `/update-cover-img`  | 🔒   | Replace cover image (Cloudinary)              |
| `GET`   | `/c/:username`       | —    | Get channel profile with subscriber counts    |
| `POST`  | `/subscribe-channel` | 🔒   | Subscribe to a channel                        |
| `GET`   | `/history`           | 🔒   | Get authenticated user's watch history        |

---

### 🎬 Videos — `/videos`

| Method   | Endpoint            | Auth | Description                                         |
| -------- | ------------------- | ---- | --------------------------------------------------- |
| `GET`    | `/`                 | —    | Paginated video feed (cursor-based)                 |
| `POST`   | `/`                 | 🔒   | Upload video + thumbnail to Cloudinary              |
| `GET`    | `/v/:videoId`       | —    | Get video by ID with owner details                  |
| `DELETE` | `/v/:videoId`       | 🔒   | Delete video (owner only) — removes from Cloudinary |
| `GET`    | `/generate-ai-desc` | 🔒   | Generate AI video description via GPT-4o-mini       |

**Pagination query params for `GET /videos`:**

| Param       | Type            | Default | Description                              |
| ----------- | --------------- | ------- | ---------------------------------------- |
| `limit`     | number          | `10`    | Results per page                         |
| `cursor`    | string          | —       | ID of the last item from previous page   |
| `sortOrder` | `asc` \| `desc` | `desc`  | Sort direction (newest first by default) |

---

### 🎵 Playlists — `/playlist`

| Method   | Endpoint                       | Auth | Description                                   |
| -------- | ------------------------------ | ---- | --------------------------------------------- |
| `POST`   | `/`                            | 🔒   | Create playlist with initial videos           |
| `GET`    | `/my-playlists`                | 🔒   | Get all playlists owned by current user       |
| `GET`    | `/:playlistId`                 | —    | Get playlist by ID with full video details    |
| `PATCH`  | `/:playlistId`                 | 🔒   | Update playlist name/description (owner only) |
| `DELETE` | `/:playlistId`                 | 🔒   | Delete playlist (owner only)                  |
| `PATCH`  | `/add/:videoId/:playlistId`    | 🔒   | Add a video to playlist (owner only)          |
| `PATCH`  | `/remove/:videoId/:playlistId` | 🔒   | Remove a video from playlist (owner only)     |

---

### 👍 Likes — `/likes`

| Method | Endpoint               | Auth | Description                          |
| ------ | ---------------------- | ---- | ------------------------------------ |
| `POST` | `/toggle/v/:videoId`   | 🔒   | Toggle like on a video               |
| `POST` | `/toggle/t/:tweetId`   | 🔒   | Toggle like on a tweet               |
| `POST` | `/toggle/c/:commentId` | 🔒   | Toggle like on a comment             |
| `GET`  | `/videos`              | 🔒   | Get all videos liked by current user |

---

### 💬 Comments — `/comments`

| Method   | Endpoint        | Auth | Description                         |
| -------- | --------------- | ---- | ----------------------------------- |
| `GET`    | `/:videoId`     | —    | Get paginated comments for a video  |
| `POST`   | `/:videoId`     | 🔒   | Add a comment to a video            |
| `PATCH`  | `/c/:commentId` | 🔒   | Update comment content (owner only) |
| `DELETE` | `/c/:commentId` | 🔒   | Delete a comment (owner only)       |

---

### 🐦 Tweets — `/tweets`

| Method   | Endpoint        | Auth | Description                       |
| -------- | --------------- | ---- | --------------------------------- |
| `POST`   | `/`             | 🔒   | Create a new tweet                |
| `GET`    | `/user/:userId` | —    | Get all tweets from a user        |
| `PATCH`  | `/:tweetId`     | 🔒   | Update tweet content (owner only) |
| `DELETE` | `/:tweetId`     | 🔒   | Delete a tweet (owner only)       |

---

### 📊 Dashboard — `/dashboard`

| Method  | Endpoint           | Auth | Description                                                   |
| ------- | ------------------ | ---- | ------------------------------------------------------------- |
| `GET`   | `/stats`           | 🔒   | Channel analytics (views, subscribers, likes, videos, tweets) |
| `GET`   | `/videos`          | 🔒   | Paginated list of the authenticated user's videos             |
| `GET`   | `/videos/:videoId` | 🔒   | Get single video (owner only)                                 |
| `PATCH` | `/videos/:videoId` | 🔒   | Update title, description, or thumbnail (owner only)          |

---

### 🗂 Categories — `/category`

| Method   | Endpoint  | Auth     | Description                  |
| -------- | --------- | -------- | ---------------------------- |
| `GET`    | `/all`    | —        | Get all available categories |
| `POST`   | `/add`    | 👑 Admin | Create a new category        |
| `PATCH`  | `/modify` | 👑 Admin | Rename a category            |
| `DELETE` | `/remove` | 👑 Admin | Delete a category            |

**Available categories:** Cars & Vehicles, Comedy, Education, Gaming, Entertainment, Film & Animation, How-to & Style, Music, News & Politics, People & Blogs, Pets & Animals, Science & Technology, Sports, Travel & Events, Uncategorised

---

### ❤️ Health — `/healthcheck`

| Method | Endpoint       | Auth | Description                                      |
| ------ | -------------- | ---- | ------------------------------------------------ |
| `GET`  | `/healthcheck` | —    | Returns `200 OK` — used by Docker/load balancers |

---

## ⚡ Performance Design

### Cursor-Based Pagination

Offset-based pagination (`SKIP n`) requires MongoDB to scan and discard `n` documents — this degrades linearly as data grows. Watchly uses **cursor-based pagination** on the `_id` field:

```
GET /api/v1/videos?limit=10&cursor=<lastId>&sortOrder=desc
```

- MongoDB uses the `_id` index directly — O(log n) lookup regardless of dataset size
- No duplicate or missing records when new content is inserted between pages
- Returns `nextCursor` and `hasMore` for clean infinite-scroll client integration

### MongoDB Aggregation Pipelines

Complex data requirements (channel stats, watch history with owner details, liked videos feed) are resolved **server-side** in a single database round-trip using `$lookup`, `$match`, `$group`, and `$addFields` pipeline stages — eliminating N+1 query problems.

### Cloudinary Media Optimization

- Uploaded files are **deleted from local disk** immediately after Cloudinary upload
- **Public ID extraction** from URL allows targeted asset deletion on video/avatar replace
- **Video previews** generated server-side via Cloudinary URL transformations (no client processing)

---

## 🔒 Security

| Measure                      | Implementation                                                            |
| ---------------------------- | ------------------------------------------------------------------------- |
| **Password hashing**         | bcrypt with 10 salt rounds                                                |
| **Stateless auth**           | JWT access tokens — no server-side session storage                        |
| **Token refresh security**   | Refresh tokens stored in DB; old token invalidated on every rotation      |
| **HttpOnly cookies**         | Prevents XSS access to tokens via `document.cookie`                       |
| **File type validation**     | Extension whitelist checked before Cloudinary upload                      |
| **Ownership enforcement**    | Every mutation verifies `req.user._id === resource.owner`                 |
| **Admin middleware**         | `verifyAdmin` checks `user.admin` flag before any privileged action       |
| **Request size limiting**    | `express.json({ limit: "16kb" })` prevents payload flooding               |
| **Unique file names**        | Multer uses `Date.now() + random` to prevent filename collision/traversal |
| **Production error masking** | Stack traces omitted from responses when `NODE_ENV=production`            |
| **CORS**                     | Configurable origin allowlist via `CORS_ORIGIN` env var                   |

---

## 🔮 Future Enhancements

- [ ] **Search** — full-text video search with MongoDB text indexes or Elasticsearch
- [ ] **Rate limiting** — per-IP and per-user rate limits using `express-rate-limit`
- [ ] **Video transcoding** — adaptive bitrate streaming (HLS) via Cloudinary or FFmpeg
- [ ] **Real-time notifications** — WebSocket-based notification system for likes/comments/subs
- [ ] **Watch history deduplication** — prevent duplicate entries on rewatch
- [ ] **Email verification** — SMTP-based account verification on registration
- [ ] **Unit & integration tests** — Jest + Supertest test suite with ≥80% coverage
- [ ] **Recommendation engine** — category and watch history based video recommendations
- [ ] **Frontend** — React/Next.js client: [yt-clone-fullstack](https://github.com/DoDoxD1/yt-clone-fullstack)

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the branch naming convention, commit format, and pull request process.

Please also review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## 🔐 Security Reporting

**Do not open a public issue for security vulnerabilities.** See [SECURITY.md](SECURITY.md) for the responsible disclosure process.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Arihant Jain**

> Building scalable backends and full-stack web applications.

[![GitHub](https://img.shields.io/badge/GitHub-DoDoxD1-181717?style=flat-square&logo=github)](https://github.com/DoDoxD1)
[![Docker Hub](https://img.shields.io/badge/Docker_Hub-dodoxd-2496ED?style=flat-square&logo=docker&logoColor=white)](https://hub.docker.com/u/dodoxd)

---

## 📝 Resume Highlights

> Copy-paste ready bullets for your software engineering resume or portfolio.

- Architected a **production-grade YouTube-inspired REST API** in Node.js/Express serving 9 resource domains across 40+ endpoints, with JWT authentication, role-based authorization, and cursor-based pagination
- Engineered **cursor-based pagination** using MongoDB `_id` indexing, eliminating `SKIP`-based O(n) scans for O(log n) page queries that scale linearly with data volume
- Designed a **JWT token rotation system** with short-lived access tokens and long-lived refresh tokens stored in MongoDB, supporting both HttpOnly cookie and `Authorization` header delivery
- Integrated **Cloudinary media pipeline** for video, thumbnail, and avatar storage with automatic local temp-file cleanup, public ID extraction, and server-generated 3-segment video previews via URL transformations
- Built **OpenAI GPT-4o-mini integration** for AI-powered SEO-optimized video description generation, reducing content creation time with a single API call
- Implemented **MongoDB aggregation pipelines** (`$lookup`, `$group`, `$addFields`) for O(1) channel analytics, watch history, and liked-video feeds — eliminating N+1 query patterns
- Applied **security best practices** including bcrypt password hashing (10 rounds), file extension whitelisting, request payload size limiting, ownership enforcement on every mutation, and production error masking
- Containerized the full application with a **multi-stage Dockerfile** (non-root user, dumb-init, healthcheck) and authored a Docker Compose stack with MongoDB dependency health checks
- Configured **GitHub Actions CI** pipeline with Prettier format validation, ESLint static analysis, and Docker build verification on every push and pull request

---

<div align="center">

**⭐ If this project helped you, please give it a star!**

</div>
