import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import DepartmentSelector from "../../components/admin/DepartmentSelector";
import QueueTable from "../../components/admin/QueueTable";
import AdminStatCard from "../../components/admin/AdminStatCard";

import {
  getDashboardStats,
  getWaitingQueue,
  callNextStudent,
  completeService,
  skipStudent,
} from "../../services/adminService";

import { getDepartments } from "../../services/dashboardService";
import useQueueSocket from "../../hooks/useQueueSocket";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    waiting: 0,
    called: 0,
    completed: 0,
    skipped: 0,
  });
  const [departments, setDepartments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [queue, setQueue] = useState([]);
  async function loadDashboard() {
    try {
      const response = await getDashboardStats();

      setStats(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadDepartments() {
    try {
      const response = await getDepartments();
      setDepartments(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadQueue(departmentId) {
    if (!departmentId) return;

    try {
      const response = await getWaitingQueue(departmentId);

      setQueue(response);
    } catch (error) {
      console.error(error);
    }
  }

  function handleDepartmentChange(departmentId) {
    setSelectedDepartment(departmentId);

    loadQueue(departmentId);
  }

  async function handleCallNext() {
    if (!selectedDepartment) return;

    try {
      await callNextStudent(selectedDepartment);

      await loadQueue(selectedDepartment);

      await loadDashboard();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleComplete(tokenId) {
    await completeService(tokenId);

    await loadQueue(selectedDepartment);

    await loadDashboard();
  }

  async function handleSkip(tokenId) {
    await skipStudent(tokenId);

    await loadQueue(selectedDepartment);

    await loadDashboard();
  }

  useQueueSocket(() => {
    loadDashboard();

    if (selectedDepartment) {
      loadQueue(selectedDepartment);
    }
  });

  useEffect(() => {
    loadDashboard();
    loadDepartments();
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-6 md:grid-cols-4">
        <AdminStatCard title="Waiting" value={stats.waiting} />

        <AdminStatCard title="Called" value={stats.called} />

        <AdminStatCard title="Completed" value={stats.completed} />

        <AdminStatCard title="Skipped" value={stats.skipped} />
      </div>

      <DepartmentSelector
        departments={departments}
        selectedDepartment={selectedDepartment}
        onChange={handleDepartmentChange}
      />

      <div className="mb-6">
        <button
          onClick={handleCallNext}
          disabled={!selectedDepartment}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Call Next Student
        </button>
      </div>

      <QueueTable
        queue={queue}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </DashboardLayout>
  );
}
