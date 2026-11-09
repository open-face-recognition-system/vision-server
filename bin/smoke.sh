#!/usr/bin/env bash
# End-to-end check against a running stack: sign-up, photos, training and recognition.
# Usage: bin/smoke.sh [api-url]   (needs curl, jq, and the server container for image generation)
set -euo pipefail

API=${1:-http://localhost:3333}
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@vision.local}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123}
RUN=$(date +%s)
WORK=$(mktemp -d)
trap 'rm -rf -- "$WORK"' EXIT

fail() { echo "FAIL: $*" >&2; exit 1; }
api() { curl -s -w '\n%{http_code}' "$@"; }
expect_status() {
  local expected=$1; shift
  local response; response=$(api "$@")
  local status=${response##*$'\n'}
  [[ $status =~ ^$expected$ ]] || fail "$* -> $status (expected $expected): ${response%$'\n'*}"
  echo "${response%$'\n'*}"
}
login() { expect_status 200 -X POST "$API/sessions" -H 'Content-Type: application/json' -d "{\"email\":\"$1\",\"password\":\"$2\"}" | jq -r .token; }

echo "== generating synthetic faces"
docker compose exec -T server python3 - > "$WORK/faces.tar" <<'PY'
import io, sys, tarfile, cv2, numpy as np
out = tarfile.open(fileobj=sys.stdout.buffer, mode="w|")
for label in (1, 2):
    for n in range(6):
        pattern = np.random.default_rng(label).integers(0, 255, (22, 22), dtype=np.uint8)
        noise = np.random.default_rng(label * 100 + n).integers(0, 20, (220, 220), dtype=np.uint8)
        image = cv2.add(cv2.resize(pattern, (220, 220), interpolation=cv2.INTER_NEAREST), noise)
        data = cv2.imencode(".jpg", image)[1].tobytes()
        info = tarfile.TarInfo(f"face-{label}-{n}.jpg"); info.size = len(data)
        out.addfile(info, io.BytesIO(data))
out.close()
PY
tar -xf "$WORK/faces.tar" -C "$WORK"

echo "== security"
expect_status 404 -X POST "$API/users" -H 'Content-Type: application/json' -d '{"name":"x","email":"x@x.com","password":"x"}' >/dev/null
expect_status 401 "$API/students" >/dev/null

ADMIN=$(login "$ADMIN_EMAIL" "$ADMIN_PASSWORD")

echo "== sign-up and photos"
for label in 1 2; do
  email="student$label-$RUN@example.com"
  STUDENT_ID[$label]=$(expect_status 20[01] -X POST "$API/students" -H 'Content-Type: application/json' \
    -d "{\"name\":\"Student $label\",\"email\":\"$email\",\"password\":\"secret1\",\"enrollment\":\"$RUN$label\"}" | jq -r .id)
  token=$(login "$email" secret1)
  expect_status 403 -H "Authorization: Bearer $token" "$API/students" >/dev/null
  for n in 0 1 2 3 4; do
    expect_status 200 -H "Authorization: Bearer $token" -F "file=@$WORK/face-$label-$n.jpg" "$API/photos?photoType=normal" >/dev/null
  done
done

echo "== admin setup"
TEACHER_EMAIL="teacher-$RUN@example.com"
TEACHER_ID=$(expect_status 20[01] -X POST "$API/teachers" -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN" \
  -d "{\"name\":\"Teacher\",\"email\":\"$TEACHER_EMAIL\",\"password\":\"secret1\",\"enrollment\":\"T$RUN\"}" | jq -r .id)
SEMESTER_ID=$(expect_status 20[01] -X POST "$API/semesters" -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN" \
  -d '{"startDate":"2026-01-01","endDate":"2026-12-31"}' | jq -r .id)
SUBJECT_ID=$(expect_status 20[01] -X POST "$API/subjects" -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN" \
  -d "{\"name\":\"Vision $RUN\",\"description\":\"d\",\"course\":\"c\",\"teacherId\":$TEACHER_ID}" | jq -r .id)
for label in 1 2; do
  expect_status 20[01] -X POST "$API/subjects/$SUBJECT_ID/enroll" -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN" -d "{\"studentId\":${STUDENT_ID[$label]}}" >/dev/null
done
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
CLASS_ID=$(expect_status 20[01] -X POST "$API/classes" -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN" \
  -d "{\"startHour\":\"$NOW\",\"endHour\":\"$NOW\",\"date\":\"$NOW\",\"subjectId\":$SUBJECT_ID,\"semesterId\":$SEMESTER_ID}" | jq -r .id)

echo "== training and recognition"
TEACHER=$(login "$TEACHER_EMAIL" secret1)
expect_status 400 -H "Authorization: Bearer $TEACHER" -F "file=@$WORK/face-2-5.jpg" "$API/recognition/recognize/$CLASS_ID" >/dev/null
expect_status 204 -X POST -H "Authorization: Bearer $TEACHER" "$API/recognition/training/$SUBJECT_ID" >/dev/null
RECOGNIZED=$(expect_status 200 -H "Authorization: Bearer $TEACHER" -F "file=@$WORK/face-2-5.jpg" "$API/recognition/recognize/$CLASS_ID")
[ "$(echo "$RECOGNIZED" | jq -r .student.id)" = "${STUDENT_ID[2]}" ] || fail "recognized the wrong student: $RECOGNIZED"
PRESENT=$(expect_status 200 -H "Content-Type: application/json" -H "Authorization: Bearer $TEACHER" "$API/attendances/class/$CLASS_ID" | jq -c "[.[] | select(.isPresent)] | map(.student.id)")
[ "$PRESENT" = "[${STUDENT_ID[2]}]" ] || fail "attendance not recorded: $PRESENT"
expect_status 204 -H "Authorization: Bearer $TEACHER" -F "file=@$WORK/face-1-5.jpg" "$API/recognition/update/$CLASS_ID/student/${STUDENT_ID[1]}" >/dev/null

echo "OK: student ${STUDENT_ID[2]} recognized with distance $(echo "$RECOGNIZED" | jq .confidence)"
