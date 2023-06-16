
import { chatMessages, chatUser, newChat } from "../models/chatModal.js";


 // creating chat between user and customer 
 
 export const accessChat = async (req, res) => {
    let newsubuser
    let subUserId
    if(!req.body._id){
      if(!req.body.email){
   return res.status(422).json({message:"email is required"})
      }
      const {email,createdby,name}=req.body
      const user = new chatUser({email,createdby,name})
     newsubuser= await user.save()
    } 
    const { createdby } = req.body;

    if(newsubuser){
       subUserId=newsubuser._id
    }else{
      const isChat = await newChat.findOne({ _id: req.body._id }).populate("user").populate("Admin","name email")
      if (isChat) {
        const FullChat = isChat
      return res.status(200).json({chat:FullChat});
      }
      return res.status(400).json({message:"not found"})
    }
        let chatData = {
            user:subUserId,
            Admin: createdby
        };
        const newchatdata = new newChat(chatData)
        try {
          const createdChat = await newchatdata.save();
          let createdChatId=createdChat._id
        const FullChat = await newChat.findOne({ _id: createdChatId }) .populate("user")
        .populate("Admin","-password")
          
          res.status(200).json({chat:FullChat});
        
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
  };

  // show chat 

  export const fetchChats = async (req, res) => {
    const { Admin } = req.query;
  
    if (!Admin || Admin === "null" || Admin === "undefined") {
      return res.status(422).json({ error: "admin id is required" });
    }
  
    try {
      const results = await newChat.find({
        $and: [{ chatEnable: true }, { Admin: req.query.Admin }],
      })
        .populate("user")
        .populate("Admin", "name email")
        .sort({ updatedAt: -1 });
  
      const chatIds = results.map(chat => chat._id);
      const unreadCounts = await Promise.all(
        chatIds.map(chatId =>
          chatMessages.countDocuments({
            chat: chatId,
            readBy: { $ne: Admin }
          })
        )
      );
  
      const chatsWithUnreadCount = results.map((chat, index) => ({
        ...chat.toObject(),
        unreadCount: unreadCounts[index],
      }));
  
      res.status(200).send(chatsWithUnreadCount);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };
  


                                            //   messages portion  //

// sending messages 

export const sendMessage = async (req, res) => {

    const { content, chatId, sender, senderId } = req.body;
  
    if (!chatId) {
      return res.status(400).json({error:"chat id is required"});
    }
    const checkChat = await newChat.findById({_id:chatId})
    if (checkChat.chatEnable == false) {
       await newChat.findByIdAndUpdate({_id:chatId}, { chatEnable: true })
    }
    var newMessage = {
      sender,
      content,
      chat: chatId,
      senderId
    };
    let newMessageData = new chatMessages(newMessage)
    try {
      var message = await newMessageData.save()

      const updateChat = await newChat.findByIdAndUpdate({_id:chatId}, { latestMessage: message.content })
      res.json(message);
    } catch (error) {
     res.status(400).json({error:"something went wrong!"})
    }
  };
  
//   // show all messages 
  
  export const allMessages = async (req, res) => {
    let {_id}=req.query
    if(!_id){
      return res.status(400).json({error:"user id is required"})
    }
    let filter = { readBy: { $ne: _id } };
    let {chatId}=req.params
    if(req.params.chatId) {
      filter.chat= chatId ;
    } 
    try {
       await chatMessages.updateMany( filter, { $push: { readBy: _id } });
      const messages = await chatMessages.find({ chat: req.params.chatId })
        .populate({ path: "chat", populate: { path: "Admin", modal: "superUser", select: "name email" } })
        .populate({ path: "chat", populate: { path: "user", modal: "chatUser" } })
      res.json(messages);
    } catch (error) {
      res.status(400).json({error:"something went wrong !"})
    }
  };