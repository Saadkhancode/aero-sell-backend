import employee from '../models/employee.js';


export const getEmployee = async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }
    if(req.query.role){
     filter={role:req.query.role.split(',')}
    }
    let data = await employee.find(filter).populate('role')
    res.send(data);

}
export const getEmployeeById = async (req, res) => {
    let data = await employee.findOne(req.params)
    res.send(data);

}
export const postEmployee = async (req, res) => {
    const { userName, firstName, lastName, email, password,confirmPassword,  userId,role } = req.body;
    const data = await new employee({ userName, firstName, lastName,confirmPassword, email, password, userId,role});
    await data.save().then(result => {
        console.log(result, "Employee data save to database")
        res.json({
            userName: result.userName,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            password: result.password,
            userId:result.userId,
            confirmPassword:result.confirmPassword,
            role:result.role
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const employeeLogin=async(req,res)=>{
    const {password}=req.body
     const employe= await employee.findOne({password});
     if (!employe) {
        return res.status(400).send({ message: "employee does'nt Exists" });
      }
      if (employe.password !== password) {
        return res.status(400).send({ message: "wrong password" });
      }
     res.status(200).json({ message: "Employee Login Successfully",userId:employe.userId,starDate:employe.startDate,employeId:employe._id});

}
export const updateEmployee = async (req, res) => {
    console.log(req.params);
    let data = await employee.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },
        { new: true }
    )
    if (data) {
        res.send({ message: "employee data updated successfully" });
    }
    else {
        res.send({ message: "employee data cannot be updated successfully" })
    }
}
export const deleteEmployee = async (req, res) => {
    console.log(req.params)
    let data = await employee.deleteOne(req.params)
    if (data) {
        res.send({ message: "employee data delete successfully" });
    }
    else {
        res.send({ message: "employee data cannot delete successfully" })
    }
}
