import mongoose from "mongoose";

    // chat user create 

const chatUserSchema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    createdby:{
        type:String
    }
},{timestamps:true})
export const chatUser=new mongoose.model('chatUser',chatUserSchema) 

            // newChat schema 

const chatCreatSchema=new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId,ref:"chatUser" },
        Admin: { type: mongoose.Schema.Types.ObjectId, ref: "superUser" },
        latestMessage: {
          type: String 
        },
        chatEnable:{
          type:Boolean,
          default:false
        },
        isActive:{
            type:Boolean,
            default:true
        }
      },
      { timestamps: true }
)
export const newChat=new mongoose.model('newChat',chatCreatSchema) 

    //   messages schema 

const messageSchema = mongoose.Schema(
    {
      sender: { type: String },
      content: { type: String, trim: true },
      senderId:{type:String},
      chat: { type: mongoose.Schema.Types.ObjectId, ref: "newChat" },
      readBy: [],
    },
    { timestamps: true }
  );
  
 export const chatMessages =new mongoose.model("Messages", messageSchema);