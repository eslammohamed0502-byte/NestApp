import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { IsMatch } from 'src/common/decorators';
import { UserGender } from 'src/common/enum';

export class resendOtpDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class signInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    password: string;
  }
export class signUpDto extends signInDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  fName: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  lName: string;
  @IsString()
  @IsNotEmpty()
  @Length(3, 15)
  userName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  @Max(60)
  age: number;

  @IsString()
  gender: UserGender;



  @ValidateIf((data: signUpDto) => {
    return Boolean(data.password);
  })
  @IsMatch(['password'])
  cPassword: string;
}


export class confirmEmailDTO extends resendOtpDTO {
  @IsNotEmpty()
  code: string;
}



export class forgetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
