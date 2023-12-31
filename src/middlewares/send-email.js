import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const sendMail = async (email, subject, html,attachment) => {
    let domain;
    if (process.env.NODE_ENV === 'production') {
        domain = true
    } else if (process.env.NODE_ENV === 'development') {
        domain = false
    }

    console.log('email 1: ', email);
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            // name: "www.patronworks.net",
            secure: domain,
            auth: {
                user: "aerosellinfo@gmail.com",
                pass: "ycqk tvui calv zkdw"
            }
        })
        await transporter.sendMail({
            to: email,
            subject: subject,
            html: html,
            attachments:attachment
        })
        console.log("Send Eamil Success");
    } catch (error) {
        console.log(error, "email not sent");
    }
}

export default sendMail;