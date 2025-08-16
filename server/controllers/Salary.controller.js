import { Salary } from "../models/Salary.model.js";
import { Employee } from "../models/Employee.model.js";

// Create salary record
export const createSalary = async (req, res) => {
    // 🐛 DEBUG: Log the entire request body to see what the frontend is sending.
    console.log("🐛 [DEBUG] createSalary: Request body received:", req.body);

    try {
        // NOTE: Corrected variable name from employeeId to employee based on your frontend code
        const { employee, bonuses, deductions, currency, duedate } = req.body;

        // 🐛 DEBUG: Log the extracted variables.
        console.log("🐛 [DEBUG] Extracted fields: employee=", employee, ", bonuses=", bonuses, ", duedate=", duedate);

        // 1. Fetch employee
        // 🐛 DEBUG: Log the ID being used to find the employee.
        console.log("🐛 [DEBUG] Attempting to find employee with ID:", employee);
        const employeeRecord = await Employee.findById(employee);

        // 🐛 DEBUG: Log if the employee was found.
        if (!employeeRecord) {
            console.error("🐛 [ERROR] Employee not found for ID:", employee);
            return res.status(404).json({ message: "Employee not found" });
        }
        console.log("✅ [SUCCESS] Employee found:", employeeRecord.firstname, employeeRecord.lastname);

        const basicpay = employeeRecord.salary;
        const netpay = basicpay + bonuses - deductions;

        // 🐛 DEBUG: Log the calculated values.
        console.log("🐛 [DEBUG] Calculated values: basicpay=", basicpay, ", netpay=", netpay);

        // 2. Create salary entry
        const newSalary = new Salary({
            employee: employeeRecord._id,
            basicpay,
            bonuses,
            deductions,
            netpay,
            currency,
            duedate,
            status: "Pending",
            organizationID: employeeRecord.organizationID
        });

        // 🐛 DEBUG: Log the new salary object before it is saved.
        console.log("🐛 [DEBUG] New salary object to be saved:", newSalary);
        await newSalary.save();
        console.log("✅ [SUCCESS] New salary record saved to database:", newSalary._id);

        // 3. Populate employee name
        const populatedSalary = await Salary.findById(newSalary._id)
            .populate("employee", "firstname lastname email");

        // 🐛 DEBUG: Log the final populated object before sending the response.
        console.log("✅ [SUCCESS] Populated salary record for response:", populatedSalary);

        res.status(201).json({
            message: "Salary record created successfully",
            salary: populatedSalary
        });
    } catch (error) {
        // 🐛 DEBUG: Log a detailed error message if anything fails.
        console.error("❌ [ERROR] Error creating salary:", error.message, "\nStack Trace:", error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all salaries (Admin)
export const getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find()
            .populate("employee", "firstname lastname email")
            .sort({ duedate: -1 });

        res.json(salaries);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch salaries", error });
    }
};

// Get salaries by employee (Employee panel)
export const getSalariesByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const salaries = await Salary.find({ employee: employeeId })
            .populate("employee", "firstname lastname email")
            .sort({ duedate: -1 });

        res.json(salaries);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch employee salaries", error });
    }
};

// Mark salary as paid
export const markSalaryPaid = async (req, res) => {
    try {
        const { salaryId } = req.params;

        const salary = await Salary.findById(salaryId);
        if (!salary) return res.status(404).json({ message: "Salary not found" });

        salary.status = "Paid";
        salary.paymentdate = new Date();

        await salary.save();

        res.json({ message: "Salary marked as paid", salary });
    } catch (error) {
        res.status(500).json({ message: "Failed to update salary", error });
    }
};