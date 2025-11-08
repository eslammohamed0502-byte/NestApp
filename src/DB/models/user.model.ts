import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserGender, UserProvider, UserRole } from "src/common/enum";
import type { HydratedOtpDocument } from "./otp.model";

@Schema({timestamps:true,strictQuery:true, toObject:{virtuals:true},
    toJSON:{virtuals:true}})
export class User{
    @Prop({type:String,required:true,minlength:3,maxlength:30,trim:true})
    fName:string;
    @Prop({type:String,required:true,minlength:3,maxlength:30,trim:true})
    lName:string;
    @Virtual({
        get(){
            return this.fName+" "+this.lName
        },
        set:function(v:string){
            const [fName,lName]=v.split(' ')
            this.fName=fName
            this.lName=lName
        }
    })
    userName:string;
    @Prop({type:String,required:true,minlength:3,maxlength:30,trim:true})
    email:string;
    @Prop({type:String,required:true,minlength:8,maxlength:120,trim:true})
    password:string;
    @Prop({type:Number,min:18,max:80,required:true})
    age:number;
    @Prop({type:Boolean})
    confirmed:boolean
    @Prop({type:String,enum:UserRole,default:UserRole.user})
    role:UserRole;
    @Prop({type:String,enum:UserGender,default:UserGender.male})
    gender:UserGender;
    @Prop({type:String,enum:UserProvider,default:UserProvider.system})
    provider:UserProvider;
    @Prop({type:Date,default:Date.now})
    changeCredntialAt:Date;
    @Virtual()
    otp:HydratedOtpDocument;
}


export const UserSchema = SchemaFactory.createForClass(User);

export type HydratedUserDocument=HydratedDocument<User>

UserSchema.virtual("otp",{
    ref:"Otp",
    localField:"_id",
    foreignField:"createdBy"
})

export const UserModel=MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])