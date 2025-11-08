import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { TokenService } from 'src/common/service/token.service';
import { UserRole } from '../enum';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const access_roles:UserRole[] = this.reflector.get(
      'access_roles',
      context.getHandler(),
    );
    if (!access_roles.includes(req.user.role)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
