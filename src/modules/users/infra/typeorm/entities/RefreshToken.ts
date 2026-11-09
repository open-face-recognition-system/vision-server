import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import User from './User';

@Entity('refresh_tokens')
class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'refresh_token' })
  @Generated('uuid')
  refreshToken: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default UserToken;
