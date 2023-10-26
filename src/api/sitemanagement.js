import siteModel from '../models/sitemanagement.js'

export const getSiteManagement = async (req, res) => {
    let filter;
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    }
    if (req.query.siteImage) {
        filter = { siteImage: req.query.siteImage.split(',') }
    }

    let data = await siteModel.find(filter).populate('tables')
    res.send(data)
}
export const getSiteManagementById = async (req, res) => {
    let data = await siteModel.find(req.params).populate('tables')
    res.send(data)
}


export const postSiteManagement = async (req, res) => {
    const { siteName, numberOfTables, briefDescription, isActive, userId } = req.body;
    const siteImage = req.file ? req.file.location : null;
    const siteData = new siteModel({ siteName, numberOfTables, siteImage, briefDescription, isActive, userId })
    await siteData.save().then((result) => {
        res.status(200).json({
            siteName: result.siteName,
            numberOfTables: result.numberOfTables,
            briefDescription: result.briefDescription,
            isActive: result.isActive,
            siteImage: result.siteImage,
            userId: result.userId,
        })
    }).catch(err => {
        res.status(400).send("unable to save site")
    })
}
export const siteManagementUpdate = async (req, res) => {
    console.log('req: ',req.body);
    try {
        const siteImage = req.file ? req.file.location : null;
        const result = await siteModel.findByIdAndUpdate(
            { _id: req.params._id },
            { $set: req.body, siteImage:siteImage },
            { new: true }
        );

        if (result) {
            console.log('result: ', result);
            res.send({ message: "Site data updated successfully" });
        } else {
            res.status(404).send({ message: "Site not found" });
        }
    } catch (err) {
        console.log('err: ', err);
        res.status(500).send({ message: "Site data cannot be updated successfully" });
    }
}


export const siteDelete = async (req, res) => {
    const data = await siteModel.findByIdAndDelete({ _id: req.params._id })
    if (data) {
        res.send({ message: "site data delete successfully" });
    }
    else {
        res.send({ message: "site data cannot be deleted successfully" })
    }
}