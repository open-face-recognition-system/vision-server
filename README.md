# Vision Server

API of Vision, a classroom attendance system based on face recognition. Students sign up and upload face photos from the mobile app, admins manage semesters, subjects, classes and enrollments from the web app, and teachers take attendance by photographing students during class.

Node 24, Express 5, TypeORM 1 on Postgres, and OpenCV (`opencv/recognizer.py`) for training and recognition.

## Running locally

```bash
cp .env.example .env   # set APP_SECRET and ADMIN_PASSWORD
docker compose up -d --build
bin/smoke.sh           # end-to-end check: sign-up, photos, training, recognition
```

The server listens on `3333`, applies pending migrations on boot and creates the `ADMIN_EMAIL` user when it does not exist. Photos and trained models live in the `storage` volume mounted at `/data`.

For development outside Docker, start only Postgres (`docker compose up -d db`), install `python3-opencv` and run:

```bash
npm install
npm run dev
```

## Tests

```bash
npm run typecheck && npm test                          # API, including the role matrix of every route
cd opencv && python3 -m unittest -v test_recognizer    # needs python3-opencv
```

## Recognition

Each subject has its own model, trained from the photos of its enrolled students (`POST /recognition/training/:subjectId`). `RECOGNITION_ALGORITHM` picks `lbph` (default), `eigenfaces` or `fisherfaces`; the cross-validation project measured LBPH as the most accurate. A prediction farther than `RECOGNITION_THRESHOLD` is rejected, so tune it per algorithm if students are rejected or confused. Changing the algorithm requires training the subjects again, and only LBPH supports updating a model with new photos.

## Access

| Role | Can |
|---|---|
| anyone | sign in, refresh a token, sign up as a student (`POST /students`) |
| student | manage their own photos and profile |
| teacher | read semesters, subjects, classes and attendances, update attendances, train and recognize |
| admin | everything else, including creating teachers |

## Release

Every push to `master` publishes `<DOCKERHUB_USERNAME>/vision-server:latest` and `:sha-<short>` to Docker Hub after tests pass. Tagging `vX.Y.Z` also publishes `:X.Y.Z` and `:X.Y`.

```bash
git tag v2.0.0 && git push origin v2.0.0
```

The workflow needs a `DOCKERHUB_USERNAME` variable and a `DOCKERHUB_TOKEN` secret in the repository settings.

## Running the published image

```bash
docker run -d --name vision-server --restart unless-stopped --env-file .env \
  -e DB_HOST=<db-host> -v vision-storage:/data -p 3333:3333 \
  <DOCKERHUB_USERNAME>/vision-server:latest
```

If a required variable is missing the container stops with `Missing required environment variables: ...`. `docker ps` shows `healthy` once `/health` answers.
