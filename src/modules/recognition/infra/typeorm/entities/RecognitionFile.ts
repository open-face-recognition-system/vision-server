import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import uploadConfig from '@config/upload';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity('recognition_files')
class RecognitionFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Expose({ name: 'url' })
  getUrl(): string | null {
    if (!this.path) {
      return null;
    }
    switch (uploadConfig.driver) {
      case 'disk':
        return this.path
          ? `${process.env.APP_URL}/recognitionFiles/${this.path}`
          : null;
      case 'do':
        return `${process.env.DO_URL}/recognitionFiles/${this.path}`;
      default:
        return null;
    }
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default RecognitionFile;
