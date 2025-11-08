import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HydratedUserDocument } from 'src/DB';
import { TokenTypeEnum } from '../enum/token.enum';

export interface UserRequest extends Request {
  user: HydratedUserDocument;
  decoded: JwtPayload;
  typeToken?: TokenTypeEnum;
}
