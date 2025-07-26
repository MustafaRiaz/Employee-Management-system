// import express from 'express'
// import { HandleInitializeAttendance, HandleAllAttendance, HandleAttendance, HandleUpdateAttendance, HandleDeleteAttendance } from '../controllers/Attendance.controller.js'
// import { VerifyEmployeeToken, VerifyhHRToken } from '../middlewares/Auth.middleware.js'
// import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
// import { Employee } from '../models/Employee.model.js'
// import { Attendance } from '../models/Attendance.model.js'

// const router = express.Router()

// router.post("/initialize", VerifyEmployeeToken, HandleInitializeAttendance)

// router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllAttendance)

// router.get("/:attendanceID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAttendance)

// router.patch("/update-attendance", VerifyEmployeeToken, HandleUpdateAttendance)

// router.delete("/delete-attendance/:attendanceID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteAttendance)

// router.get("/by-date", VerifyhHRToken, RoleAuthorization("HR-Admin"), async (req, res) => {
//   try {
//     const { date } = req.query;

//     if (!date) {
//       return res.status(400).json({ message: "Date query param is required." });
//     }

//     const formattedDate = new Date(date);
//     formattedDate.setHours(0, 0, 0, 0);

//     // Get all employees
//     const employees = await Employee.find({}, "_id firstname lastname role"); // add more fields if needed

//     // Get existing attendance records for that day
//     const attendance = await Attendance.find({ date: formattedDate });

//     const response = employees.map((emp) => {
//       const existing = attendance.find(
//         (att) => att.employeeID.toString() === emp._id.toString()
//       );

//       return {
//         employeeId: emp._id,
//         name: `${emp.firstname} ${emp.lastname}`,
//         department: emp.role || "N/A",
//         attendanceID: existing ? existing._id : null,
//         status: existing ? existing.status : "Not Set",
//       };
//     });

//     res.status(200).json({ data: response });
//   } catch (err) {
//     console.error("Error in /by-date:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


// export default router

import express from 'express';
import { HandleSaveAttendance } from '../controllers/Attendance.controller.js';
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js';

const router = express.Router();

// Save daily attendance entries (bulk)
router.post('/', VerifyhHRToken, HandleSaveAttendance);

export default router;
