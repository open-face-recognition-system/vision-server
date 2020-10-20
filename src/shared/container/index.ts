import { container } from 'tsyringe';
import '@modules/users/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IStudentsRepository from '@modules/users/repositories/IStudentsRepository';
import StudentsRepository from '@modules/users/infra/typeorm/repositories/StudentsRepository';
import ITeachersRepository from '@modules/users/repositories/ITeachersRepository';
import TeachersRepository from '@modules/users/infra/typeorm/repositories/TeachersRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IStudentsRepository>(
  'StudentsRepository',
  StudentsRepository,
);

container.registerSingleton<ITeachersRepository>(
  'TeachersRepository',
  TeachersRepository,
);
