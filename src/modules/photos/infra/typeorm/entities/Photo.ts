import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { Entity } from 'typeorm/decorator/entity/Entity';
import Student from '@modules/users/infra/typeorm/entities/Student';
import uploadConfig from '@config/upload';
import PhotoType from './PhotoType';

@Entity('photos')
class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({
    type: 'enum',
    enum: PhotoType,
  })
  photoType: PhotoType;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Expose({ name: 'url' })
  getUrl(): string | null {
    if (!this.path) {
      return null;
    }
    switch (uploadConfig.driver) {
      case 'disk':
        return this.path ? `${process.env.APP_URL}/files/${this.path}` : null;
      case 'do':
        return `${process.env.DO_URL}/photos/${this.path}`;
      default:
        return null;
    }
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Photo;
