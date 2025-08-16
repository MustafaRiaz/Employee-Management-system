import { Department } from "../models/Department.model.js"
import { HumanResources } from "../models/HR.model.js"
import { Organization } from "../models/Organization.model.js"

export const HandleAllHR = async (req, res) => {
    try {
        const HR = await HumanResources.find({ organizationID: req.ORGID }).populate("department")
        return res.status(200).json({ success: true, message: "All Human Resources Found Successfully", data: HR })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}
// ... (other imports and controller functions)

// ... (other imports and controller functions)

export const HandleMyProfile = async (req, res) => {
    try {
        // CORRECTED: Use the correct property from the middleware
        const HRID = req.HRid;

        if (!HRID) {
            // This should only happen if the token is invalid or missing
            return res.status(401).json({ success: false, message: "Authentication failed. User ID not found." });
        }
        
        // Find the HR user using the now-correct ID and populate the department
        const HR = await HumanResources.findById(HRID).populate("department");

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR Profile Not Found" });
        }

        // Return all profile data
        return res.status(200).json({ success: true, message: "HR Profile Found Successfully", data: HR });

    } catch (error) {
        console.error("Error in HandleMyProfile:", error);
        // Changed the error response to be more informative in case of a crash
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

export const HandleHR = async (req, res) => {
    try {
        const { HRID } = req.params
        const HR = await HumanResources.findOne({ _id: HRID, organizationID: req.ORGID })

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR Record Not Found" })
        }

        return res.status(200).json({ success: true, message: "Human Resources Found Successfully", data: HR })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}

export const HandleUpdateHR = async (req, res) => {
    try {
        const { HRID, Updatedata } = req.body

        if (!HRID || !Updatedata) {
            return res.status(400).json({ success: false, message: "Missing HRID or Updatedata" })
        }

        const updatedHR = await HumanResources.findByIdAndUpdate(HRID, Updatedata, { new: true })

        if (!updatedHR) {
            return res.status(404).json({ success: false, message: "HR Record Not Found" })
        }

        return res.status(200).json({ success: true, message: "Human Resources Updated Successfully", data: updatedHR })

    } catch (error) {
        return res.status(500).json({ success: false, message: "internal Server Error", error: error })
    }
}

export const HandleDeleteHR = async (req, res) => {
    try {
        const { HRID } = req.params

        const HR = await HumanResources.findOne({ _id: HRID, organizationID: req.ORGID })

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR Record Not Found" })
        }


        if (HR.department) {

            const department = await Department.findById(HR.department)

            if (department && department.HumanResources.includes(HRID)) {
                const index = department.HumanResources.indexOf(HRID)
                department.HumanResources.splice(index, 1)
            }

            await department.save()
        }

        const organization = await Organization.findById(req.ORGID)
        organization.HRs.splice(organization.HRs.indexOf(HRID), 1)

        await organization.save()
        await HR.deleteOne()
        
        return res.status(200).json({ success: true, message: "Human Resources Deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error })
    }
}