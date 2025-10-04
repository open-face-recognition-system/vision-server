# Repository Guidelines

## Project Structure & Module Organization
Core source lives in `src/`. Domain features sit in `modules/<domain>` with `services/` classes and supporting providers, while cross-cutting code lives in `shared/` (container bindings, HTTP server, errors). Configuration helpers are in `src/config`, custom typings in `src/@types`, and build artifacts land in `dist/`. Integration assets (OpenCV models, temporary files) stay under `opencv/` and `tmp/`, with reusable fixtures in `tests/resources`.

## Build, Test, and Development Commands
- `yarn install`: install Node 12-compatible dependencies.
- `yarn dev`: run the API in watch mode via `ts-node-dev`, entrypoint `src/shared/infra/http/server.ts`.
- `yarn build`: transpile TypeScript/ES modules to `dist/` with Babel.
- `yarn start`: launch the compiled server (use after `yarn build`).
- `yarn test`: execute the Jest suite with coverage output.
- `yarn migration:run` / `yarn schema:drop`: manage TypeORM migrations against the configured database.
- `yarn seed:run`: populate development data with `typeorm-seeding`.

## Coding Style & Naming Conventions
TypeScript is the default; keep files in PascalCase for classes (`CreateTeacherService.ts`) and suffix specs with `.spec.ts`. Follow the enforced 2-space indentation from `.editorconfig`, single quotes and trailing commas from `prettier.config.js`, and the Airbnb + `@typescript-eslint` lint rules. Register new providers in `shared/container` so DI via `tsyringe` stays consistent.

## Testing Guidelines
Jest (`ts-jest`) runs in Node mode and collects coverage from `src/modules/**/services/*.ts`. Place unit specs alongside services as `<Name>.spec.ts`, prefer deterministic fixtures under `tests/resources`, and mock external services to keep tests local. Ensure `yarn test` passes before pushing; CI surfaces coverage summaries but no thresholds are enforced yet—keep new service logic covered.

## Commit & Pull Request Guidelines
Commits follow Conventional Commits (`feat:`, `fix:`, `chore:`); Husky + Commitizen prompts appear on `git commit`, so supply clear scopes (e.g., `feat(users): add profile photo upload`). Reference ticket IDs in the body when relevant. Pull requests should describe the change, list testing (`yarn test`, manual API checks), call out migration impacts, and include screenshots or sample payloads for HTTP changes. Pushes to `master` trigger CI that builds and deploys to DigitalOcean, so only merge once the branch is green.

## Environment & Deployment Notes
Copy `.env.example` into `.env` and adjust database, storage, and AWS credentials before running locally. `docker-compose.yml` provisions backing services for development; keep it updated when adding dependencies. Secrets used by GitHub Actions (`SSH_HOST`, `SSH_KEY`, etc.) are deployment-critical—never commit overrides, and prefer `.env.local` entries for experimental values.
