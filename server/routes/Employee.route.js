import express from "express"
import { 
    HandleAllEmployees, 
    HandleEmployeeUpdate, 
    HandleEmployeeDelete, 
    HandleEmployeeByHR, 
    HandleEmployeeByEmployee, 
    HandleAllEmployeesIDS,
    HandleGenerateEmployeeReport // <--- Import the new handler here
} from "../controllers/Employee.controller.js" // Ensure this path is correct

import { VerifyhHRToken } from "../middlewares/Auth.middleware.js" // Assuming this sets req.ORGID
import { RoleAuthorization } from "../middlewares/RoleAuth.middleware.js"
import { VerifyEmployeeToken } from "../middlewares/Auth.middleware.js"

const router = express.Router()

// Existing routes
router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllEmployees)

router.get("/all-employees-ids", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllEmployeesIDS)

router.patch("/update-employee", VerifyEmployeeToken, HandleEmployeeUpdate)

router.delete("/delete-employee/:employeeId", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleEmployeeDelete)

router.get("/by-HR/:employeeId", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleEmployeeByHR)

router.get("/by-employee", VerifyEmployeeToken, HandleEmployeeByEmployee)

// New route for PDF report generation
// We'll typically protect this with HR-Admin role as well
router.get("/report-pdf", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleGenerateEmployeeReport) // <--- New route added here


export default router