import { applyDecorators, UseGuards } from '@nestjs/common';
import { Token } from './token.decorator';
import { Role } from './role.decorator';
import { UserRole } from '../enum';
import { AuthenticationGuard } from '../guards/authentication/authentication.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { TokenTypeEnum } from '../enum/token.enum';

export function Auth({
  typeToken=TokenTypeEnum.accessToken,
  role=[UserRole.user],
}: {
  typeToken?: TokenTypeEnum;
  role?: UserRole[];
}={}) {
  return applyDecorators(
    Token(typeToken),
    Role(role),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}
