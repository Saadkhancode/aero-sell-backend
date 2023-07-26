import { User, superUser } from '../models/User.js'
import jwt from "jsonwebtoken";
import sendMail from '../middlewares/send-email.js';
import express from 'express';
const router = express.Router()
router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body
  try {
    const user = await User.findOne({ email }) || await superUser.findOne({ email })
    if (user) {
      return res.status(400).send({ message: "User with this email already exists." })
    } else if (!user) {
      const token = jwt.sign({ name, email, password, role }, process.env.JWT_SECRET, { expiresIn: '20min' })
      if (process.env.NODE_ENV === 'production') {
        const link = `https://www.patronworks.net/auth/activate-account/${token}`;
        await sendMail(email, "Account Activation Link", `<html>

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
        a{
        color:blue;
        cursor:pointer;
        text-decoration:none;}
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
     justify-content:center;
     width:100%;
     border:none;
     border-radius:5px;
     margin-bottom:2rem;
     cursor:pointer;
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
     justify-self:center;
     width:60%;
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
     <img class="image" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690281194/WhatsApp_Image_2023-07-25_at_3.32.42_PM_gswsmd.jpg">
         </div>
                    <p style="font-size: 1rem; margin-bottom: 2rem;">Dear <strong>${email}</strong></p>
     
               <p style=" margin-bottom: 2rem;">We are excited to have you join us at PatronWorks.</p>
                         <p style=" margin-bottom: 2rem;">To ensure the security of your account and provide you with a smooth experience, we need to verify the email address associated with your account.</p>
                         
               <p style=" margin-bottom: 2rem;">Please click the button below to verify your email address:</p>
               <button class="btn"><a style="color:white;" href="${link}">VERIFY EMAIL ADDRESS </a></button>
     
               <p style=" margin-bottom: 2rem;">This link will redirect you to a page where your email address will be automatically verified. Once this step is completed, you will have access to all the available features of PatronWorks.</p>
           
              
               <p style=" margin-bottom: 2rem;">If the link is not working for any reason, please copy and paste the following URL into your web browser</p>
               <a style=" margin-bottom: 2rem;" href="${link}">${link}</a>
               <p style=" margin-bottom: 2rem;">This verification step ensures that we can reliably communicate with you and adds an extra layer of security to your account.</p>
     
               <p style=" margin-bottom: 2rem;">We look forward to serving you.</p>
               <p style=" margin-bottom: 2rem;"> If you have any questions or require assistance, don't hesitate to contact our support team at <strong>info@patronworks.com. </strong></p>
               <p style=" margin-bottom: 2rem;">Thank you for choosing PatronWorks for your business!</p>
               
      
      <hr>
        
     <div style="display:flex; justify-content:space-between; margin-top:1rem;">
        <div>
        <img style="width:60%" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690281267/WhatsApp_Image_2023-07-25_at_3.33.32_PM_xnwnuy.jpg">
        </div>
        <div style="display:flex; ">
        <button class="infologo" ><a href="https://www.linkedin.com/company/patronworks/"> <img class="shortimg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABiUlEQVR4nO2X20pCURCGZ40XddNBiy6C3imI3iSoO6GgGVOxwxNJUBFGMzuxksAyfAY7gbG3F9Jh70xKlzIfzN0a1vr3rPXPbADDMCaQYjXjWPaR5QFZX5Hk0bEewm5tAbynWM0gyQ2ydr6JWyhdzoPPOJJSzOGjcKR58BnsXptYAUhyBz6DpC+JAliewWeQpZlcAb0Hn3GR+yS8AdYC+O9CWo+5/zXvXSiiUFl0JEeh/0d9gLXhSItAQbq7wDAmF0zsAd34k7zcxTKybCBLObJukickbSHrMbJswc7Vip8CDupTjnS7j4bZdix7kG1M+yOAK3PIet7PWuxZ9ynkZckLAchy8qvDcy8vrJwHAgYPR5IbawHI0u7rYfsrQDtIwaYHAqSZIlmD3PVMGKlcsJrwB/g5tzxiAdIMh8UvyRSkfxzjowpoa6QCoi8fQ4qC9T4EvI1UQHRt4siezQ669/AE/NPeHzABbBXo2BVCe8RqLoRmo2yNrGOdmG2UUBvmcNjTqGEYMFa8Ax45ig5kj9GVAAAAAElFTkSuQmCC"> </a></button>
           <button class="infologo" ><a href="https://www.facebook.com/patronworks"> <img class="shortimg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABhUlEQVR4nO2Zu0oDURCGfxBEC3uFqJWdTyDY+Qg+hG8QsLH2GSwsos64BBS8YGIhglgZmUkWrUJA7NSACF4KL7hJIWmyJtkzJ3A+mGK7/9v/nMNegEDAY0gXQbIO0guwNsDSbM8dWOogqYClDKotwCtY5kFyDtbvVEN6D2/g6hJYn1OH5/ZsNsasowNUmwbJ07/Dsy8CrAc9hWcfBLav58DyObwCpKs9hyf5QhSP2gqwHvYswHpmGz4RkHqqO01aTNqiaj6ZXVnB/u2EDwLN7gLVPLyFU2zggubgLZxirXuxVPoRiC7HMdwCsfFR2bdANAJTCpoDawkkH32c+X9G3pLHjyiedCPAcjyY4J3HqxbdCJC8ZCRw70rgPRMBlhtHAvqaUQMnjgTkMRsB2XAlsJeJwI4uuxEoXE2B5GiAe+EBLGvwgjSBvYaDgDGhAWtCA9aEBqwJDVgTGrAmNGBNaMCabh+7ft/ivIbktMunkzK8Zqsy2/rr3tFE67qEKJ6xjhhABvwA++ZGkwZfp18AAAAASUVORK5CYII="> </a> </button>
     
        </div>
        </div>
              
        
             </div>
        </div>
        </div>
        </body>
        </html>`)

      } else if (process.env.NODE_ENV === 'development') {
        const link = `https://dev.patronworks.net/auth/activate-account/${token}`;
        await sendMail(email, "Account Activation Link", `<html>

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
        a{
        color:blue;
        cursor:pointer;
        text-decoration:none;}
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
     justify-content:center;
     width:100%;
     border:none;
     border-radius:5px;
     margin-bottom:2rem;
     cursor:pointer;
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
     justify-self:center;
     width:60%;
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
     <img class="image" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690281194/WhatsApp_Image_2023-07-25_at_3.32.42_PM_gswsmd.jpg">
         </div>
                    <p style="font-size: 1rem; margin-bottom: 2rem;">Dear <strong>${email}</strong></p>
     
               <p style=" margin-bottom: 2rem;">We are excited to have you join us at PatronWorks.</p>
                         <p style=" margin-bottom: 2rem;">To ensure the security of your account and provide you with a smooth experience, we need to verify the email address associated with your account.</p>
                         
               <p style=" margin-bottom: 2rem;">Please click the button below to verify your email address:</p>
               <button class="btn"><a style="color:white;" href="${link}">VERIFY EMAIL ADDRESS </a></button>
     
               <p style=" margin-bottom: 2rem;">This link will redirect you to a page where your email address will be automatically verified. Once this step is completed, you will have access to all the available features of PatronWorks.</p>
           
              
               <p style=" margin-bottom: 2rem;">If the link is not working for any reason, please copy and paste the following URL into your web browser</p>
               <a style=" margin-bottom: 2rem;" href="${link}">${link}</a>
               <p style=" margin-bottom: 2rem;">This verification step ensures that we can reliably communicate with you and adds an extra layer of security to your account.</p>
     
               <p style=" margin-bottom: 2rem;">We look forward to serving you.</p>
               <p style=" margin-bottom: 2rem;"> If you have any questions or require assistance, don't hesitate to contact our support team at <strong>info@patronworks.com. </strong></p>
               <p style=" margin-bottom: 2rem;">Thank you for choosing PatronWorks for your business!</p>
               
      
      <hr>
        
     <div style="display:flex; justify-content:space-between; margin-top:1rem;">
        <div>
        <img style="width:60%" src="https://res.cloudinary.com/drfdk5lxw/image/upload/v1690281267/WhatsApp_Image_2023-07-25_at_3.33.32_PM_xnwnuy.jpg">
        </div>
        <div style="display:flex; ">
        <button class="infologo" ><a href="https://www.linkedin.com/company/patronworks/"> <img class="shortimg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABiUlEQVR4nO2X20pCURCGZ40XddNBiy6C3imI3iSoO6GgGVOxwxNJUBFGMzuxksAyfAY7gbG3F9Jh70xKlzIfzN0a1vr3rPXPbADDMCaQYjXjWPaR5QFZX5Hk0bEewm5tAbynWM0gyQ2ydr6JWyhdzoPPOJJSzOGjcKR58BnsXptYAUhyBz6DpC+JAliewWeQpZlcAb0Hn3GR+yS8AdYC+O9CWo+5/zXvXSiiUFl0JEeh/0d9gLXhSItAQbq7wDAmF0zsAd34k7zcxTKybCBLObJukickbSHrMbJswc7Vip8CDupTjnS7j4bZdix7kG1M+yOAK3PIet7PWuxZ9ynkZckLAchy8qvDcy8vrJwHAgYPR5IbawHI0u7rYfsrQDtIwaYHAqSZIlmD3PVMGKlcsJrwB/g5tzxiAdIMh8UvyRSkfxzjowpoa6QCoi8fQ4qC9T4EvI1UQHRt4siezQ669/AE/NPeHzABbBXo2BVCe8RqLoRmo2yNrGOdmG2UUBvmcNjTqGEYMFa8Ax45ig5kj9GVAAAAAElFTkSuQmCC"> </a></button>
           <button class="infologo" ><a href="https://www.facebook.com/patronworks"> <img class="shortimg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABhUlEQVR4nO2Zu0oDURCGfxBEC3uFqJWdTyDY+Qg+hG8QsLH2GSwsos64BBS8YGIhglgZmUkWrUJA7NSACF4KL7hJIWmyJtkzJ3A+mGK7/9v/nMNegEDAY0gXQbIO0guwNsDSbM8dWOogqYClDKotwCtY5kFyDtbvVEN6D2/g6hJYn1OH5/ZsNsasowNUmwbJ07/Dsy8CrAc9hWcfBLav58DyObwCpKs9hyf5QhSP2gqwHvYswHpmGz4RkHqqO01aTNqiaj6ZXVnB/u2EDwLN7gLVPLyFU2zggubgLZxirXuxVPoRiC7HMdwCsfFR2bdANAJTCpoDawkkH32c+X9G3pLHjyiedCPAcjyY4J3HqxbdCJC8ZCRw70rgPRMBlhtHAvqaUQMnjgTkMRsB2XAlsJeJwI4uuxEoXE2B5GiAe+EBLGvwgjSBvYaDgDGhAWtCA9aEBqwJDVgTGrAmNGBNaMCabh+7ft/ivIbktMunkzK8Zqsy2/rr3tFE67qEKJ6xjhhABvwA++ZGkwZfp18AAAAASUVORK5CYII="> </a> </button>
     
        </div>
        </div>
              
        
             </div>
        </div>
        </div>
        </body>
        </html>`)
      }
      return res.status(200).json({ message: "Account Verification Link Send To Ur Account" })

    }
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
}
)
router.post('/:token', (req, res) => {
  const { token } = req.params;
  console.log("token:", token);
  try {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async function (err, decodedToken) {
        if (err) {
          return res.status(400).json({ message: "token is invalid or expired" })
        }
        const { name, email, password, role } = decodedToken

        const userRegister = await User.findOne({ email });
        if (userRegister) {
          return res.send({ message: "this user is already registered" })
        }
        if (role === 'admin') {

          const newUser = new User({ name, email, password, role });
          const savedUser = await newUser.save();
          console.log('savedUser: ', savedUser);
          if (savedUser) {
            res.send({ message: "Account Verified:Thanks For Registering User" ,userId:savedUser._id});
          } else {
            res.status(400).send({ error: "Cannot register user at the moment!" });
          }
        } else if (role === 'superadmin') {
          const superAdmin = new superUser({ name, email, password, role });
          const savedSuprAdmin = await superAdmin.save();
          if (savedSuprAdmin) {
            res.send({ message: "Account Verified:Thanks For Registering SuperUser" });
          } else {
            res.status(400).send({ error: "Cannot register user at the moment!" });
          }
        }
      })
    } else {
      return res.json({ message: "Something Went Wrong" })
    }
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
})
export default router;