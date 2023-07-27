import {User} from '../models/User.js'
import Token from '../models/token.js';
import sendMail from '../middlewares/send-email.js';
import jwt from "jsonwebtoken";
import Joi from 'joi';
import express from "express"
const router = express.Router()
//reset password throght email
router.post("/", async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET,{expiresIn:'20min'})
            }).save();
        }
        if (process.env.NODE_ENV === 'production') {
            const link = `${process.env.BASE_URL}/auth/reset-password/${user._id}/${token.token}`;
            await sendMail(user.email, "Password Reset Link", `
            <html>
            
            <head>
            <style>

            .shortimg{
            width:50%;
            }
              .infologo{
            border:none;
            background:transparent;
            }
            .logo{
            width: 30%;
            }
            
            .maindivdata{
            padding:2rem 4rem;
            border: 1px solid lightgray;}
            
            .client{
             color: white;
             font-weight: 700;
             display: flex;
             font-size: 25px;
             width: 100%;
             justify-content:center;
             padding-top: 10rem;
             padding-left:20px;
            }
         .btn{
         background-color: rgb(6, 138, 245); 
         color:white;
         font-size:20px;
         padding:15px;
         display:flex;
         justify-content:center !important;
         width:100%;
         border:none;
         border-radius:5px;
         margin-bottom:2rem;
         cursor:pointer;
         padding:left:40%;
         }
         .power{
         font-size:12px;
         color:gray;
         }
         p{
         font-size:16px;
             font-family: 'Poppins', sans-serif;
         
         }
         
            .container{
            width:50%;
            margin:auto;
                font-family: 'Poppins', sans-serif;
         
         
            
            }
            .shortimg{
              width:20px;
              height:20px;
              }
              .infologo{
                background:transparent;
                border:none;
              }
         .top{
         display:flex;
         justify-content:center;
         }
         .image{
         justify-self:center !important;
         width:60%;
         margin-left:25%
         }
         h3{
                font-family: 'Poppins', sans-serif;
         
         }
         span{
                font-family: 'Poppins', sans-serif;
         
         }
         h5{
                font-family: 'Poppins', sans-serif;
         
         }
            @media screen and (max-width:900px) {
            .container{
            width:100%;
            margin:0px;
            
            }
            .client{
             color: white;
             font-weight: 700;
             display: grid;
             font-size: 25px;
             width: 100%;
             padding-top: 10rem;
             padding-left:10px;
            }
          .maindivdata{
            padding:2rem 10px;
            }
            .btn{
              padding-left:30%;
            }
            
            
            }
            
            </style>
              <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
         
            </head>
               <body>
               <div class="container">
               <div style="font-family: Arial, Helvetica, sans-serif; ">
               <div style="width: auto; height: 4rem;background-color: rgb(6, 138, 245); ">
               
                   
               
               </div>
               <div class="maindivdata">
               <div class="top"> 
         <img class="image" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690281010/reset-password-concept-illustration_114360-7866_y6s2bk.avif">
               </div>
                        <p style="font-size: 1rem; margin-bottom: 2rem;">Dear <strong>${user.email}</strong></p>
         
                   <p style=" margin-bottom: 2rem;">We recently received a request to reset the password for your account associated with this email address.</p>
                             <p style=" margin-bottom: 2rem;">To reset your password, please click the link below or copy and paste it into your browser. This link is only valid for the next 24 hours for security reasons.</p>
                             
                   <button class="btn"><a style="text-decoration:none; color:white" href="${link}">Reset Password</a></button>
         
               
                  
                   <p style=" margin-bottom: 2rem;">If you did not request a password reset, please ignore this email or contact our support team to ensure the security of your account. If you're experiencing any issues, you can reach us at info@patronworks.com or through the support section on our website.</p>
                   <p style=" margin-bottom: 2rem;">Remember, we at PatronWorks will never ask you for your password. Please ensure you keep your password secure and never share it with anyone.</p>
         
                   <p style=" margin-bottom: 2rem;">Thank you for your attention to this matter.</p>
                 
                   
          
          <hr>
            
          <div style="display:flex; justify-content:space-between; margin-top:1rem;">
          <div>
          <img style="width:60%" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690281267/WhatsApp_Image_2023-07-25_at_3.33.32_PM_xnwnuy.jpg">
          </div>
          <div style="display:flex; margin-left:45%;">
          <a style="margin-right:10px; href="https://www.linkedin.com/company/patronworks/">
            <img class="shortimg" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690439086/WhatsApp_Image_2023-07-27_at_11.12.37_AM_1_whbn0t.jpg" alt="LinkedIn">
          </a>
          
          <a href="https://www.facebook.com/patronworks">
            <img class="shortimg" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690439056/WhatsApp_Image_2023-07-27_at_11.12.37_AM_yedkyi.jpg" alt="Facebook">
          </a>
        </div>
        
                
          
               </div>
            </div>
            </div>
            </body>
            </html> `);
    
          } else if (process.env.NODE_ENV === 'development') {
            const link = `${process.env.DEV_BASE_URL}/auth/reset-password/${user._id}/${token.token}`;
            await sendMail(user.email, "Password Reset Link", `
            <html>
            
            <head>
            <style>
            .shortimg{
            width:50%;
            }
              .infologo{
            border:none;
            background:transparent;
            }
            .logo{
            width: 30%;
            }
            .shortimg{
              width:20px;
              height:20px;
              }
              .infologo{
                background:transparent;
                border:none;
              }
            
            .maindivdata{
            padding:2rem 4rem;
            border: 1px solid lightgray;}
            
            .client{
             color: white;
             font-weight: 700;
             display: flex;
             font-size: 25px;
             width: 100%;
             justify-content:center;
             padding-top: 10rem;
             padding-left:20px;
            }
         .btn{
         background-color: rgb(6, 138, 245); 
         color:white;
         font-size:20px;
         padding:15px;
         display:flex;
         justify-content:center !important;
         width:100%;
         border:none;
         border-radius:5px;
         margin-bottom:2rem;
         cursor:pointer;
         padding-left:40%;
         }
         .power{
         font-size:12px;
         color:gray;
         }
         p{
         font-size:16px;
             font-family: 'Poppins', sans-serif;
         
         }
         
            .container{
            width:50%;
            margin:auto;
                font-family: 'Poppins', sans-serif;
         
         
            
            }
         .top{
         display:flex;
         justify-content:center;
         }
         .image{
         justify-self:center !important;
         width:60%;
         margin-left:25%;
         }
         h3{
                font-family: 'Poppins', sans-serif;
         
         }
         span{
                font-family: 'Poppins', sans-serif;
         
         }
         h5{
                font-family: 'Poppins', sans-serif;
         
         }
            @media screen and (max-width:900px) {
            .container{
            width:100%;
            margin:0px;
            
            }
            .client{
             color: white;
             font-weight: 700;
             display: grid;
             font-size: 25px;
             width: 100%;
             padding-top: 10rem;
             padding-left:10px;
            }
          .maindivdata{
            padding:2rem 10px;
            }
            .btn{
              padding-left:30%;
            }
            
            
            }
            
            </style>
              <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
         
            </head>
               <body>
               <div class="container">
               <div style="font-family: Arial, Helvetica, sans-serif; ">
               <div style="width: auto; height: 4rem;background-color: rgb(6, 138, 245); ">
               
                   
               
               </div>
               <div class="maindivdata">
               <div class="top"> 
         <img class="image" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690281010/reset-password-concept-illustration_114360-7866_y6s2bk.avif">
               </div>
                        <p style="font-size: 1rem; margin-bottom: 2rem;">Dear <strong>${user.email}</strong></p>
         
                   <p style=" margin-bottom: 2rem;">We recently received a request to reset the password for your account associated with this email address.</p>
                             <p style=" margin-bottom: 2rem;">To reset your password, please click the link below or copy and paste it into your browser. This link is only valid for the next 24 hours for security reasons.</p>
                             
                   <button class="btn"><a style="text-decoration:none; color:white" href="${link}">Reset Password</a></button>
         
               
                  
                   <p style=" margin-bottom: 2rem;">If you did not request a password reset, please ignore this email or contact our support team to ensure the security of your account. If you're experiencing any issues, you can reach us at info@patronworks.com or through the support section on our website.</p>
                   <p style=" margin-bottom: 2rem;">Remember, we at PatronWorks will never ask you for your password. Please ensure you keep your password secure and never share it with anyone.</p>
         
                   <p style=" margin-bottom: 2rem;">Thank you for your attention to this matter.</p>
                 
                   
          
          <hr>
            
          <div style="display:flex; justify-content:space-between; margin-top:1rem;">
          <div>
          <img style="width:60%" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690281267/WhatsApp_Image_2023-07-25_at_3.33.32_PM_xnwnuy.jpg">
          </div>
          <div style="display:flex; margin-left:45%;">
          <a style="margin-right:10px; href="https://www.linkedin.com/company/patronworks/">
            <img class="shortimg" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690439086/WhatsApp_Image_2023-07-27_at_11.12.37_AM_1_whbn0t.jpg" alt="LinkedIn">
          </a>
          
          <a href="https://www.facebook.com/patronworks">
            <img class="shortimg" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690439056/WhatsApp_Image_2023-07-27_at_11.12.37_AM_yedkyi.jpg" alt="Facebook">
          </a>
        </div>
        
                
          
               </div>
            </div>
            </div>
            </body>
            </html>`);
    
          } 

        return res.json({ message: `password-reset link send to your gmail account ` })

    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

router.post("/:userId/:token", async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).json({message:"invalid userId or expired"});

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).json({message:"Invalid Token or expired"});

        user.password = req.body.password;
        await user.save();
        await token.delete();

        res.json({
            message: 'Password Reset Successfully'
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});
export default router;