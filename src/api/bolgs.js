import blog from '../models/blog.js'

export const getBlog = async (req, res) => {
    let data = await blog.find(req.params)
    res.send(data);
}
export const postBlog = async (req, res) => {
    const {title,shortDescription,longDescription,footer} = req.body;
    const blog_img=req.files ? req.files.location : null
    let data = await new blog({title,shortDescription,longDescription,footer,blog_img});
    await data.save().then(result => {
        console.log(result, "Blog data save to database")
        res.json({
            title: result.title,
            shortDescription: result.shortDescription,
            longDescription: result.longDescription,
            footer: result.footer,
             blog_img:result.blog_img
        });
    }).catch(err => {
        res.status(400).send("unable to save to database");
        console.log(err)
    });
}
export const updateBlog = async (req, res) => {
    const blog_img=req.files ? req.files.location :null
    let data = await blog.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body,blog_img:blog_img
    },
        { new: true }
    )
    if (data) {
        res.send({ message: "blog data updated successfully" });
    }
    else {
        res.send({ message: "blog data cannot be updated successfully" })
    }
}
export const deleteBlog = async (req, res) => {
    console.log(req.params)
    let data = await blog.deleteOne(req.params)
    if (data) {
        res.send({ message: "blog data delete successfully" });
    }
    else {
        res.send({ message: "blog data cannot delete successfully" })
    }
}