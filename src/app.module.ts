import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
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
      {
        path: '/board',
        module: BoardModule,
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
    BoardModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
