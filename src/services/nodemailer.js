import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
     service: 'Gmail',
     auth: {
         user: process.env.USERMAILER,
         pass: process.env.PASSMAILER
     }
});

const sendMail = async (emailOptions) => {
     try {
         await transporter.sendMail(emailOptions);
         
     } catch (error) {
         
         throw new Error("Error sending email");
     }
}

export default { transporter, sendMail };