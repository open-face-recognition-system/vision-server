import Student from '@modules/users/infra/typeorm/entities/Student';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('subject_students')
class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isEnrolled: boolean;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Subject;
