import nodemailer from 'nodemailer'

const sendMail=async(email,subject,html)=>{
    
    console.log('email 1: ', email);
    try {
       
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            name:"www.patronworks.net",
            secure:false,
            auth: {
                user: "workspatron@gmail.com",
                pass:"mhoumpxfstzptawc"
            }
        })
        await transporter.sendMail({
            to:email,
            subject: subject,
            html:html
        })
        console.log("Send Eamil Success");
    } catch (error) {
        console.log(error,"email not sent");
    }
}

export default sendMail;