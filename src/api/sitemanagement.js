import siteModel from '../models/sitemanagement.js'

export const getSiteManagement = async (req, res) => {
    let filter;
    if (req.query.UserId) {
        filter = { UserId: req.query.UserId.split(',') }
    }
    let data = await siteModel.find(filter)
    res.send(data)
}


export const postSiteManagement = async (req, res) => {
    const { SiteName, NumberOfTables, BriefDescription, IsActive, UserId } = req.body;
    const SiteImage=req.file ? req.file.location : null;
    const siteData = await new siteModel({ SiteName, NumberOfTables,SiteImage, BriefDescription, IsActive, UserId })
    await siteData.save().then((result) => {
        res.status(200).json({
            SiteName: result.SiteName,
            NumberOfTables: result.NumberOfTables,
            BriefDescription:result.BriefDescription,
            IsActive:result.IsActive,
            SiteImage:result.SiteImage,
            UserId:result.UserId,
        })
    }).catch(err=>{
         res.status(400).send("unable to save site")
    })
}
export const siteManagementUpdate=async (req,res)=>{
    const SiteImage=req.file ? req.file.location : null;
    const updateSite=await siteModel.findByIdAndUpdate({_id:req.params._id},{
        $set:req.body,SiteImage:SiteImage
    },{new:true});
    if(updateSite){
        res.send({ message: "site data updated successfully" });
    }
    else {
        res.send({ message: "site data cannot be updated successfully" })
    }
}

export const siteDelete=async (req,res)=>{
    const data=await siteModel.findByIdAndDelete({_id:req.params._id})
    if(data){
        res.send({ message: "site data delete successfully" });
    }
    else {
        res.send({ message: "site data cannot be deleted successfully" })
    }
}