import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EntityBase } from './common/entity-base';
import { User } from './user.entity';

@Entity()
export class ActivationUserLog extends EntityBase {
  @Column() isActive: boolean;

  @ManyToOne(() => User, (user) => user.activationLogs)
  @JoinColumn({ name: 'authorId' })
  author: User;
}
