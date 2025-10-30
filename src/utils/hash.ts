import { compare, hash } from "bcryptjs";

export const hashData=async(plainText:string,saltRounds:number=Number(process.env.SALT_ROUNDS))=>{
    const Rounds= Number(saltRounds)
    return  hash(plainText,Rounds)
}

export const Compare=async(plainText:string,cipherText:string)=>{
    return  compare(plainText,cipherText)
}