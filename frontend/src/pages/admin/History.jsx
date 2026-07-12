import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { getQueueHistory } from "../../services/adminService";

const HISTORY_TABS = [
  { key: "all", title: "All" },
  { key: "waiting", title: "Waiting" },
  { key: "skipped", title: "Skipped" },
  { key: "called", title: "Called" },
  { key: "completed", title: "Completed" },
];

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export default function History() {
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  async function loadHistory() {
    try {
      const data = await getQueueHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setHistory([]);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHistory();
  }, []);

  const filteredHistory =
    activeTab === "all"
      ? history
      : history.filter((item) => item.status === activeTab);

  function countByStatus(status) {
    if (status === "all") return history.length;
    return history.filter((item) => item.status === status).length;
  }

  return (
    <DashboardLayout title="Queue History">
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {HISTORY_TABS.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.title}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {countByStatus(tab.key)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4 text-left">Token</th>
                <th className="p-4 text-left">Department</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created</th>
                <th className="p-4 text-left">Completed</th>
              </tr>
            </thead>

            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item._id} className="border-b last:border-b-0">
                    <td className="p-4 font-medium">{item.token_number}</td>
                    <td className="p-4">{item.department_name || "-"}</td>
                    <td className="p-4 capitalize">{item.status}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {formatDate(item.completed_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
