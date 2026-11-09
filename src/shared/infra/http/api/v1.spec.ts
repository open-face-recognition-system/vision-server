import request from 'supertest';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import app from '../app';

type Role = 'admin' | 'teacher' | 'student';
type Route = [method: 'get' | 'post' | 'put' | 'delete', path: string, allowed: Role[]];

const ROLES: Role[] = ['admin', 'teacher', 'student'];
const STAFF: Role[] = ['admin', 'teacher'];
const ADMIN: Role[] = ['admin'];

const PROTECTED_ROUTES: Route[] = [
  ['delete', '/users/1', ADMIN],

  ['get', '/students', ADMIN],
  ['get', '/students/1', ADMIN],
  ['put', '/students/1', ADMIN],
  ['get', '/teachers', ADMIN],
  ['get', '/teachers/1', ADMIN],
  ['post', '/teachers', ADMIN],
  ['put', '/teachers/1', ADMIN],

  ['get', '/profiles', ['student']],
  ['put', '/profiles/student', ['student']],
  ['put', '/profiles/1/student', ADMIN],
  ['put', '/profiles/1/teacher', ADMIN],

  ['get', '/photos', ['student']],
  ['post', '/photos', ['student']],
  ['put', '/photos/1', ['student']],
  ['delete', '/photos/1', ['student']],

  ['get', '/semesters', STAFF],
  ['get', '/semesters/1', STAFF],
  ['post', '/semesters', ADMIN],
  ['put', '/semesters/1', ADMIN],
  ['delete', '/semesters/1', ADMIN],

  ['get', '/subjects', STAFF],
  ['get', '/subjects/1', STAFF],
  ['get', '/subjects/teacher', ['teacher']],
  ['post', '/subjects', ADMIN],
  ['put', '/subjects/1', ADMIN],
  ['delete', '/subjects/1', ADMIN],
  ['post', '/subjects/1/enroll', ADMIN],
  ['post', '/subjects/1/enroll/pdf', ADMIN],
  ['post', '/subjects/1/unenroll', ADMIN],

  ['get', '/classes', STAFF],
  ['get', '/classes/1', STAFF],
  ['get', '/classes/teacher', ['teacher']],
  ['post', '/classes', ADMIN],
  ['put', '/classes/1', ADMIN],
  ['delete', '/classes/1', ADMIN],

  ['get', '/attendances', STAFF],
  ['get', '/attendances/class/1', STAFF],
  ['put', '/attendances/1', STAFF],
  ['post', '/attendances', ADMIN],
  ['delete', '/attendances/1', ADMIN],

  ['post', '/recognition/training/1', STAFF],
  ['post', '/recognition/recognize/1', ['teacher']],
  ['post', '/recognition/update/1/student/1', ['teacher']],
];

const tokenFor = (role: Role) => sign({ id: 1, role }, authConfig.jwt.secret);

const call = ([method, path]: Route, role?: Role) => {
  const pending = request(app)[method](path);
  return role ? pending.set('Authorization', `Bearer ${tokenFor(role)}`) : pending;
};

describe('v1 authorization', () => {
  it('has no public endpoint that creates a user with an arbitrary role', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Mallory', email: 'mallory@example.com', password: 'x' });

    expect(response.status).toBe(404);
  });

  it.each(PROTECTED_ROUTES)('%s %s rejects anonymous requests', async (...route) => {
    expect((await call(route)).status).toBe(401);
  });

  it.each(PROTECTED_ROUTES)('%s %s rejects a forged token', async (method, path) => {
    const forged = sign({ id: 1, role: 'admin' }, 'not-the-secret');
    const response = await request(app)[method](path).set('Authorization', `Bearer ${forged}`);
    expect(response.status).toBe(401);
  });

  const denied = PROTECTED_ROUTES.flatMap(([method, path, allowed]) =>
    ROLES.filter(role => !allowed.includes(role)).map(role => [method, path, role] as const),
  );

  it.each(denied)('%s %s forbids %s', async (method, path, role) => {
    const response = await call([method, path, []], role);
    expect([403, 404]).toContain(response.status);
  });
});
