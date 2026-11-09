import Subject from '@modules/subjects/infra/typeorm/entities/Subject';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import Attendance from './Attendance';
import Semester from './Semester';

@Entity('classes')
class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_hour' })
  startHour: Date;

  @Column({ name: 'end_hour' })
  endHour: Date;

  @Column()
  date: Date;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subject_id' })
  subject: Relation<Subject>;

  @ManyToOne(() => Semester)
  @JoinColumn({ name: 'semester_id' })
  semester: Relation<Semester>;

  @OneToMany(() => Attendance, attendance => attendance.class)
  attendances: Relation<Attendance>[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Class;
