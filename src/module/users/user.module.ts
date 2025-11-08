import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel, UserRepository } from 'src/DB';
import { OtpRepository } from 'src/DB/repo/otp.repo';
import { OtpModel } from 'src/DB/models/otp.model';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/service/token.service';
import { UserController } from './user.controller';
import { AuthenticationMiddleware, tokenType } from 'src/common/middleware';

@Module({
  imports: [UserModel, OtpModel],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    OtpRepository,
    JwtService,
    TokenService,
  ],
  exports: [],
})
export class UserModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(tokenType(),AuthenticationMiddleware).forRoutes(UserController);
  // }
}
