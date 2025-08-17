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

    const handleLogout = async () => {
        try {
            // 🔹 Call HR logout API to clear HttpOnly HRtoken cookie
            await fetch("http://localhost:5000/api/auth/HR/logout", {
                method: "POST",
                credentials: "include", // include cookies
            });
        } catch (err) {
            console.error("HR Logout failed:", err);
        }

        // 🔹 Clear all cookies for current page (http://localhost:5173)
        document.cookie.split(";").forEach((cookie) => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
        });

        // 🔹 Clear local/session storage
        localStorage.clear();
        sessionStorage.clear();

        // 🔹 Redirect + refresh to login
        window.location.href = "/";
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

                            <NavLink to={"/HR/dashboard/leaves"} className={({ isActive }) => isActive ? "bg-blue-200 rounded-lg" : ""}>
                                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                                    <img src="/../../src/assets/HR-Dashboard/leave.png" alt="" className="w-7 ms-2 my-1" />
                                    <button className="text-[16px]">Leaves</button>
                                </SidebarMenuItem>
                            </NavLink>

                            

                            <NavLink to={"/HR/dashboard/hrprofile"} className={({ isActive }) => isActive ? "bg-blue-200 rounded-lg" : ""}>
                                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                                    <img src="/../../src/assets/HR-Dashboard/HR-profiles.png" alt="" className="w-7 ms-2 my-1" />
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
