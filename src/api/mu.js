import mu from '../models/mu.js'

export const getMu = async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }
    let data = await mu.find(filter);
    res.send(data)
}
export const getMuById = async (req, res) => {
    let data = await mu.find(req.params);
    res.send(data)
}
export const postMu = async (req, res) => {
    const { name, code,userId,active,value} = req.body;
    let data = await new mu({ name, code,userId,active,value })
    await data.save().then(result => {
        console.log(result, "Mu data save to database")
        res.json({
            name: result.name,
            code: result.code,
            userId:result.userId,
            active:result.active,
            value:result.value
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateMu = async (req, res) => {
    let data = await mu.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },{new:true}
    );
    if (data) {
        res.send({ message: "mu data updated successfully" });
    }
    else {
        res.send({ message: "mu data cannot be updated successfully" })
    }
}

export const deleteMu = async (req, res) => {
    console.log(req.params)
    let data = await mu.deleteOne(req.params)

    if (data) {
        res.send({ message: "mu data delete successfully" });
    }
    else {
        res.send({ message: "mu data cannot delete successfully" })
    }
}

