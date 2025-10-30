
import { EventEmitter } from "events";
import { emailTemplate } from "src/service/email_template";
import { sendEmail } from "src/service/send_email";

export const eventEmitter=new EventEmitter()


 eventEmitter.on("ConfirmEmail",async(data)=>{
        const {email,otp}=data
              await sendEmail({
                to:email,
                subject:"Welcome to Social Media App",
                html:emailTemplate(otp as unknown as string,"Email Confirmation")
              })
    })

    eventEmitter.on("forgetPassword",async(data)=>{
        const {email,otp}=data
              await sendEmail({
                    to:email,
                    subject:"Forgot Your Password",
                    html:emailTemplate(otp as unknown as string,"Forgot Password")
                  })
    })