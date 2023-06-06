import blog from '../models/blog.js';

export const getBlog = async (req, res) => {
    let data = await blog.find(req.params)
    res.send(data);
}
export const getBlogById = async (req, res) => {
    let data = await blog.findOne(req.params)
    res.send(data);
}
export const postBlog  = async (req, res) => {
   const {dataArray}=req.body
    const image = req.file ? req.file.location :null;
    // Process the image file and array data as needed
    console.log(image);
    console.log(dataArray);
    const postBlog =await new blog({dataArray,image});
     await postBlog.save().then(result => {
        console.log(result, "Product data save to database")

        res.status(200).json({ message: 'File and array data received successfully' });
     })
.catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
      

  
}


// export const postBlog = async (req, res) => {
//     const { blogsContent } = req.body;
//     let data = await new blog({ blogsContent});
//     await data.save().then(result => {
//         console.log(result, "Blog data save to database")
//         res.json({
//             blogsContent:result.blogsContent
//         });
//     }).catch(err => {
//         res.status(400).send("unable to save to database");
//         console.log(err)
//     });
// }
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