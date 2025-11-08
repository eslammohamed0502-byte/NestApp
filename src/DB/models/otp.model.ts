import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OtpTypes } from "src/common/enum";
import { eventEmitter } from "src/utils/event";
import { hashData } from "src/utils/hash";


@Schema({timestamps:true})
export class Otp{

    @Prop({type:String,required:true,trim:true})
    code:string

    @Prop({required:true,type:Types.ObjectId,ref:"User"})
    createdBy:Types.ObjectId

    @Prop({type:String,required:true,enum:OtpTypes})
    type:OtpTypes

    @Prop({type:Date,required:true})
    expireAt:Date
}


export const OtpSchema = SchemaFactory.createForClass(Otp);

export type HydratedOtpDocument=HydratedDocument<Otp>

OtpSchema.index({exiredAt:1},{expireAfterSeconds:0})

OtpSchema.pre("save",async function(this:HydratedOtpDocument&{is_new:boolean,plainCode:string},next) {
    if(this.isModified("code")){
        this.plainCode=this.code
         this.is_new=this.is_new
        this.code= await hashData({plainText:this.code})
       await this.populate([
            {
                path:"createdBy",
                select:"email"
            }
        ])
    }
    next()
})

OtpSchema.post("save",async function(doc,next) {
    const that =this as HydratedOtpDocument&{is_new:boolean,plainCode:string}
    if(that.is_new){
        eventEmitter.emit(doc.type,{otp:that.plainCode,email:(doc.createdBy as any).email})
    }
    next()
})


export const OtpModel=MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])