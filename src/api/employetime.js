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
    if (!req.params._id) {
        const { employees ,employeeId} = req.body;
        const data = await new emplyeeTime({ employees,employeeId });
        await data.save().then(result => {
            console.log(result, "EmployeeTime data save to database")
            res.json({
                employees: result.employees,
                employeeId:result.employeeId
            })
        }).catch(err => {
            res.status(400).send('unable to save database');
            console.log(err)
        })
    } else {
        await emplyeeTime.findByIdAndUpdate(
            { employeeId: req.query.employeeId },
            {
                $push: {
                    employees: { empName, startDate, starthour, endDate, endHour},employeeId
                },
            },
            { new: true },
            (err, updatedEmployees) => {
                if (err) {
                    res.status(500).json({ message: "Error pushing employeeTime" });
                } else {
                    res.status(200).json({
                        message: "new EmployeeTime Data Saved Successfully",
                        updatedEmployees,
                    });
                }
            }
        );
    }
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
