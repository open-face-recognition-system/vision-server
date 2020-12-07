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
} from 'typeorm';

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
  teacher: Teacher;

  @ManyToOne(() => RecognitionFile)
  @JoinColumn({ name: 'recognition_file_id' })
  recognitionFile: RecognitionFile;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Subject;
