import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import StudentDashboard from "../pages/student/Dashboard";
import GenerateToken from "../pages/student/GenerateToken";
import MyQueue from "../pages/student/MyQueue";
import Profile from "../pages/student/Profile";
import AdminDashboard from "../pages/admin/Dashboard";
import QueueManagement from "../pages/admin/QueueManagement";
import Departments from "../pages/admin/Departments";
import History from "../pages/admin/History";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/generate-token"
          element={
            <ProtectedRoute>
              <GenerateToken />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-queue"
          element={
            <ProtectedRoute>
              <MyQueue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tokens"
          element={
            <ProtectedRoute>
              <QueueManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/departments"
          element={
            <ProtectedRoute>
              <Departments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
