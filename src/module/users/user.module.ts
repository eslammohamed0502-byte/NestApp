import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserModel, UserRepository } from "src/DB";



@Module({
    imports:[UserModel],
    controllers:[UserController],
    providers:[UserService,UserRepository],
    exports:[]
})

export class UserModule{
    constructor(){}
}