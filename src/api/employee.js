import {employee,employeeType} from '../models/employee.js';


export const getEmployeeType = async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }
    if(req.query.role){
     filter={role:req.query.role.split(',')}
    }
    let data = await employeeType.find(filter)
    res.send(data);

}
export const getEmployee = async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }
    if(req.query.role){
     filter={role:req.query.role.split(',')}
    }
    let data = await employee.find(filter).populate('role').populate("employeeType")
    res.send(data);

}
export const getEmployeeById = async (req, res) => {
    let data = await employee.findOne(req.params)
    res.send(data);

}
export const postEmployeeType = async (req, res) => {
    const { userId,name } = req.body;
    const data = await new employeeType({userId,name});
    await data.save().then(result => {
        console.log(result, "Employee data save to database")
        res.json({
            name:result.name,
            userId:result.userId
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const postEmployee = async (req, res) => {
    const { userName, firstName, lastName, email, password,confirmPassword, employeeId, userId,role,hourlyRate,employeeType } = req.body;
    const data = await new employee({ userName, firstName, lastName,confirmPassword, email, password,employeeId, userId,role,hourlyRate,employeeType});
    await data.save().then(result => {
        console.log(result, "Employee data save to database")
        res.json({
            userName: result.userName,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            employeeId: result.employeeId,
            password: result.password,
            userId:result.userId,
            confirmPassword:result.confirmPassword,
            role:result.role,
            hourlyRate:result.hourlyRate,
            employeeType: result.employeeType
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const employeeLogin=async(req,res)=>{
    const {employeeId}=req.body
     const employe= await employee.findOne({employeeId});
     if (!employe) {
        return res.status(400).send({ message: "employee does'nt Exists" });
      }
      if (employe.employeeId != employeeId) {
        return res.status(400).send({ message: "wrong employeeId" });
      }else if(employe.employeeId == employeeId){
          res.status(200).json({ message: "Employee Login Successfully",userId:employe.userId,startDate:employe.startDate,employeId:employe._id,firstName:employe.firstName,lastName:employe.lastName, employeeId:employe.employeeId, hourlyRate:employe.hourlyRate, employeeType:employe.employeeType});
      }

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
export const deleteEmployeeType  = async (req, res) => {
    console.log(req.params)
    let data = await employeeType.deleteOne(req.params)
    if (data) {
        res.send({ message: "employee data delete successfully" });
    }
    else {
        res.send({ message: "employee data cannot delete successfully" })
    }
}
