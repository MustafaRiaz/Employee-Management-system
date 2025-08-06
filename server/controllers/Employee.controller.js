import { Department } from "../models/Department.model.js"
import { Employee } from "../models/Employee.model.js"
import { Organization } from "../models/Organization.model.js"
import PDFDocument from 'pdfkit'; // Import pdfkit

export const HandleAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ organizationID: req.ORGID })
            .populate("department", "name")
            .select("firstname lastname email contactnumber department attendance notice salary leaverequest generaterequest isverified")
        return res.status(200).json({ success: true, data: employees, type: "AllEmployees" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}

export const HandleAllEmployeesIDS = async (req, res) => {
    try {
        const employees = await Employee.find({ organizationID: req.ORGID })
            .populate("department", "name")
            .select("firstname lastname department")
        return res.status(200).json({ success: true, data: employees, type: "AllEmployeesIDS" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}

export const HandleEmployeeByHR = async (req, res) => {
    try {
        const { employeeId } = req.params
        const employee = await Employee.findOne({ _id: employeeId, organizationID: req.ORGID })
            .select("firstname lastname email contactnumber department attendance notice salary leaverequest generaterequest")

        if (!employee) {
            return res.status(404).json({ success: false, message: "employee not found" })
        }

        return res.status(200).json({ success: true, data: employee, type: "GetEmployee" })
    }
    catch (error) {
        return res.status(404).json({ success: false, error: error, message: "employee not found" })
    }
}

export const HandleEmployeeByEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOne({ _id: req.EMid, organizationID: req.ORGID })
            .select("firstname lastname email contactnumber department attendance notice salary leaverequest generaterequest")

        if (!employee) {
            return res.status(404).json({ success: false, message: "employee not found" })
        }

        return res.json({ success: true, message: "Employee Data Fetched Successfully", data: employee })

    } catch (error) {
        return res.json({ success: false, message: "Internal Server Error", error: error })
    }
}

export const HandleEmployeeUpdate = async (req, res) => {
    try {
        const { employeeId, updatedEmployee } = req.body

        const checkeemployee = await Employee.findById(employeeId)

        if (!checkeemployee) {
            return res.status(404).json({ success: false, message: "employee not found" })
        }

        const employee = await Employee.findByIdAndUpdate(employeeId, updatedEmployee, { new: true })
            .select("firstname lastname email contactnumber department")
        return res.status(200).json({ success: true, data: employee })

    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}

export const HandleEmployeeDelete = async (req, res) => {
    try {
        const { employeeId } = req.params
        const employee = await Employee.findOne({ _id: employeeId })

        if (!employee) {
            return res.status(404).json({ success: false, message: "employee not found" })
        }

        const department = await Department.findById(employee.department)

        if (department) {
            department.employees.splice(department.employees.indexOf(employeeId), 1)
            await department.save()
        }

        const organization = await Organization.findById(employee.organizationID)

        if (!organization) {
            return res.status(404).json({ success: false, message: "organization not found" })
        }

        organization.employees.splice(organization.employees.indexOf(employeeId), 1)

        await organization.save()
        await employee.deleteOne()

        return res.status(200).json({ success: true, message: "Employee deleted successfully", type: "EmployeeDelete" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}

// New function to handle PDF report generation
export const HandleGenerateEmployeeReport = async (req, res) => {
    try {
        // Ensure that req.ORGID is available from your authentication middleware
        if (!req.ORGID) {
            return res.status(401).json({ success: false, message: "Organization ID not found in request." });
        }

        const employees = await Employee.find({ organizationID: req.ORGID })
            .populate("department", "name") // Populate department to get its name
            .select("firstname lastname email contactnumber department"); // Select relevant fields for the report

        const doc = new PDFDocument();
        let filename = `employee_report_${Date.now()}.pdf`; // Dynamic filename
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res); // Pipe the PDF to the response

        doc.fontSize(25).text('Employee Report', { align: 'center' });
        doc.moveDown();

        // Add Organization Name if available
        const organization = await Organization.findById(req.ORGID).select("name");
        if (organization) {
            doc.fontSize(16).text(`Organization: ${organization.name}`, { align: 'center' });
            doc.moveDown();
        }

        // Table Headers
        doc.fontSize(12).font('Helvetica-Bold');
        const headerY = doc.y;
        doc.text('Full Name', 50, headerY, { width: 120, continued: true });
        doc.text('Email', 180, headerY, { width: 150, continued: true });
        doc.text('Department', 340, headerY, { width: 100, continued: true });
        doc.text('Contact Number', 450, headerY);
        doc.moveDown();
        doc.font('Helvetica');

        // Add a line separator
        doc.strokeColor('#aaaaaa')
           .lineWidth(1)
           .moveTo(50, doc.y)
           .lineTo(550, doc.y)
           .stroke();
        doc.moveDown(0.5); // Small move down for spacing

        // Employee Data
        if (employees.length === 0) {
            doc.fontSize(12).text('No employees found for this organization.', { align: 'center' });
        } else {
            employees.forEach(employee => {
                const fullName = `${employee.firstname || ''} ${employee.lastname || ''}`.trim();
                const departmentName = employee.department ? employee.department.name : 'N/A';

                doc.text(fullName, 50, doc.y, { width: 120, continued: true });
                doc.text(employee.email || '', 180, doc.y, { width: 150, continued: true });
                doc.text(departmentName, 340, doc.y, { width: 100, continued: true });
                doc.text(employee.contactnumber || '', 450, doc.y);
                doc.moveDown();

                // Check for page breaks if content is too long
                if (doc.y > 700) { // Arbitrary height, adjust as needed
                    doc.addPage();
                    doc.fontSize(12).font('Helvetica-Bold');
                    const newHeaderY = doc.y;
                    doc.text('Full Name', 50, newHeaderY, { width: 120, continued: true });
                    doc.text('Email', 180, newHeaderY, { width: 150, continued: true });
                    doc.text('Department', 340, newHeaderY, { width: 100, continued: true });
                    doc.text('Contact Number', 450, newHeaderY);
                    doc.moveDown();
                    doc.font('Helvetica');
                    doc.strokeColor('#aaaaaa')
                       .lineWidth(1)
                       .moveTo(50, doc.y)
                       .lineTo(550, doc.y)
                       .stroke();
                    doc.moveDown(0.5);
                }
            });
        }


        doc.end(); // Finalize the PDF

    } catch (error) {
        console.error('Error generating PDF:', error);
        return res.status(500).json({ success: false, error: error.message, message: "Error generating PDF report" });
    }
}