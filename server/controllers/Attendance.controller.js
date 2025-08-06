import { Attendance } from "../models/Attendance.model.js";

// POST /api/attendance
export const HandleSaveAttendance = async (req, res) => {
    try {
        const { records } = req.body;

        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ success: false, message: "Invalid attendance data" });
        }

        for (const record of records) {
            const { employee, status, logdate } = record;

            let existing = await Attendance.findOne({ employee, organizationID: req.ORGID });

            if (existing) {
                // Prevent duplicate log for same date
                const alreadyLogged = existing.attendancelog.some(log =>
                    new Date(log.logdate).toISOString().split("T")[0] === new Date(logdate).toISOString().split("T")[0]
                );

                if (!alreadyLogged) {
                    existing.attendancelog.push({ logdate, logstatus: status });
                }

                existing.status = status;
                await existing.save();
            } else {
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

// ✅ GET /api/attendance?date=YYYY-MM-DD
export const HandleGetAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ success: false, message: "Date query parameter is required" });
        }

        const logDateOnly = new Date(date).toISOString().split("T")[0];

        // Get all attendance records for organization
        const records = await Attendance.find({ organizationID: req.ORGID });

        const filtered = [];

        for (const record of records) {
            const log = record.attendancelog.find(l =>
                new Date(l.logdate).toISOString().split("T")[0] === logDateOnly
            );

            if (log) {
                filtered.push({
                    employee: record.employee,
                    status: log.logstatus,
                    logdate: logDateOnly
                });
            }
        }

        return res.status(200).json({ success: true, attendance: filtered });

    } catch (error) {
        console.error("Error fetching attendance by date:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
};
