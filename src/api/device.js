import device from '../models/device.js';

export const getDevices = async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }
    let data = await device.find(filter);
    res.send(data);
}
export const getDevice = async (req, res) => {
    let data = await device.findOne(req.params);
    res.send(data);
}

export const postDevice = async (req, res) => {
    const { active, name, userId,Address } = req.body;
    const data = await new device({ name, active, userId ,Address});
    await data.save().then(result => {
        console.log(result, "Device data save to database")
        res.json({
            name: result.name,
            active: result.active,
            userId:result.userId,
            Address:result.Address
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateDevice = async (req, res) => {
    console.log(req.params.id)
    let data = await device.findByIdAndUpdate(
        { _id: req.body._id },
        {
            $set: req.body
        });
    if (data) {
        res.send({ message: "device data updated successfully" });
    }
    else {
        res.send({ message: "device data cannot be updated successfully" })
    }
}
export const deleteDevice = async (req, res) => {
    console.log(req.params)
    let data = await device.deleteOne(req.params)
    if (data) {
        res.send({ message: "device data delete successfully" });
    }
    else {
        res.send({ message: "device data cannot delete successfully" })
    }
}