// import { Attendance } from "../models/Attendance.model.js"
// import { Employee } from "../models/Employee.model.js"

// export const HandleInitializeAttendance = async (req, res) => {
//     try {
//         const { employeeID } = req.body

//         if (!employeeID) {
//             return res.status(400).json({ success: false, message: "All fields are required" })
//         }

//         const employee = await Employee.findOne({ _id: employeeID, organizationID: req.ORGID })

//         if (!employee) {
//             return res.status(404).json({ success: false, message: "Employee not found" })
//         }

//         if (employee.attendance) {
//             return res.status(400).json({ success: false, message: "Attendance Log already initialized for this employee" })
//         }

//         const currentdate = new Date().toISOString().split("T")[0]
//         const attendancelog = {
//             logdate: currentdate,
//             logstatus: "Not Specified"
//         }

//         const newAttendance = await Attendance.create({
//             employee: employeeID,
//             status: "Not Specified",
//             organizationID: req.ORGID
//         })

//         newAttendance.attendancelog.push(attendancelog)
//         employee.attendance = newAttendance._id

//         await employee.save()
//         await newAttendance.save()

//         return res.status(200).json({ success: true, message: "Attendance Log Initialized Successfully", data: newAttendance })

//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
//     }
// }

// export const HandleAllAttendance = async (req, res) => {
//     try {
//         const attendance = await Attendance.find({ organizationID: req.ORGID }).populate("employee", "firstname lastname department")
//         return res.status(200).json({ success: true, message: "All attendance records retrieved successfully", data: attendance })
//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
//     }
// }

// export const HandleAttendance = async (req, res) => {
//     try {
//         const { attendanceID } = req.params

//         if (!attendanceID) {
//             return res.status(400).json({ success: false, message: "All fields are required" })
//         }

//         const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID }).populate("employee", "firstname lastname department")

//         if (!attendance) {
//             return res.status(404).json({ success: false, message: "Attendance not found" })
//         }

//         return res.status(200).json({ success: true, message: "Attendance record retrieved successfully", data: attendance })

//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
//     }
// }

// export const HandleUpdateAttendance = async (req, res) => {
//     try {
//         const { attendanceID, status, currentdate } = req.body

//         const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID })

//         if (!attendance) {
//             return res.status(404).json({ success: false, message: "Attendance not found" })
//         }

//         const FindDate = attendance.attendancelog.find((item) => item.logdate.toISOString().split("T")[0] === currentdate)

//         if (!FindDate) {
//             const newLog = {
//                 logdate: currentdate,
//                 logstatus: status
//             }
//             attendance.attendancelog.push(newLog)
//         }
//         else {
//             FindDate.logstatus = status
//         }

//         await attendance.save()
//         return res.status(200).json({ success: true, message: "Attendance status updated successfully", data: attendance })
//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
//     }
// }

// export const HandleDeleteAttendance = async (req, res) => {
//     try {
//         const { attendanceID } = req.params
//         const attendance = await Attendance.findOne({ _id: attendanceID, organizationID: req.ORGID })

//         if (!attendance) {
//             return res.status(404).json({ success: false, message: "Attendance not found" })
//         }

//         const employee = await Employee.findById(attendance.employee)
//         employee.attendance = null

//         await employee.save()
//         await attendance.deleteOne()

//         return res.status(200).json({ success: true, message: "Attendance record deleted successfully" })
//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
//     }
// }
// export const HandleAttendanceByDate = async (req, res) => {
//   try {
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ success: false, message: "Date is required" });
//     }

//     // Get all employees
//     const employees = await Employee.find({ role: "Employee", organizationID: req.ORGID });

//     // Get all attendance logs
//     const attendances = await Attendance.find({ organizationID: req.ORGID });

//     const responseData = employees.map((emp) => {
//       const record = attendances.find((att) => att.employee.toString() === emp._id.toString());

//       const log = record?.attendancelog?.find(
//         (log) => log.logdate.toISOString().split("T")[0] === date
//       );

//       return {
//         employeeId: emp._id,
//         name: `${emp.firstname} ${emp.lastname}`,
//         department: emp.department || "N/A",
//         status: log ? log.logstatus : "Not Set",
//         attendanceID: record?._id || null,
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Attendance fetched for all employees",
//       data: responseData,
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Server error", error: err });
//   }
// };
import { Attendance } from "../models/Attendance.model.js";

export const HandleSaveAttendance = async (req, res) => {
    try {
        const { records } = req.body;

        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ success: false, message: "Invalid attendance data" });
        }

        for (const record of records) {
            const { employee, status, logdate } = record;

            // Check if attendance already exists for employee
            let existing = await Attendance.findOne({ employee, organizationID: req.ORGID });

            if (existing) {
                // Update existing attendance log
                existing.attendancelog.push({ logdate, logstatus: status });
                existing.status = status; // Optional: update current status
                await existing.save();
            } else {
                // Create new attendance record
                await Attendance.create({
                    employee,
                    status,
                    attendancelog: [{ logdate, logstatus: status }],
                    organizationID: req.ORGID
                });
            }
        }

        return res.status(200).json({ success: true, message: "Attendance saved successfully" });

    } catch (error) {
        console.error("Error saving attendance:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};
