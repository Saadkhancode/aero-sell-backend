import emplyeeTime from "../models/employeetime.js"

export const getEmployeeTime = async (req, res) => {
    let filter = {}
    if (req.query.employeeId) {
        filter = { employeeId: req.query.employeeId.split(',') }
    }
    let data = await emplyeeTime.find(filter).populate('employeeId')
    res.send(data);

}

export const postEmployeeTime = async (req, res) => {
    // const empTime = await emplyeeTime.findOne({employeeId:req.query.employeeId})
    // if (!req.query.employeeId) {
        const { empName,startDate,startHour,endDate,endHour, employeeId } = req.body;
        const data = await new emplyeeTime({ empName,startDate,startHour,endDate,endHour, employeeId });
        await data.save().then(result => {
            console.log(result, "EmployeeTime data save to database")
            res.json({
                empName:result.empName,
                startDate:result.startDate,
                startHour:result.startHour,
                endHour:result.endHour,
                endDate:result.endDate,
                employeeId: result.employeeId
            })
        }).catch(err => {
            res.status(400).send('unable to save database');
            console.log(err)
        })
    // } else {
    //     const { empName, startDate, startHour, endDate, endHour } = req.body
    //     const empTime = await emplyeeTime.findOne({employeeId:req.query.employeeId})
    //     const pushitems = empTime.employees.push({ empName, startDate, startHour, endDate, endHour })
    //     console.log('pushitems: ', pushitems);
    //     empTime.save().then(data => {
    //         res.status(200).send({
    //             message: "new EmployeeTime Data Saved Successfully",
    //             data,
    //         })
    //     }).catch(err => {
    //         res.status(500).send({ message: "Error pushing employeeTime" })

    //     })
    // }
}
export const updateEmployeeTime = async (req, res) => {
    console.log(req.params);
    let data = await emplyeeTime.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },
        { new: true }
    )
    if (data) {
        res.send({ message: "employeeTime data updated successfully" });
    }
    else {
        res.send({ message: "employeeTime data cannot be updated successfully" })
    }
}
// export const deleteEmployee = async (req, res) => {
//     console.log(req.params)
//     let data = await employee.deleteOne(req.params)
//     if (data) {
//         res.send({ message: "employee data delete successfully" });
//     }
//     else {
//         res.send({ message: "employee data cannot delete successfully" })
//     }
// }
