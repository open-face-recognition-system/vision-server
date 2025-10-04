# Face Recognizer API

Face Recognizer is an attendance platform that links academic scheduling with automated facial recognition. The service authenticates users with JWT, manages students/teachers/subjects, and records attendance by matching classroom photos against trained classifiers.

## Highlights
- Role-aware REST API for admins, teachers, and students.
- Automated attendance via Eigenfaces/Fisherfaces/LBPH recognition pipelines.
- Postgres + TypeORM models with pagination-ready list endpoints.
- File management pluggable between local disk and DigitalOcean Spaces.
- CI/CD workflow that builds and deploys to DigitalOcean on pushes to `master`.

## Tech Stack
- Node.js 12 · TypeScript · Express
- TypeORM · PostgreSQL · tsyringe DI
- Multer · class-transformer · celebrate validation
- OpenCV (Python) recognizers invoked through worker scripts
- Jest + ts-jest for automated tests

## Getting Started
1. **Install prerequisites**: Node 12+, Yarn, Docker (optional), Python 3 with the packages listed in `requirements.txt` for OpenCV training.
2. **Install dependencies**: `yarn install`.
3. **Set environment**: copy `.env.example` to `.env` and fill database/App secret values. When running migrations from the host, export `DB_HOST=localhost`.
4. **Provision Postgres**: `docker compose -f docker-compose.postgres.yml up -d` or point to an existing database.
5. **Run migrations**: `DB_HOST=localhost yarn migration:run`.
6. **Start the API**: `yarn dev` (watch mode) or `yarn start` after `yarn build`.

Static files are exposed at `/files` (uploaded student photos) and `/recognitionFiles` (trained classifiers).

## Useful Scripts
- `yarn dev`: start the HTTP server with `ts-node-dev` and hot reload.
- `yarn build`: transpile TS to `dist/` using Babel.
- `yarn start`: run the compiled server from `dist/`.
- `yarn test`: execute Jest with coverage output.
- `yarn migration:run`: apply TypeORM migrations.
- `yarn schema:drop`: drop the current schema.
- `yarn seed:run`: seed demo data via `typeorm-seeding` scripts.

## Environment Variables
| Variable | Description | Default |
| --- | --- | --- |
| `APP_SECRET` | JWT signing secret | `default`
| `APP_URL` | External URL used in notifications/assets | `http://localhost:3333`
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASS` / `DB_NAME` | Postgres connection | `postgres` / `5432` / `postgres` / `postgres` / `face_recognizer`
| `STORAGE_DRIVER` | `disk` or `do` (DigitalOcean Spaces) | —
| `DO_ENDPOINT`, `DO_BUCKET`, `DO_DEFAULT_REGION`, `DO_ACCESS_KEY_ID`, `DO_SECRET_ACCESS_KEY` | Spaces credentials (if `STORAGE_DRIVER=do`) | —
| `RECOGNITION_DRIVER` | `eigenfaces`, `fisherfaces`, or `lbph` | —
| `SENTRY_DSN` | Optional error tracking endpoint | —

## Authentication & Authorization
- Issue a token with `POST /sessions` using an email/password pair. The response contains `token` and `refreshToken`.
- Refresh with `POST /refresh-tokens` by sending the previous `refreshToken`.
- Include `Authorization: Bearer <token>` in all protected requests.
- Role checks:
  - Public: `/users`, `/teachers`, `/students`, `/sessions`, `/refresh-tokens` (intended for bootstrap automation; secure with perimeter controls).
  - Authenticated (`admin`, `student`, `teacher`): photos & personal profile routes.
  - `admin` or `teacher`: class, subject, attendance, recognition operations.
  - `admin` only: destructive admin-only helpers (enforced via middleware order).

Errors follow `{ "status": "error", "message": "..." }` with relevant HTTP codes.

## API Reference
_All routes are prefixed by `/` (API v1 router mounts at the root). Pagination-aware endpoints accept query params such as `?page=1&limit=20&order=name:ASC`._

### Authentication
| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/sessions` | Public | Authenticate a user; returns `user`, `token`, and `refreshToken`. |
| `POST` | `/refresh-tokens` | Public | Exchange a refresh token for a new auth/refresh token pair. |

### Users & Roles
| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/users` | Public (bootstrap) | Create a base user (defaults to admin role per service rules). |
| `DELETE` | `/users/:id` | Admin | Remove a user and dependent records. |
| `GET` | `/students` | Admin/Teacher | List students (supports `name` filter and pagination). |
| `GET` | `/students/:id` | Admin/Teacher | Fetch a student profile with enrollment data. |
| `POST` | `/students` | Admin | Register a student by linking a user (`userId`) and enrollment code. |
| `PUT` | `/students/:id` | Admin | Update student name/email (cascades to linked user). |
| `GET` | `/teachers` | Admin | List teachers with pagination/search. |
| `GET` | `/teachers/:id` | Admin/Teacher | Fetch teacher details. |
| `POST` | `/teachers` | Admin | Register a teacher with an existing user and enrollment code. |
| `PUT` | `/teachers/:id` | Admin | Update teacher profile data. |

### Profiles & Photos
| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/profiles` | Student/Teacher/Admin | Return the authenticated user’s profile. |
| `PUT` | `/profiles/student` | Student | Update own profile and password. |
| `PUT` | `/profiles/:id/student` | Admin | Update a student profile by ID. |
| `PUT` | `/profiles/:id/teacher` | Admin | Update a teacher profile by ID. |
| `GET` | `/photos` | Student | List uploaded photos for the authenticated user. |
| `POST` | `/photos` | Student | Upload a new photo (`multipart/form-data` with `file`, optional `photoType` query). |
| `PUT` | `/photos/:id` | Student/Admin | Replace a stored photo by ID. |
| `DELETE` | `/photos/:id` | Student/Admin | Remove a stored photo. |

### Subjects & Enrollment
| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/subjects` | Admin/Teacher | List subjects with pagination and filters. |
| `GET` | `/subjects/:id` | Admin/Teacher | Show subject details including enrolled students. |
| `POST` | `/subjects` | Admin | Create a subject linked to a teacher. |
| `PUT` | `/subjects/:id` | Admin | Update subject metadata and teacher assignment. |
| `DELETE` | `/subjects/:id` | Admin | Delete a subject (cascades to classes/attendances). |
| `POST` | `/subjects/:id/enroll` | Admin/Teacher | Enroll a student by ID. |
| `POST` | `/subjects/:id/enroll/pdf` | Admin/Teacher | Bulk enroll students by uploading a roster PDF. |
| `POST` | `/subjects/:id/unenroll` | Admin/Teacher | Remove a student from a subject. |
| `GET` | `/subjects/teacher` | Teacher | List subjects for the authenticated teacher. |
| `GET` | `/subjects/teacher/:teacherId` | Admin | List subjects for a specific teacher. |

### Semesters, Classes & Attendance
| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/semesters` | Admin | List semesters. |
| `GET` | `/semesters/:id` | Admin | Get semester details. |
| `POST` | `/semesters` | Admin | Create a semester with start/end dates. |
| `PUT` | `/semesters/:id` | Admin | Update semester dates. |
| `DELETE` | `/semesters/:id` | Admin | Remove a semester. |
| `GET` | `/classes` | Admin | Paginated list of classes. |
| `GET` | `/classes/:id` | Admin/Teacher | Show class metadata including subject and attendance slots. |
| `POST` | `/classes` | Admin | Schedule a class; automatically creates attendance placeholders for enrolled students. |
| `PUT` | `/classes/:id` | Admin | Update class timing/associations. |
| `DELETE` | `/classes/:id` | Admin | Delete a scheduled class. |
| `GET` | `/classes/teacher` | Teacher | Paginated classes for the authenticated teacher. |
| `GET` | `/classes/teacher/:teacherId` | Admin | Paginated classes for a specific teacher. |
| `GET` | `/classes/teacher/classes/mobile` | Teacher | Mobile-friendly summary of upcoming classes. |
| `GET` | `/attendances` | Admin | Paginated attendance records. |
| `GET` | `/attendances/:id` | Admin/Teacher | Inspect a single attendance entry. |
| `GET` | `/attendances/class/:classId` | Admin/Teacher | List all attendance entries for a class. |
| `POST` | `/attendances` | Admin/Teacher | Create an attendance override (manual mark). |
| `PUT` | `/attendances/:id` | Admin/Teacher | Update an attendance entry. |
| `DELETE` | `/attendances/:id` | Admin | Remove an attendance entry. |

### Recognition Workflow
| Method | Path | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/recognition/training/:subjectId` | Admin/Teacher | Train a classifier using enrolled students’ photos (stores model under `/recognitionFiles`). |
| `POST` | `/recognition/recognize/:classId` | Admin/Teacher | Upload a classroom photo (`file`) to detect faces and auto-mark attendance; returns the matched student, attendance ID, and confidence. |
| `POST` | `/recognition/update/:classId/student/:studentId` | Admin/Teacher | Upload an additional photo to refine the model for a specific student and class. |

## Recognition Pipeline
1. **Collect photos**: students upload sample images via `/photos`.
2. **Enroll students**: assign them to subjects (`/subjects/:id/enroll` or PDF upload).
3. **Schedule classes**: `/classes` automatically seeds attendance placeholders.
4. **Train**: call `/recognition/training/:subjectId` to produce or refresh classifiers.
5. **Recognize**: during class, upload a photo to `/recognition/recognize/:classId`; the service updates attendance and returns match confidence.
6. **Tweak**: use `/recognition/update/:classId/student/:studentId` when manual corrections are needed.

## Testing & Quality
- Unit/service tests: `yarn test` (coverage collected from `src/modules/**/services/*.ts`).
- Linting: ESLint (Airbnb + TypeScript) and Prettier enforced via Husky hooks.
- Commit messages: Conventional Commits (`feat:`, `fix:`, etc.) with Commitizen prompts.

## Deployment Notes
- CI installs dependencies, runs `yarn build`, syncs to DigitalOcean via SCP, installs server-side dependencies, runs migrations, and restarts PM2.
- Ensure the necessary secrets (`SSH_HOST`, `SSH_USER`, `SSH_KEY`, etc.) are configured in GitHub Actions.

For deeper contributing guidance, see `AGENTS.md` for agent-friendly instructions.
