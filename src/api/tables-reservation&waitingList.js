import tableSelect from "../models/tables-reservation&waitingList.js";

export const getReservedTables=async(req,res)=>{
    let filter={}
    if(req.query.btnStatus){
        filter={btnStatus:req.query.btnStatus.split(',')}
    }
    const reservation=await tableSelect.find(filter);
    res.send(reservation);
}
export const getWaitingTables=async(req,res)=>{
    let filter={}
    if(req.query.btnStatus){
        filter={btnStatus:req.query.btnStatus.split(',')}
    }
    const waitingList=await tableSelect.find(filter);
    res.send(waitingList);
}
export const getReservationAndWaitingListById=async(req,res)=>{
    const ReservationAndWaitingList=await tableSelect(req.params);
    res.send(ReservationAndWaitingList)
}
export const postReservationAndWaitingList=async(req,res)=>{
    const {PartyName,Guests,Email,Phone,Note,Private,Smoking,window,Booth,Boys,HighChairs,WheelChairs,btnStatus,table, tableNo}=req.body;
    const ReservationAndWaitingList=await new tableSelect({PartyName,Guests,Email,Phone,Note,Private,Smoking,window,Booth,Boys,HighChairs,WheelChairs,btnStatus,table,tableNo})
    await ReservationAndWaitingList.save().then(result=>{
        console.log(result, "ReservationAndWaitingList data save to database")
        res.json({
            PartyName:result.PartyName,
            Guests:result.Guests,
            Email:result.Email,
            Phone:result.Phone,
            Note:result.Note,
            Private:result.Private,
            Smoking:result.Smoking,
            window:result.window,
            Booth:result.Booth,
            Boys:result.Boys,
            HighChairs:result.HighChairs,
            WheelChairs:result.WheelChairs,
            btnStatus:result.btnStatus,
            table:result.table,
            tableNo:result.tableNo
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateReservationAndWaitingList = async (req, res) => {

    console.log(req.params.id)
    let data = await tableSelect.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },
        { new: true }
    );
    if (data) {
        res.send({ message: "ReservationAndWaitingList data updated successfully" });
    }
    else {
        res.send({ message: "ReservationAndWaitingList data cannot be updated successfully" })
    }
}
export const deleteReservationAndWaitingList = async (req, res) => {
    console.log(req.params)
    let data = await tableSelect.deleteOne(req.params)
    if (data) {
        res.send({ message: "ReservationAndWaitingList data delete successfully" });
    }
    else {
        res.send({ message: "ReservationAndWaitingList data cannot delete successfully" })
    }
}