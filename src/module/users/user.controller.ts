import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  confirmEmailDTO,
  forgetPasswordDTO,
  resendOtpDTO,
  signInDto,
  signUpDto,
} from './user.dto';
import type { UserRequest } from 'src/common/interfaces';
import { AuthenticationGuard } from 'src/common/guards/authentication/authentication.guard';
import { TokenTypeEnum } from 'src/common/enum/token.enum';
import { Auth, Role, Token, User } from 'src/common/decorators';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { UserRole } from 'src/common/enum';
import type { HydratedUserDocument } from 'src/DB';

@Controller('/users')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sign-up')
  signUp(@Body() body: signUpDto): any {
    return this.userService.signUp(body);
  }
  @Post('/resend-otp')
  reSendOtp(@Body() body: resendOtpDTO): any {
    return this.userService.resendOtp(body);
  }
  @Post('/sign-in')
  signIn(@Body() body: signInDto): any {
    return this.userService.signIn(body);
  }
  @Patch('/confirm_email')
  confirmEmail(@Body() body: confirmEmailDTO): any {
    return this.userService.confirm_email(body);
  }
  @Post('/forget_password')
  forget_password(@Body() body: forgetPasswordDTO): any {
    return this.userService.forget_password(body);
  }
  @Auth()
  @Get('/profile')
  profile(@User() user: HydratedUserDocument): any {
    return user;
  }
}
