import tables from '../models/tables.js';

export const getTables= async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }
    const data = await tables.find(filter)
    res.send(data);
}
export const getTableById= async (req, res) => {
    const data = await tables.findOne(req.params);
    res.send(data);
}

export const postTables= async (req, res) => {
    const { tableNo, tableName,description, hasLampixDevice ,userId} = req.body;
    const tableimg=req.file ? req.file.location : null
    let data = new tables({ tableNo, tableName,description, hasLampixDevice ,userId,tableimg});
    await data.save().then(result => {
        console.log(result, "Tables data save to database")
         res.json({
            tableNo: result.tableNo,
            tableName: result.tableName,
            description: result.description,
            hasLampixDevice: result.hasLampixDevice,
            userId:result.userId,
            tableimg:result.tableimg
        })
    }).catch(err => {
        res.status(400).send("unable to save to database");
        console.log(err)
    });
}
export const updateTables= async (req, res) => {
    const tableimg=req.file ? req.file.location : null
    console.log(req.params)
    let data = await tables.findByIdAndUpdate(
        {_id: req.params._id},{
            $set:req.body,tableimg:tableimg
        },{new:true}
        );
    if (data) {
        res.send({ message: "tables data updated successfully" });
    }
    else {
        res.send({ message: "tables data cannot be updated successfully" })
    }
}
//Search and update
export const SearchUpdateTables= async(req, res) => {
    const { tableNo, tableName } = req.query
        console.log(tableNo,tableName)
        let data =await tables.findOneAndUpdate(
            {
                "$or": [
                    { tableNo: { $eq: Number(tableNo) } },
                    { tableName: { $regex: String(tableName) } },
                ]
            },{
            $set:req.body
        },{new:true})
        if (data) {
            res.json({data, message: "posTable data update successfully" });
        }
        else {
            res.send({ message: "posTables data cannot update successfully" })
        }
        
    }
export const deleteTables= async (req, res) => {
    console.log(req.params)
    let data = await tables.deleteOne(req.params)
    
    if (data) {
        res.send({ message: "tables data delete successfully" });
    }
    else {
        res.send({ message: "tables data cannot delete successfully" })
    }
}