import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ORM_CONFIG } from './config';
import { Routes, RouterModule } from 'nest-router';

const routes: Routes = [
  {
    path: '/api/v1',
    children: [
      {
        path: '/user',
        module: UserModule,
      },
      {
        path: '/auth',
        module: AuthModule,
      },
    ],
  },
];

@Module({
  imports: [
    TypeOrmModule.forRoot(ORM_CONFIG),
    RouterModule.forRoutes(routes),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService],
})
export class AppModule {}
