import { compare, hash } from "bcryptjs";

export const hashData=async({plainText, saltRounds = Number(process.env.SALT_ROUNDS)}:{plainText:string, saltRounds?:number})=>{
    const Rounds= Number(saltRounds)
    return  hash(plainText,Rounds)
}

export const Compare = async ({ plainText, cipherText }: { plainText: string, cipherText: string }) => {
    return compare(plainText, cipherText)
}
