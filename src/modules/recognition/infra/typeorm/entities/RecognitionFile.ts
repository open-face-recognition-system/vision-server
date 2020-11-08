import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity('recognition_files')
class RecognitionFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Expose({ name: 'url' })
  getUrl(): string | null {
    return this.path ? `${process.env.APP_URL}/files/${this.path}` : null;
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default RecognitionFile;
