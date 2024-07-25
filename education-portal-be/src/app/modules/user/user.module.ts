import { Module } from '@nestjs/common';
import { AuthModule } from 'src/app/infrastructures/auth';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivationUserLog, RefreshToken, User } from 'src/app/entities';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, ActivationUserLog, RefreshToken]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
