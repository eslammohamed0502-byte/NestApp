import { SetMetadata } from "@nestjs/common";
import { TokenTypeEnum } from "../enum/token.enum";



export const Token = (tokenType:TokenTypeEnum=TokenTypeEnum.accessToken) => {
   return SetMetadata('typeToken', tokenType)
};
