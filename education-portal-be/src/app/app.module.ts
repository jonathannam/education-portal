import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  loadEnvironmentConfig,
  typeOrmConfigOptions,
} from './infrastructures/config';
import { ParseQueryParamsInterceptor } from './infrastructures/interceptors';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadEnvironmentConfig],
      envFilePath: `src/env/${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot(typeOrmConfigOptions),
    UserModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ParseQueryParamsInterceptor,
    },
  ],
})
export class AppModule {}
