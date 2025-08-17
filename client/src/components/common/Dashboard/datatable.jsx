import { useEffect, useState } from "react"
import axios from "axios"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export const DataTable = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/api/v1/employee/all",
                    {
                        withCredentials: true, // 🔑 send HRtoken cookie automatically
                    }
                )

                const employeesArray =
                    res.data?.employees || res.data?.data || res.data || []

                setEmployees(
                    employeesArray.map((emp, index) => ({
                        employeeID: index + 1,
                        firstName: emp.firstname || "N/A",
                        lastName: emp.lastname || "N/A",
                        email: emp.email || "N/A",
                        department: emp.department?.name || emp.department || "N/A",
                    }))
                )
            } catch (err) {
                console.error("Error fetching employees:", err)
                if (err.response?.status === 401) {
                    setError("Unauthorized: Please login as HR to view employees")
                } else {
                    setError("Failed to load employees")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchEmployees()
    }, [])

    if (loading) return <p className="text-center">Loading employees...</p>
    if (error) return <p className="text-center text-red-500">{error}</p>

    return (
        <div className="overflow-auto h-full">
            <div className="employees-heading mx-3 my-2">
                <p className="min-[250px]:text-xl xl:text-3xl font-bold min-[250px]:text-center sm:text-start">
                    Employees
                </p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {employees.map((emp) => (
                        <TableRow key={emp.employeeID}>
                            <TableCell className="font-medium">
                                {emp.employeeID}
                            </TableCell>
                            <TableCell>{emp.firstName}</TableCell>
                            <TableCell>{emp.lastName}</TableCell>
                            <TableCell>{emp.email}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
