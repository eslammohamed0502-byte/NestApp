import { BadRequestException, Injectable } from '@nestjs/common';
import { HydratedUserDocument, UserRepository } from 'src/DB';
import {
  confirmEmailDTO,
  forgetPasswordDTO,
  resendOtpDTO,
  signInDto,
  signUpDto,
} from './user.dto';
import { Compare, hashData } from 'src/utils/hash';
import { GenerateToken } from 'src/utils/generate_token';
import { UserRole } from 'src/common/enum/user.enum';
import { generateOtp, sendEmail } from 'src/common/service/send_email';
import { eventEmitter } from 'src/utils/event';
import { OtpRepository } from 'src/DB/repo/otp.repo';
import { emailTemplate } from 'src/common/service/email_template';
import { OtpTypes } from 'src/common/enum';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/service/token.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly otpRepo: OtpRepository,
    private jwtService: JwtService,
    private readonly tokenService: TokenService
  ) {}

  private async sendOtp(userId: Types.ObjectId) {
    const otp = await generateOtp();
    await this.otpRepo.create({
      code: otp.toString(),
      createdBy: userId,
      type: OtpTypes.ConfirmEmail,
      expireAt: new Date(Date.now() + 60 * 1000),
    });
  }

  async resendOtp(body: resendOtpDTO) {
    const { email } = body;
    const user = await this.userRepo.findOne({
      filter: email,
      confirmed: { exists: false },
      undefined,
      options: {
        populate: {
          path: 'otp',
        },
      },
    });
    if (!user) {
      throw new BadRequestException('Email not exists');
    }
    if ((user.otp as any).length > 0) {
      throw new BadRequestException('otp already sent');
    }
    await this.sendOtp(user._id);
    return { message: 'otp sent successfully' };
  }

  async signUp(body: signUpDto) {
    const { email, password, age, fName, lName, userName, gender } = body;
    const userExists = await this.userRepo.findOne({ filter: email });
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }
    const user = await this.userRepo.create({
      email,
      password,
      age,
      fName,
      lName,
      userName,
      gender,
    });
    if (!user) {
      throw new BadRequestException('user not created');
    }
    await this.sendOtp(user._id);
    return user;
  }

  async signIn(body: signInDto) {
    const { email, password } = body;
    const user = await this.userRepo.findOne({
      filter: email,
      confirmed: { $exists: true },
    });
    if (!user) {
      throw new BadRequestException('Email Not Exist');
    }
    if (!(await Compare({ plainText: password, cipherText: user.password }))) {
      throw new BadRequestException('Invalid credentials');
    }
    const access_token = await this.tokenService.GenerateToken(
 {     payload:{ id: user._id, email: user.email },
      options:{
        secret:
          user.role === UserRole.user
            ? process.env.ACCESS_TOKEN_USER!
            : process.env.ACCESS_TOKEN_ADMIN!,
        expiresIn: '1h',
      },
    });

    const refresh_token = await this.tokenService.GenerateToken(
{    payload:  { id: user._id, email: user.email },
      options:{
        secret:
          user.role === UserRole.user
            ? process.env.REFRESH_TOKEN_USER!
            : process.env.REFRESH_TOKEN_ADMIN!,
        expiresIn: '1y',
      },
    });
    return { access_token, refresh_token };
  }

  async confirm_email(body: confirmEmailDTO) {
    const { email, code } = body;
    const user = await this.userRepo.findOne({
      filter: email,
      confirmed: { exists: false },
      undefined,
      options: {
        populate: {
          path: 'otp',
        },
      },
    });
    if (!user) {
      throw new BadRequestException('Email not exists');
    }
    if (
      !(await Compare({
        plainText: code,
        cipherText: (user.otp as any)[0].code,
      }))
    ) {
      throw new BadRequestException('invalid otp');
    }
    user.confirmed = true;
    await user.save();
    await this.otpRepo.deleteOne({ createdBy: user._id });
    return `${user.email} is confirmed `;
  }

  async forget_password(body: forgetPasswordDTO) {
    const user = await this.userRepo.findOne({ email: body.email });
    if (!user) {
      throw new BadRequestException('Email Not Exist');
    }
    await this.sendOtp(user._id)
    return `Reset OTP sent to ${user.email}`;
  }
}
