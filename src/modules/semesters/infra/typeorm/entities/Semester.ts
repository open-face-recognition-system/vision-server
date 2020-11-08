import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('semesters')
class Semester {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Semester;
