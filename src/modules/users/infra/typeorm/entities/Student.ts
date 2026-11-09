import Photo from '@modules/photos/infra/typeorm/entities/Photo';
import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Relation,
} from 'typeorm';
import User from './User';

@Entity('students')
class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  enrollment: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @OneToMany(() => Photo, photo => photo.student)
  photos: Relation<Photo>[];

  @Column({ name: 'signed_term' })
  signedTerm: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Student;
