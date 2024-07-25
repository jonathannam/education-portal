import { Column, Entity, OneToMany } from 'typeorm';
import { EntityBase } from './common/entity-base';
import { ActivationUserLog } from './activation-user-log.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity()
export class User extends EntityBase {
  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ default: true }) isActive: boolean;

  @OneToMany(() => ActivationUserLog, (log) => log.author)
  activationLogs: ActivationUserLog[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
