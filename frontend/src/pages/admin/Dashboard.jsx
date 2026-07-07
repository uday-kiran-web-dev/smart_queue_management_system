import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import AdminStatCard from "../../components/admin/AdminStatCard";
import { getDashboardStats } from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    waiting: 0,
    called: 0,
    completed: 0,
    skipped: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getDashboardStats();

        setStats(response);
      } catch (error) {
        console.error(error);
      }
    }

    loadDashboard();
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard title="Waiting" value={stats.waiting} />

        <AdminStatCard title="Called" value={stats.called} />

        <AdminStatCard title="Completed" value={stats.completed} />

        <AdminStatCard title="Skipped" value={stats.skipped} />
      </div>
    </DashboardLayout>
  );
}
