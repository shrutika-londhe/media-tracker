# Media Tracker

A full-stack personal media & reading tracker — log everything you read, watch, and listen to in one place.

**Stack:** React (Vite) · Spring Boot 3 · MySQL · Spring Security + JWT · Hibernate/JPA · Maven

This repo is a **working scaffold**: authentication (register/login/JWT), a `MediaItem` entity covering books/manga/anime/shows/podcasts/etc., protected CRUD APIs, and a React frontend with protected routes and a dashboard shell. It's built to be extended — the dashboard stats, collections, wishlists, import/export, and the rest of the full feature list from the spec are the next layers to add on top of this foundation.

## Project structure

```
media-tracker/
├── backend/                 # Spring Boot API
│   └── src/main/java/com/mediatracker/
│       ├── config/          # Security, CORS, OpenAPI config
│       ├── security/        # JWT filter, JWT util, user details service
│       ├── entity/          # JPA entities (User, MediaItem) + enums
│       ├── repository/      # Spring Data JPA repositories
│       ├── dto/             # Request/response DTOs
│       ├── service/         # Business logic
│       ├── controller/      # REST controllers
│       └── exception/       # Global exception handling
├── frontend/                # React (Vite) SPA
│   └── src/
│       ├── context/         # AuthContext (JWT storage, login/logout)
│       ├── services/        # Axios API client
│       ├── routes/          # ProtectedRoute wrapper
│       └── pages/           # Login, Register, Dashboard
└── docker-compose.yml        # MySQL + backend + frontend, for local dev
```

## Running locally

### 1. Database

Either use Docker: `docker compose up mysql -d`, or point at your own local MySQL instance and create a database:

```sql
CREATE DATABASE media_tracker;
```

### 2. Backend

```bash
cd backend
# application.yml is already present with local dev defaults — edit it with
# your real DB credentials + a proper JWT secret before running
mvn spring-boot:run
```

(This scaffold doesn't include the Maven wrapper binary. If you want `./mvnw`, run `mvn -N wrapper:wrapper` once inside `backend/` to generate it.)

The API starts on `http://localhost:8080`. Swagger UI is at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app starts on `http://localhost:5173` and talks to the API via the `VITE_API_URL` env var (defaults to `http://localhost:8080/api`).

### 4. Full stack via Docker Compose

```bash
docker compose up --build
```

## What's implemented vs. what's next

**Implemented in this scaffold:**
- User registration/login with BCrypt password hashing
- Stateless JWT authentication (access token, `Authorization: Bearer`) + a Spring Security filter chain
- Global CORS config for the frontend origin
- `MediaItem` entity with category/status enums, progress fields, rating, notes, and a first CRUD API (create, list mine, get one, update, delete)
- Global exception handler returning consistent JSON error bodies
- React app with an `AuthContext`, protected routes, an Axios client that attaches the JWT, and Login/Register/Dashboard pages
- Docker Compose for local MySQL + services
- GitHub Actions CI stub (`.github/workflows/ci.yml`) that builds both apps on push

**Not yet built (natural next phases):**
- Full dashboard stats/heatmaps/charts, wishlist, collections, favorites, custom categories
- Password reset / email verification flow
- File upload for cover images / avatars
- Search, filtering, sorting endpoints
- CSV/JSON export
- Pagination on list endpoints (repository is ready for `Pageable`, controller isn't wired yet)
- Production deployment configs (Railway/Render/Vercel env setup)

Happy to build out any of these next — this scaffold is meant to be a clean base to layer them onto.
