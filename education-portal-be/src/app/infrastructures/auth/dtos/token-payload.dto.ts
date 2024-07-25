import { User } from 'src/app/entities';

export interface TokenPayloadDto {
  user: Pick<User, 'id' | 'username' | 'role'>;
}
