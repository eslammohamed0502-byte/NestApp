import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TokenService } from 'src/common/service/token.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const typeToken = this.reflector.get('typeToken', context.getHandler());
    let req: any;
    let authorization: string = '';
    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
      authorization = req.headers.authorization;
    }
    const [prefix, token] = authorization?.split(' ') || [];

    if (!prefix || !token) {
      throw new BadRequestException('token not found');
    }
    const signature = await this.tokenService.GetSignature(prefix,typeToken);
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
    return true;
  }
}
