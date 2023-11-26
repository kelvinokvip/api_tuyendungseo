const nodemailer = require("nodemailer");
const generateConfirmationCode = () => {
    const length = 6;
    const characters = '0123456789';
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
};
const sendEmail = async (email) => {
    const confirmationCode = generateConfirmationCode();  
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            secure: true,
            auth: {
                user: 'kjssmealong@gmail.com',
                pass: 'hcspxdswakwtfueb',
            },
        });

        await transporter.sendMail({
            from: "Tuyển dụng CTV",
            to: email,
            subject: "Xác nhận email",
            text: `Mã xác nhận của bạn là: ${confirmationCode}`,
        });

        console.log("email sent sucessfully");
        return {success: true, code: confirmationCode}
    } catch (error) {
        console.log(error, "email not sent");
        return {success: false}
    }
};

module.exports = sendEmail;