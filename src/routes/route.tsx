import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import LayoutMenu from "../pages/Layout";
import { EquipmentPage } from "../pages/EquipmentPage";
import MaintenanceHistoryPage from "../pages/MaintenanceHistoryPage";
import TaskManagementPage from "../pages/TaskManagementPage";
import UserManagementPage from "../pages/UserManagementPage";
import SchedulePage from "../pages/SchedulePage";
import AdminDashboard from "../pages/Dashboard";
import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <LoginPage />,
    errorElement: <div>Page not found</div>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <LayoutMenu />,
    errorElement: <div>Page not found</div>,
    children: [
      {
        element: <ProtectedRoute allowedRoles={["Admin"]} />,
        children: [
          { path: "/Dashboard", element: <AdminDashboard /> },
          { path: "/Equipment", element: <EquipmentPage /> },
          { path: "/MaintenanceHistory", element: <MaintenanceHistoryPage /> },
          { path: "/UserManagement", element: <UserManagementPage /> },
          { path: "/SchedulePage", element: <SchedulePage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["Technician", "Admin"]} />,
        children: [
          { path: "/TaskManagement", element: <TaskManagementPage /> },
        ],
      },
    ],
  },
]);


export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
