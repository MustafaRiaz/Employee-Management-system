import { HRSignupPage } from "../pages/HumanResources/HRSignup";
import { HRLogin } from "../pages/HumanResources/HRlogin";
import { HRDashbaord } from "../pages/HumanResources/HRdashbaord";
import { VerifyEmailPage } from "../pages/HumanResources/verifyemailpage.jsx";
import { HRForgotPasswordPage } from "../pages/HumanResources/forgotpassword.jsx";
import { ResetMailConfirmPage } from "../pages/HumanResources/resetmailconfirm.jsx";
import { ResetHRPasswordPage } from "../pages/HumanResources/resetpassword.jsx";
import { ResetHRVerifyEmailPage } from "../pages/HumanResources/resetemail.jsx";
import { HRDashboardPage } from "../pages/HumanResources/Dashboard Childs/dashboardpage.jsx";
import { HREmployeesPage } from "../pages/HumanResources/Dashboard Childs/employeespage.jsx";
import { HRDepartmentPage } from "../pages/HumanResources/Dashboard Childs/departmentpage.jsx";
import {HRLeaveRequests} from "../pages/HumanResources/Dashboard Childs/HRLeaveRequests.jsx";

import Attendance from "../pages/HumanResources/Dashboard Childs/attendance.jsx";
import SalaryManagement from "../pages/HumanResources/Dashboard Childs/salarymanagement.jsx";
import HRProfile from "../pages/HumanResources/Dashboard Childs/HRProfile.jsx";

export const HRRoutes = [
  // Public HR auth routes
  {
    path: "/auth/HR/signup",
    element: <HRSignupPage />,
  },
  {
    path: "/auth/HR/login",
    element: <HRLogin />,
  },
  {
    path: "/auth/HR/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/auth/HR/reset-email-validation",
    element: <ResetHRVerifyEmailPage />,
  },
  {
    path: "/auth/HR/forgot-password",
    element: <HRForgotPasswordPage />,
  },
  {
    path: "/auth/HR/reset-email-confirmation",
    element: <ResetMailConfirmPage />,
  },
  {
    path: "/auth/HR/resetpassword/:token",
    element: <ResetHRPasswordPage />,
  },

  // HR dashboard routes (protected)
  {
    path: "/HR/dashboard",
    element: <HRDashbaord />,
    children: [
      {
        index: true, // Default child when visiting /HR/dashboard
        element: <HRDashboardPage />,
      },
      {
        path: "dashboard-data",
        element: <HRDashboardPage />,
      },
      {
        path: "employees",
        element: <HREmployeesPage />,
      },
      {
        path: "departments",
        element: <HRDepartmentPage />,
      },
      {
        path: "attendance",
        element: <Attendance />,
      },
      {
        path: "salaries",
        element: <SalaryManagement />,
      },
      {
        path: "leaves",
        element: <HRLeaveRequests />,
      },
      {
        path: "hrprofile",
        element: <HRProfile />,
      },
    ],
  },
];
