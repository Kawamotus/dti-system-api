import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { TokenValidationMiddleware } from 'src/middlewares/token-validation.middleware';
import { TicketModule } from 'src/modules/ticket/ticket.module';
import { DeviceModule } from 'src/modules/device/device.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: 5432,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      autoLoadEntities: true,
      synchronize: true, //remover isso quando for pra producao
    }),
    AuthModule,
    UserModule,
    TicketModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenValidationMiddleware)
      .exclude(
        { path: '/auth', method: RequestMethod.POST },
        { path: '/user', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
