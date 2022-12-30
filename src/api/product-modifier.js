import productModifierModel from "../models/productmodifier.js";
export const getProductModifier=async(req,res)=>{
    console.log(req.params);
    let modifierData=await productModifierModel.find(req.params)
    res.send(modifierData)
}
export const postProductModifier=async(req,res)=>{
     const {Size,Caffein,Espresso,Flavors,userId,productId}=req.body
      const modifier=new productModifierModel({Size,Caffein,Espresso,Flavors,userId,productId})
      await modifier.save().then(results=>{
        rconsole.log("modifier data send to database")
        res.json({
            Size:results.Size,
            Caffein:results.Caffein,
            Espresso:results.Espresso,
            Flavors:results.Flavors,
            userId:results.userId,
            productId:results.productId
        })
      }).catch(err=>{
        res.status(400).send('unable to save modifier data to database')
        console.log(err);
      })
}
export const updateProductModifier=async(req,res)=>{
    const modifier=await productModifierModel.findByIdAndUpdate(
        {_id:req.params._id},{
            $set:req.body
        },{new:true})
        if(modifier){
            res.status(200).send("modifier data updated successfully")
        }else{
            res.status(400).send("modifier data cannot be updated")
        }
}
export const deleteModifier=async(req,res)=>{
    const modifier=await productModifierModel.findByIdAndDelete({_id:req.params._id})
    if(modifier){
        res.status(200).send("modifier data delete successfully")
    }else{
        res.status(400).send("modifier data cannot be deleted")
    }
}