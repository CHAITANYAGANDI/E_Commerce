const OTPModel = require("../Models/otp");

async function getOtp(email) {
    try {
        const otpRecord = await OTPModel.findOne({ email });
        if (otpRecord) {
     
            return otpRecord.otp;
        } else {
          
            return null;
        }
    } catch (error) {

        return null;
    }
}


async function setOtp(email, otp) {
    try {
   
        const existingOtp = await OTPModel.findOne({ email });
        if (existingOtp) {
         
            existingOtp.otp = otp;
            existingOtp.createdAt = new Date();
            await existingOtp.save();
        } else {

            const newOtp = new OTPModel({ email, otp });
            await newOtp.save();
        }
        
    } catch (error) {
        console.error('Error saving OTP:', error);
    }
}

module.exports = {getOtp,setOtp};
 