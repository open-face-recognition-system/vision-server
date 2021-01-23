import Photo from '@modules/photos/infra/typeorm/entities/Photo';
import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import User from './User';

@Entity('students')
class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  enrollment: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Photo, photo => photo.student)
  photos: Photo[];

  @Column({ name: 'signed_term' })
  signedTerm: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Student;
