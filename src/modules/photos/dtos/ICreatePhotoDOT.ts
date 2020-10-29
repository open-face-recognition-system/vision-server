import User from '@modules/users/infra/typeorm/entities/User';
import PhotoType from '../infra/typeorm/entities/PhotoType';

export default interface ICreatePhotoDOT {
  path: string;
  photoType: PhotoType;
  user: User;
}
