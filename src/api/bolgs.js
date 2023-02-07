import blog from '../models/blog.js'

export const getBlog = async (req, res) => {
    let data = await blog.find(req.params)
    res.send(data);
}
export const postBlog = async (req, res) => {
    const {blogContent} = req.body;
    let data = await new blog({blogContent});
    await data.save().then(result => {
        console.log(result, "Blog data save to database")
        res.json({
            blogContent:result.blogContent
        });
    }).catch(err => {
        res.status(400).send("unable to save to database");
        console.log(err)
    });
}
export const updateBlog = async (req, res) => {
    let data = await blog.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
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