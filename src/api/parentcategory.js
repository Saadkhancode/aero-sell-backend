import parentcategory from '../models/parentcategory.js'

export const getParentCategories = async (req, res) => {
       let filter={}
       if(req.query.userId){
        filter={userId:req.query.userId.split(',')}
       }
    let data = await parentcategory.find(filter).populate('userId','_id')

    res.send(data);
}

export const getParentCategoriesById = async (req, res) => {
   
    let data = await parentcategory.findOne(req.params);
    res.send(data)
}
export const postParentCategories = async (req, res) => {
    const { name,userId } = req.body;
    const parent_pic=req.file ? req.file.location : null
    let data = await new parentcategory({ name,userId ,parent_pic});
    await data.save().then(result => {
        console.log("Category data saved to database");
        res.json({
            name: result.name,
            userId:result.userId,
            parent_pic:result.parent_pic
        })
    }).catch(err => {
        res.status(400).send("unable to save to database");
        console.log(err)
    });
}
export const updateParentCategories = async (req, res) => {
    const parent_pic=req.file ? req.file.location : null
    console.log(req.params)
    let data = await parentcategory.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body,parent_pic:parent_pic
    },
        { new: true }
    );
    if (data) {
        res.send({ message: "category data updated successfully" });
    } else {
        res.send({ message: "category data cannot be updated successfully" })
    }
}
export const deleteParentCategories = async (req, res) => {
    console.log(req.params)
    let data = await parentcategory.deleteOne(req.params)
    if (data) {
        res.send({ message: "category data delete successfully" });
    } else {
        res.send({ message: "category data cannot delete successfully" })
    }
}

