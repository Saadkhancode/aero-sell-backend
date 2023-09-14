import mongoose from 'mongoose';
const menuSchema = new mongoose.Schema({

    treeData: {
        type: Array
    } ,
    role:{
        type:String
    },
    superUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'superUser'
    }

})
const menu = mongoose.model('menu', menuSchema);
export default menu;