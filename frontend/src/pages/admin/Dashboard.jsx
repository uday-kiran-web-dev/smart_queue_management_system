import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import { getDashboardStats } from "../../services/adminService";
import { Users, UserCheck, CheckCircle2, XCircle } from "lucide-react";

// Main admin dashboard interface
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    waiting: 0,
    called: 0,
    completed: 0,
    skipped: 0,
  });
  
  const loadDashboard = useCallback(async () => {
    try {
      const response = await getDashboardStats();
      setStats(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Waiting" value={stats.waiting} icon={Users} colorType="amber" />
        <StatCard title="Called" value={stats.called} icon={UserCheck} colorType="blue" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} colorType="green" />
        <StatCard title="Skipped" value={stats.skipped} icon={XCircle} colorType="rose" />
      </div>
    </DashboardLayout>
  );
}
