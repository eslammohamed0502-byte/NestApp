import { SetMetadata } from '@nestjs/common';
import { TokenTypeEnum } from '../enum/token.enum';
import { UserRole } from '../enum';

export const Role = (access_roles: UserRole[]) => {
  return SetMetadata('access_roles', access_roles);
};
