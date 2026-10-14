import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { defaultRouteForRole } from "@/lib/rbac";

import Login from "@/pages/Login";
import ManagerDashboard from "@/pages/dashboard/ManagerDashboard";
import OperationsHomePage from "@/pages/operations/OperationsHomePage";
import ShiftReportsPage from "@/pages/operations/ShiftReportsPage";
import MyTasksPage from "@/pages/operations/MyTasksPage";
import ManagerMyTasksPage from "@/pages/dashboard/ManagerMyTasksPage";
import TasksPage from "@/pages/tasks/TasksPage";
import CalendarPage from "@/pages/calendar/CalendarPage";
import EmployeesPage from "@/pages/employees/EmployeesPage";
import EmployeeDetailPage from "@/pages/employees/EmployeeDetailPage";
import TeamsPage from "@/pages/teams/TeamsPage";
import TeamDetailPage from "@/pages/teams/TeamDetailPage";
import TeamRevenuePage from "@/pages/revenue/TeamRevenuePage";
import InventoryPage from "@/pages/inventory/InventoryPage";
import NotificationsCenterPage from "@/pages/notifications/NotificationsCenterPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import PayrollPage from "@/pages/payroll/PayrollPage";
import AuditLogPage from "@/pages/audit/AuditLogPage";
import CustomerServiceHomePage from "@/pages/customerservice/CustomerServiceHomePage";
import CustomerServiceMyTasksPage from "@/pages/customerservice/CustomerServiceMyTasksPage";
import CustomerServiceReportsPage from "@/pages/customerservice/CustomerServiceReportsPage";
import CustomerServiceComplaintsPage from "@/pages/customerservice/CustomerServiceComplaintsPage";
import CustomerServiceSuggestionsPage from "@/pages/customerservice/CustomerServiceSuggestionsPage";
import CoordinatorDashboardPage from "@/pages/coordinator/CoordinatorDashboardPage";
import CoordinatorReportsPage from "@/pages/coordinator/CoordinatorReportsPage";

function RootRedirect() {
  const currentUser = useAuthStore((s) => s.currentUser);
  return <Navigate to={currentUser ? defaultRouteForRole(currentUser.role) : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RootRedirect />} />

        <Route path="/dashboard" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/operations" element={<ProtectedRoute><OperationsHomePage /></ProtectedRoute>} />
        <Route path="/operations/reports" element={<ProtectedRoute><ShiftReportsPage /></ProtectedRoute>} />
        <Route path="/operations/my-tasks" element={<ProtectedRoute><MyTasksPage /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
        <Route path="/my-tasks" element={<ProtectedRoute><ManagerMyTasksPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
        <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetailPage /></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
        <Route path="/teams/:id" element={<ProtectedRoute><TeamDetailPage /></ProtectedRoute>} />
        <Route path="/revenue" element={<ProtectedRoute><TeamRevenuePage /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsCenterPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/payroll" element={<ProtectedRoute><PayrollPage /></ProtectedRoute>} />
        <Route path="/audit-log" element={<ProtectedRoute><AuditLogPage /></ProtectedRoute>} />

        <Route path="/customer-service" element={<ProtectedRoute><CustomerServiceHomePage /></ProtectedRoute>} />
        <Route path="/customer-service/my-tasks" element={<ProtectedRoute><CustomerServiceMyTasksPage /></ProtectedRoute>} />
        <Route path="/customer-service/reports" element={<ProtectedRoute><CustomerServiceReportsPage /></ProtectedRoute>} />
        <Route path="/customer-service/complaints" element={<ProtectedRoute><CustomerServiceComplaintsPage /></ProtectedRoute>} />
        <Route path="/customer-service/suggestions" element={<ProtectedRoute><CustomerServiceSuggestionsPage /></ProtectedRoute>} />

        <Route path="/coordinator" element={<ProtectedRoute><CoordinatorDashboardPage /></ProtectedRoute>} />
        <Route path="/coordinator/reports" element={<ProtectedRoute><CoordinatorReportsPage /></ProtectedRoute>} />

        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
