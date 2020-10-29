import User from '@modules/users/infra/typeorm/entities/User';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Expose({ name: 'url' })
  getAvatarUrl(): string | null {
    return this.path ? `${process.env.APP_URL}/files/${this.path}` : null;
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Photo;
