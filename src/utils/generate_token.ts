
import Jwt, { JwtPayload } from "jsonwebtoken";


export const GenerateToken=async({payload,SIGNATURE,options}:{
    payload:Object,
    SIGNATURE:string,
    options?:Jwt.SignOptions
}):Promise<String>=>{
    return Jwt.sign(payload,SIGNATURE,options)
}

export const VerifyToken=async({token,SIGNATURE}:{
    token:string,
    SIGNATURE:string
}):Promise<JwtPayload>=>{
    return Jwt.verify(token,SIGNATURE) as JwtPayload
}