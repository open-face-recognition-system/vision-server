import RecognitionFile from '@modules/recognition/infra/typeorm/entities/RecognitionFile';
import Teacher from '@modules/users/infra/typeorm/entities/Teacher';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import SubjectStudent from './SubjectStudent';

@Entity('subjects')
class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  course: string;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Relation<Teacher>;

  @ManyToOne(() => RecognitionFile)
  @JoinColumn({ name: 'recognition_file_id' })
  recognitionFile?: Relation<RecognitionFile>;

  @OneToMany(() => SubjectStudent, subjectStudent => subjectStudent.subject)
  students: Relation<SubjectStudent>[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Subject;
