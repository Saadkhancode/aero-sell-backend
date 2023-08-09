import cameraModel from "../models/camera.js";

export const getCameras = async (req, res) => {
    let filter;
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    }
    const cameras = await cameraModel.find(filter)
    res.send(cameras)
}
export const postCameras = async (req, res) => {
    const { username, password, port, ipAddress,userId } = req.body
    await new cameraModel({ username, password, port, ipAddress ,userId}).save().then(ress => {
        console.log('res: ', res);
        res.json(
            {
                username: ress.username,
                password: ress.password,
                port: ress.port,
                ipAddress: ress.ipAddress,
                userId:ress.userId
            })
    }).catch(err=>{
        console.log('err: ', err);
        res.status(400).json('an error occur while adding camera')
    })
}
export const updateCameras= async (req, res) => {
    console.log(req.params)
    let data = await cameraModel.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },
        { new: true }
    );
    if (data) {
        res.send({ message: "camera data updated successfully" ,data});
    } else {
        res.send({ message: "camera data cannot be updated successfully" })
    }
}
export const deleteCameras = async (req, res) => {
    console.log(req.params)
    let data = await cameraModel.deleteOne(req.params)
    if (data) {
        res.send({ message: "camera data delete successfully" });
    } else {
        res.send({ message: "camera data cannot delete successfully" })
    }
}