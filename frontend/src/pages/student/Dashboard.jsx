import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatCard from "../../components/dashboard/StatCard";
import DepartmentCard from "../../components/dashboard/DepartmentCard";

import {
  getDepartments,
  generateToken,
  getMyToken,
  getMyPosition,
} from "../../services/dashboardService";

export default function Dashboard() {
  const [departments, setDepartments] = useState([]);

  const [token, setToken] = useState(null);

  const [position, setPosition] = useState(null);

  async function loadDashboard() {
    try {
      const departmentsData = await getDepartments();

      setDepartments(departmentsData);
    } catch (error) {
      console.error(error);
    }

    try {
      const tokenData = await getMyToken();

      setToken(tokenData);
    } catch {}

    try {
      const positionData = await getMyPosition();

      setPosition(positionData);
    } catch {}
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleGenerateToken(departmentId) {
    await generateToken(departmentId);

    await loadDashboard();

    alert("Token generated successfully");
  }

  return (
    <DashboardLayout title="Student Dashboard">
      <WelcomeCard />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <StatCard title="Current Token" value={token?.token_number || "--"} />

        <StatCard title="Queue Position" value={position?.position || "--"} />

        <StatCard title="Status" value={token?.status || "--"} />
      </div>

      <h2 className="mt-10 mb-4 text-2xl font-bold">Departments</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <DepartmentCard
            key={department._id}
            department={department}
            onGenerate={handleGenerateToken}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}
