import type { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { UserRequest } from '../interfaces';
import { TokenTypeEnum } from '../enum/token.enum';

export const tokenType=(typeToken:TokenTypeEnum=TokenTypeEnum.accessToken)=>{
  return (req: UserRequest, res: Response, next: NextFunction) =>{
    req.typeToken=typeToken
    next()
  }
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  async use(req: UserRequest, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const [prefix, token] = authorization?.split(' ') || [];

    if (!prefix || !token) {
      throw new BadRequestException('token not found');
    }
    const signature = await this.tokenService.GetSignature(prefix,req.typeToken);
    if (!signature) {
      throw new BadRequestException('Invalid Token');
    }
    const decoded = await this.tokenService.decodedTokenAndFetchUser(
      token,
      signature,
    );
    if (!decoded) {
      throw new BadRequestException('Invalid Token');
    }
    req.user = decoded?.user;
    req.decoded = decoded?.decoded;
    return next();
  }
}
