import Student from '@modules/users/infra/typeorm/entities/Student';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Class from './Class';

@Entity('attendence_items')
class AttendenceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isPresent: boolean;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default AttendenceItem;
