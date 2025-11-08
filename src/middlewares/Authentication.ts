// import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
// import { NextFunction, Response } from "express";


// @Injectable()

// export class AuthenticationMiddleWare implements NestMiddleware{
//     constructor(
//         private readonly tokenService:TokenService
//     ){}

//     async use(req:UserWithRequest,res:Response,next:NextFunction){
//         try {
//             const { authorization } = req.headers;
//             const [prefix, token] = authorization?.split(" ") || [];
      
//             if (!prefix || !token) {
//                 throw new BadRequestException("token not found")
//             }
//         const signature = await GetSignature(prefix,tokenType)
//             if(!signature){
//                 throw new BadRequestException("invalid token")
//         }
//       const decoded=await decodedTokenAndFetchUser(token,signature)
//       req.user=user
//       req.decoded=decoded
//             return next();
//         } catch (error) {
//             throw new BadRequestException(error.message)
//         }
//     }
// }