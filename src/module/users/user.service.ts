import {  BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "src/DB";
import { confirmEmailDTO, forgetPasswordDTO, signInDto, signUpDto } from "./user.dto";
import { Compare, hashData } from "src/utils/hash";
import { GenerateToken } from "src/utils/generate_token";
import { UserRole } from "src/common/enum/user.enum";
import { generateOtp } from "src/service/send_email";
import { eventEmitter } from "src/utils/event";

@Injectable()
export class UserService {
  constructor(private readonly  userRepo:UserRepository){}

 async signUp(body:signUpDto){
  if (await this.userRepo.findOne({ email:body.email })) {
    throw new BadRequestException("Email already exists")
  }
  const hashedPassword = await hashData(body.password);
  const otp = await generateOtp()
  const hashOtp = await hashData(String(otp))
  const { cPassword, ...userData } = body;
  eventEmitter.emit("ConfirmEmail", { email:body.email, otp })
  return await this.userRepo.create({ ...userData, password: hashedPassword,otp:hashOtp })
  }

 async signIn(body:signInDto){
  const user =await this.userRepo.findOne({ email:body.email })
  if (!user) {
    throw new BadRequestException("Email Not Exist")
  }
  if(!await Compare(body.password,user.password)){
    throw new BadRequestException("Invalid credentials")
  }
  const access_token = await GenerateToken({
    payload: { id: user._id, email: user.email },
    SIGNATURE: user.role === UserRole.user 
      ? process.env.ACCESS_TOKEN_USER!
      : process.env.ACCESS_TOKEN_ADMIN!,
    options: { expiresIn: "1h" }
  });
  
      const refresh_token=await GenerateToken({  payload: { id: user._id, email: user.email },
    SIGNATURE: user.role === UserRole.user
      ? process.env.REFRESH_TOKEN_USER!
      : process.env.REFRESH_TOKEN_ADMIN!,
    options: { expiresIn: "1y"}
  }) 
  return {access_token,refresh_token}
  }


 async confirm_email(body:confirmEmailDTO){
  const user =await this.userRepo.findOne({ email:body.email, confirmed:{ $ne:true } })
  if (!user) {
    throw new BadRequestException("Email Not Exist or confirmed")
  }
  if(!await Compare(body.otp,user.otp)){
    throw new BadRequestException("invalid otp")
  }
  await this.userRepo.updateOne({email:body.email},{confirmed:true,$unset:{otp:""}})
  return `${body.email} is confirmed `
  }


 async forget_password(body:forgetPasswordDTO){
  const user =await this.userRepo.findOne({ email:body.email})
  if (!user) {
    throw new BadRequestException("Email Not Exist")
  }
  const otp = await generateOtp()
  const hashOtp = await hashData(String(otp))
  eventEmitter.emit("forgetPassword", { email:body.email, otp })
   await this.userRepo.updateOne({ email: body.email }, { $set: { otp: hashOtp, changeCredntialAt: new Date() } })
   return `Reset OTP sent to ${body.email}`
  }
  }
  