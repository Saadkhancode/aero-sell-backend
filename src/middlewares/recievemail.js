import nodemailer from 'nodemailer'

const recieveMail = async (email, html) => {

    console.log('email 1: ', email);
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            name:"www.patronworks.com",
            secure:true,
            auth: {
                user: "aerosellinfo@gmail.com",
                pass: "ycqk tvui calv zkdw"
            }
        })
        await transporter.sendMail({
            from: email,
            to: ["aamiryousafzay@gmail.com", "saudkhanbpk@gmail.com", "saud@polaristechnologygroup.com","norman@polaristechnologygroup.com"],
            subject:email,
            html: html
        })
        console.log("Send Eamil Success");
    } catch (error) {
        console.log(error, "email not sent");
    }
}
export default recieveMail;