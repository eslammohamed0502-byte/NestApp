import { Model } from "mongoose"
import { DBRepository } from "./DB.repo"
import { HydratedUserDocument, User } from "../models"
import { InjectModel } from "@nestjs/mongoose"
import { Injectable } from "@nestjs/common"
import { Otp } from "../models/otp.model"

@Injectable()
export class OtpRepository extends DBRepository<Otp>{
    constructor(@InjectModel(Otp.name) protected override readonly model: Model<Otp>){
        super(model)
}
}