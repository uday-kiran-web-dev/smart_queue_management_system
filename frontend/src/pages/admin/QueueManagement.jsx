import { useCallback, useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import DepartmentSelector from "../../components/admin/DepartmentSelector";
import QueueTable from "../../components/admin/QueueTable";

import { getDepartments } from "../../services/dashboardService";
import {
  getWaitingQueue,
  skipStudent,
  getQueueHistory,
  cancelStudent,
  callStudent,
  completeService,
} from "../../services/adminService";
import useQueueSocket from "../../hooks/useQueueSocket";

const STATUS_TABS = [
  { key: "waiting", title: "Waiting" },
  { key: "skipped", title: "Skipped" },
  { key: "called", title: "Called" },
  { key: "completed", title: "Completed" },
  { key: "cancelled", title: "Cancelled" },
  { key: "all", title: "All" },
];

export default function QueueManagement() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [queue, setQueue] = useState([]);
  const [activeTab, setActiveTab] = useState("waiting");

  const loadDepartments = useCallback(async () => {
    try {
      const response = await getDepartments();
      setDepartments(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadQueue = useCallback(async (departmentId) => {
    try {
      const response = await getWaitingQueue(departmentId);
      setQueue(response);
    } catch (error) {
      console.error(error);
      setQueue([]);
    }
  }, []);

  const loadAllTokens = useCallback(async () => {
    try {
      const response = await getQueueHistory();
      setQueue(response);
    } catch (error) {
      console.error(error);
      setQueue([]);
    }
  }, []);

  function handleDepartmentChange(departmentId) {
    setSelectedDepartment(departmentId);
    // If no department is selected, load all tokens (including all statuses)
    if (!departmentId) {
      loadAllTokens();
    } else {
      loadQueue(departmentId);
    }
  }

  async function handleCall(tokenId) {
    await callStudent(tokenId);
    await (selectedDepartment
      ? loadQueue(selectedDepartment)
      : loadAllTokens());
  }

  async function handleComplete(tokenId, feedback) {
    await completeService(tokenId, feedback);
    await (selectedDepartment
      ? loadQueue(selectedDepartment)
      : loadAllTokens());
  }

  async function handleSkip(tokenId, feedback) {
    await skipStudent(tokenId, feedback);
    await (selectedDepartment
      ? loadQueue(selectedDepartment)
      : loadAllTokens());
  }

  async function handleCancel(tokenId, feedback) {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      await cancelStudent(tokenId, feedback);
      await (selectedDepartment
        ? loadQueue(selectedDepartment)
        : loadAllTokens());
    }
  }

  const handleQueueMessage = useCallback(() => {
    if (selectedDepartment) {
      loadQueue(selectedDepartment);
    } else {
      loadAllTokens();
    }
  }, [loadQueue, selectedDepartment]);

  useQueueSocket(handleQueueMessage);

  // Load departments and initial token list (all tokens)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDepartments();
    // Load all tokens initially
    loadQueue();
  }, [loadDepartments, loadQueue]);

  const filteredQueue =
    activeTab === "all"
      ? queue
      : queue.filter((token) => token.status === activeTab);

  function countByStatus(status) {
    if (status === "all") return queue.length;
    return queue.filter((token) => token.status === status).length;
  }

  return (
    <DashboardLayout title="Queue Management">
      <DepartmentSelector
        departments={departments}
        selectedDepartment={selectedDepartment}
        onChange={handleDepartmentChange}
      />



      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 shadow hover:bg-gray-100"
              }`}
            >
              {tab.title}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {countByStatus(tab.key)}
              </span>
            </button>
          );
        })}
      </div>

      <QueueTable
        queue={filteredQueue}
        onComplete={handleComplete}
        onSkip={handleSkip}
        onCancel={handleCancel}
        onCall={handleCall}
      />
    </DashboardLayout>
  );
}
