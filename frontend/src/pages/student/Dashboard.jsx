import { useEffect, useState, useContext } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatCard from "../../components/dashboard/StatCard";
import DepartmentCard from "../../components/dashboard/DepartmentCard";
import useQueueSocket from "../../hooks/useQueueSocket";
import { AuthContext } from "../../context/AuthContext";

import {
  getDepartments,
  generateToken,
  getMyToken,
  getMyPosition,
} from "../../services/dashboardService";
import toast from "react-hot-toast";
import { Hash, Users, Activity } from "lucide-react";

// Entry point for the student dashboard
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);

  const [token, setToken] = useState(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [position, setPosition] = useState(null);

  // Fetch departments, token & position
  async function loadDashboard() {
    try {
      const departmentsData = await getDepartments();
      setDepartments(departmentsData);
    } catch (error) {
      console.error(error);
    }

    // Only load token and position for students
    if (user?.role === "student") {
      try {
        const tokensData = await getMyToken();
        // Get the latest active token
        const activeTokens = Array.isArray(tokensData)
          ? tokensData.filter((t) => t.status === "waiting" || t.status === "called")
          : [];
        const currentToken = activeTokens.length > 0 ? activeTokens[activeTokens.length - 1] : null;
        setToken(currentToken);
      } catch {}

      try {
        const positionData = await getMyPosition();
        setPosition(positionData);
      } catch {}
    }
  }

  // Refresh dashboard on queue updates
  useQueueSocket(() => {
    loadDashboard();
  });

  // Initial load & reload on role change
  useEffect(() => {
    loadDashboard();
  }, [user?.role]);

  // Create a new token for a department
  async function handleGenerateToken(departmentId) {
    setLoadingToken(true);
    try {
      await generateToken(departmentId);
      await loadDashboard();
      toast.success("Token generated successfully");
    } finally {
      setLoadingToken(false);
    }
  }

  return (
    <DashboardLayout title="Student Dashboard">
      <WelcomeCard />

      {user?.role === "student" && (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <StatCard
            title="Current Token"
            value={token?.token_number || "No Token"}
            icon={Hash}
            colorType="blue"
          />

          <StatCard
            title="Queue Position"
            value={position?.position || "Not in Queue"}
            icon={Users}
            colorType="indigo"
          />

          <StatCard 
            title="Status" 
            value={token?.status || "No Token"} 
            icon={Activity}
            colorType={
              token?.status === "completed" ? "green" : 
              token?.status === "waiting" ? "amber" : 
              token?.status === "skipped" || token?.status === "cancelled" ? "rose" : "slate"
            }
          />
        </div>
      )}

      {/* <h2 className="mt-10 mb-4 text-2xl font-bold">Departments</h2> */}

      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <DepartmentCard
            key={department._id}
            department={department}
            onGenerate={handleGenerateToken}
            loading={loadingToken}
          />
        ))}
      </div> */}
    </DashboardLayout>
  );
}
