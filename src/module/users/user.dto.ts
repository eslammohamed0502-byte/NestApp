import { IsEmail, IsNotEmpty, IsNumber, IsString, IsStrongPassword, Length, Max, Min,ValidateIf } from "class-validator";
import { IsMatch } from "src/common/decorators";


export class signUpDto{
    @IsString()
    @IsNotEmpty()
    @Length(3,15)
    fName:string;

    @IsString()
    @IsNotEmpty()
    @Length(3,15)
    lName:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    @IsNumber()
    @Min(18)
    @Max(60)
    age:number;

    @IsStrongPassword()
    @IsNotEmpty()
    password:string;

    @ValidateIf((data:signUpDto)=>{
        return Boolean(data.password)
    })
    @IsMatch(['password'])
    cPassword:string;
}


export class signInDto{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    password:string;
}

export class confirmEmailDTO{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    otp:string;
}

export class forgetPasswordDTO{
    @IsEmail()
    @IsNotEmpty()
    email:string;
}
