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

    useEffect(() => {
        dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
    }, [dispatch]);

    useEffect(() => {
        if (HREmployeesState.fetchData) {
            dispatch(HandleGetHREmployees({ apiroute: "GETALL" }));
        }
    }, [HREmployeesState.fetchData, dispatch]);

    const handleStatusChange = (employeeId, status) => {
        setAttendanceStatus((prev) => ({
            ...prev,
            [employeeId]: status,
        }));
    };

    const handleSaveAttendance = async () => {
        setIsSaving(true);
        setMessage("");

        const attendanceArray = Object.entries(attendanceStatus).map(([employeeId, status]) => ({
            employee: employeeId,
            status,
            logdate: new Date().toISOString(), // you can also send new Date() if backend parses ISO
        }));

        try {
            const res = await axios.post("/api/attendance", { records: attendanceArray }); // Adjust path if needed

            if (res.data.success) {
                setMessage("✅ Attendance saved successfully!");
                setAttendanceStatus({}); // reset dropdowns
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
            <div className="attendance-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Mark Attendance</h1>
                <button
                    onClick={handleSaveAttendance}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Attendance"}
                </button>
            </div>

            {message && (
                <div className="text-center text-sm font-medium text-green-700">{message}</div>
            )}

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
