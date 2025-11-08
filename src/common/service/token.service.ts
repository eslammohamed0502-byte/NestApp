import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import Jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { TokenTypeEnum } from '../enum/token.enum';
import { UserRepository } from 'src/DB';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepo: UserRepository,
  ) {}
  GenerateToken = async ({
    payload,
    options,
  }: {
    payload: Object;
    options?: JwtSignOptions;
  }): Promise<String> => {
    return this.jwtService.signAsync(payload, options);
  };

  VerifyToken = async ({
    token,
    options,
  }: {
    token: string;
    options?: JwtVerifyOptions;
  }): Promise<JwtPayload> => {
    return this.jwtService.verifyAsync(token, options);
  };

  GetSignature = async (
    prefix: string,
    tokenType: TokenTypeEnum = TokenTypeEnum.accessToken,
  ) => {
    if (tokenType === TokenTypeEnum.accessToken) {
      if (prefix === process.env.BEARER_USER) {
        return process.env.ACCESS_TOKEN_USER;
      } else if (prefix === process.env.BEARER_ADMIN) {
        return process.env.ACCESS_TOKEN_ADMIN;
      } else {
        return null;
      }
    }
    if (tokenType === TokenTypeEnum.refreshToken) {
      if (prefix === process.env.BEARER_USER) {
        return process.env.REFRESH_TOKEN_USER;
      } else if (prefix === process.env.BEARER_ADMIN) {
        return process.env.REFRESH_TOKEN_ADMIN;
      } else {
        return null;
      }
    }
    return null;
  };

  decodedTokenAndFetchUser = async (token: string, signature: string) => {
    const decoded = await this.VerifyToken({
      token,
      options: { secret: signature },
    });
    if (!decoded?.email) {
      throw new BadRequestException('Invaild Token');
    }
    const user = await this.userRepo.findOne({ email: decoded.email });
    if (!user) {
      throw new BadRequestException('User Not Found');
    }
    if (!user?.confirmed) {
      throw new BadRequestException('Please Confirm Your Email');
    }
    // // if (user?.isFreezed) {
    // //   throw new BadRequestException('freezed account active it again');
    // // }
    // // if (await _revokeToken.findOne({ tokenId: decoded?.jti })) {
    // //   throw new BadRequestException('Token has been revoked');
    // // }
    // // if (user?.changeCredentials?.getTime()! > decoded.iat! * 1000) {
    // //   {
    // //     throw new BadRequestException('Token has been revoked');
    // //   }
    // }
    return { user, decoded };
  };
}
