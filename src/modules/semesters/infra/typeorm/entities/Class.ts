import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Semester from './Semester';

@Entity('classes')
class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startHour: Date;

  @Column()
  endHour: Date;

  @Column()
  date: Date;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Semester)
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Class;
