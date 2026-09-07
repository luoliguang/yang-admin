import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { MenusModule } from './modules/menus/menus.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { PermissionGuard } from './modules/auth/permission.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    MenusModule,
  ],
  controllers: [AppController],
  providers: [
    // 顺序：先登录守卫，再权限守卫
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
  ],
})
export class AppModule {}
