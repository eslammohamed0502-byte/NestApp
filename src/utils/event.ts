
import { EventEmitter } from "events";
import { OtpTypes } from "src/common/enum";
import { emailTemplate } from "src/common/service/email_template";
import { sendEmail } from "src/common/service/send_email";

export const eventEmitter=new EventEmitter()


 eventEmitter.on(OtpTypes.ConfirmEmail,async(data)=>{
        const {email,otp}=data
              await sendEmail({
                to:email,
                subject:OtpTypes.ConfirmEmail,
                html:emailTemplate(otp as unknown as string,"Email Confirmation")
              })
    })

    eventEmitter.on(OtpTypes.ForgotPassword,async(data)=>{
        const {email,otp}=data
              await sendEmail({
                    to:email,
                    subject:OtpTypes.ForgotPassword,
                    html:emailTemplate(otp as unknown as string,"Forgot Password")
                  })
    })