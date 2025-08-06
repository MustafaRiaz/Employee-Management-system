import { ListWrapper, HeadingBar, ListContainer } from "../../../components/common/Dashboard/ListDesigns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HandleGetHREmployees } from "../../../redux/Thunks/HREmployeesThunk.js";
import { Loading } from "../../../components/common/loading.jsx";
import axios from "axios";

const AttendancePage = () => {
    const dispatch = useDispatch();
    const HREmployeesState = useSelector((state) => state.HREmployeesPageReducer);
    const table_headings = ["Full Name", "Email", "Department", "Contact Number", "Status"];

    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // YYYY-MM-DD

    // 🔁 Fetch all employees
    useEffect(() => {
        dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
    }, [dispatch]);

    useEffect(() => {
        if (HREmployeesState.fetchData) {
            dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
        }
    }, [HREmployeesState.fetchData, dispatch]);

    // ✅ Fetch attendance for selected date
    const fetchAttendanceByDate = async (date) => {
        try {
            const res = await axios.get(`/api/attendance?date=${date}`);
            if (res.data.success && Array.isArray(res.data.attendance)) {
                const mappedStatus = {};
                res.data.attendance.forEach(record => {
                    mappedStatus[record.employee] = record.status;
                });
                setAttendanceStatus(mappedStatus); // Pre-fill attendance
            } else {
                setAttendanceStatus({});
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    useEffect(() => {
        fetchAttendanceByDate(selectedDate);
    }, [selectedDate]);

    // 🔁 When user changes dropdown
    const handleStatusChange = (employeeId, status) => {
        setAttendanceStatus((prev) => ({
            ...prev,
            [employeeId]: status,
        }));
    };

    // ✅ Save updated attendance
    const handleSaveAttendance = async () => {
        setIsSaving(true);
        setMessage("");

        const attendanceArray = Object.entries(attendanceStatus).map(([employeeId, status]) => ({
            employee: employeeId,
            status,
            logdate: selectedDate,
        }));

        try {
            const res = await axios.post("/api/attendance", { records: attendanceArray });

            if (res.data.success) {
                setMessage("✅ Attendance saved successfully!");
                await fetchAttendanceByDate(selectedDate); // 🔁 Refresh after save
            } else {
                setMessage("❌ Failed to save attendance.");
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Error saving attendance.");
        } finally {
            setIsSaving(false);
        }
    };

    if (HREmployeesState.isLoading) {
        return <Loading />;
    }

    return (
        <div className="attendance-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            {/* Header & Save Button */}
            <div className="attendance-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Mark Attendance</h1>

                <div className="flex gap-4 items-center">
                    {/* 📅 Date Picker */}
                    <input
                        type="date"
                        className="border px-3 py-1 rounded"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    <button
                        onClick={handleSaveAttendance}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Attendance"}
                    </button>
                </div>
            </div>

            {/* Feedback Message */}
            {message && (
                <div className="text-center text-sm font-medium text-green-700">{message}</div>
            )}

            {/* Employee Table */}
            <div className="attendance-employee-list flex flex-col gap-4 md:pe-5 overflow-auto">
                <ListWrapper>
                    <HeadingBar table_layout={"grid-cols-5"} table_headings={table_headings} />
                </ListWrapper>

                <ListContainer>
                    {HREmployeesState.data && HREmployeesState.data.map((employee) => (
                        <div key={employee._id} className="grid grid-cols-5 items-center border-b py-2 px-4 hover:bg-gray-50">
                            <span>{employee.firstname} {employee.lastname}</span>
                            <span>{employee.email}</span>
                            <span>{employee.department?.name || "—"}</span>
                            <span>{employee.contactnumber || "—"}</span>
                            <select
                                className="border rounded px-2 py-1"
                                value={attendanceStatus[employee._id] || "Not Specified"}
                                onChange={(e) => handleStatusChange(employee._id, e.target.value)}
                            >
                                <option value="Not Specified">Not Specified</option>
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                            </select>
                        </div>
                    ))}
                </ListContainer>
            </div>
        </div>
    );
};

export default AttendancePage;
