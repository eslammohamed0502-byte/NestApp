import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import {  confirmEmailDTO, forgetPasswordDTO, signInDto, signUpDto } from "./user.dto";



@Controller("/users")
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, transformOptions: { enableImplicitConversion: true } }))
export class UserController{
    constructor(private readonly userService:UserService){}

    @Post("/sign-up")
    signUp(@Body() body:signUpDto):any{
        return this.userService.signUp(body)
        }
    @Post("/sign-in")
    signIn(@Body() body:signInDto):any{
        return this.userService.signIn(body)
        }
    @Post("/confirm_email")
    confirmEmail(@Body() body:confirmEmailDTO):any{
        return this.userService.confirm_email(body)
        }
    @Post("/forget_password")
    forget_password(@Body() body:forgetPasswordDTO):any{
        return this.userService.forget_password(body)
        }
}