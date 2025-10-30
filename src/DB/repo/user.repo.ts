import { Model } from "mongoose"
import { DBRepository } from "./DB.repo"
import { HydratedUserDocument, User } from "../models"
import { InjectModel } from "@nestjs/mongoose"
import { Injectable } from "@nestjs/common"

@Injectable()
export class UserRepository extends DBRepository<HydratedUserDocument>{
    constructor(@InjectModel(User.name) protected override readonly model: Model<HydratedUserDocument>){
        super(model)
}
}