import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavLink, useNavigate } from "react-router-dom";

export function HRdashboardSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear auth data
        localStorage.removeItem("authToken"); // or whatever key you're using
        sessionStorage.clear();

        // Redirect to login
        navigate("/");
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-3 p-2">

                            <NavLink to={"/HR/dashboard/dashboard-data"} className={({ isActive }) => isActive ? "bg-blue-200 rounded-lg" : ""}>
                                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                                    <img src="/../../src/assets/HR-Dashboard/dashboard.png" alt="" className="w-7 ms-2 my-1" />
                                    <button className="text-[16px]">Dashboard</button>
                                </SidebarMenuItem>
                            </NavLink>

                            <NavLink to={"/HR/dashboard/employees"} className={({ isActive }) => isActive ? "bg-blue-200 rounded-lg" : ""}>
                                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                                    <img src="/../../src/assets/HR-Dashboard/employee-2.png" alt="" className="w-7 ms-2 my-1" />
                                    <button className="text-[16px]">Employees</button>
                                </SidebarMenuItem>
                            </NavLink>

                            <NavLink to={"/HR/dashboard/salaries"} className={({ isActive }) => isActive ? "bg-blue-200 rounded-lg" : ""}>
                                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                                    <img src="/../../src/assets/HR-Dashboard/salary.png" alt="" className="w-7 ms-2 my-1" />
                                    <button className="text-[16px]">Salaries</button>
                                </SidebarMenuItem>
                            </NavLink>

                            <NavLink to={"/HR/dashboard/departments"} className={({ isActive }) => isActive ? "bg-blue-200 rounded-lg" : ""}>
                                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                                    <img src="/../../src/assets/HR-Dashboard/department.png" alt="" className="w-7 ms-2 my-1" />
                                    <button className="text-[16px]">Departments</button>
                                </SidebarMenuItem>
                            </NavLink>

                            <NavLink to={"/HR/dashboard/attendance"} className={({ isActive }) => isActive ? "bg-blue-200 rounded-lg" : ""}>
                                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                                    <img src="/../../src/assets/HR-Dashboard/attendance.png" alt="" className="w-7 ms-2 my-1" />
                                    <button className="text-[16px]">Attendances</button>
                                </SidebarMenuItem>
                            </NavLink>

                            <SidebarMenuItem className="my-1">
                                <SidebarMenuButton className="gap-4">
                                    <img src="/../../src/assets/HR-Dashboard/leave.png" alt="" className="w-7" />
                                    <button className="text-[16px]">Leaves</button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <NavLink to={"/HR/dashboard/hrprofile"} className={({ isActive }) => isActive ? "bg-blue-200 rounded-lg" : ""}>
                                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                                    <img src="/../../src/assets/HR-Dashboard/attendance.png" alt="" className="w-7 ms-2 my-1" />
                                    <button className="text-[16px]">HR Profile</button>
                                </SidebarMenuItem>
                            </NavLink>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Logout button fixed at bottom */}
            <SidebarFooter>
                <SidebarMenuItem className="flex gap-4 hover:bg-red-200 rounded-lg cursor-pointer" onClick={handleLogout}>
                    <img src="/../../src/assets/HR-Dashboard/logout.png" alt="" className="w-7 ms-2 my-1" />
                    <button className="text-[16px] text-red-600 font-semibold">Logout</button>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    );
}
