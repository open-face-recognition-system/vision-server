import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from './User';

@Entity('user_tokens')
class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  token: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default UserToken;
