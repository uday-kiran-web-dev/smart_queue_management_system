import { useEffect, useState, useContext } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

import toast from "react-hot-toast";
import { getMyToken, cancelToken } from "../../services/dashboardService";

const STATUS_SECTIONS = [
  {
    key: "waiting",
    title: "Waiting",
    emptyText: "No waiting tokens.",
    accentClass: "border-blue-500 bg-blue-50 text-blue-700",
  },
  {
    key: "skipped",
    title: "Skipped",
    emptyText: "No skipped tokens.",
    accentClass: "border-yellow-500 bg-yellow-50 text-yellow-700",
  },
  {
    key: "called",
    title: "Called",
    emptyText: "No called tokens.",
    accentClass: "border-green-500 bg-green-50 text-green-700",
  },
  {
    key: "completed",
    title: "Completed",
    emptyText: "No completed spots.",
    accentClass: "border-gray-500 bg-gray-50 text-gray-700",
  },
  {
    key: "cancelled",
    title: "Cancelled",
    emptyText: "No cancelled spots.",
    accentClass: "border-red-500 bg-red-50 text-red-700",
  },
];

function formatStatus(status = "") {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function TokenCard({ token, accentClass, onCancel }) {
  // Extract the color for the top bar (e.g. border-blue-500 -> bg-blue-500)
  const topBarColor = accentClass.split(' ')[0].replace('border-', 'bg-');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Top accent color bar */}
      <div className={`h-2 w-full ${topBarColor}`}></div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Spot in Line</p>
            <p className="text-3xl font-black text-slate-800">{token.token_number}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${accentClass}`}>
            {formatStatus(token.status)}
          </span>
        </div>

        <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Office</span>
            <span className="text-sm font-semibold text-slate-800">{token.department_name}</span>
          </div>

          {token.purpose && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Reason</span>
              <span className="text-sm font-medium text-slate-700 text-right max-w-[60%] truncate" title={token.purpose}>
                {token.purpose}
              </span>
            </div>
          )}

          {token.scheduled_at && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Scheduled Time</span>
              <span className="text-sm font-medium text-slate-700">{new Date(token.scheduled_at).toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 mt-2">
            <span className="text-xs text-slate-400">Created</span>
            <span className="text-xs text-slate-400">{new Date(token.created_at).toLocaleString()}</span>
          </div>

          {token.status === "waiting" && onCancel && (
            <div className="pt-4 border-t border-slate-100 mt-2">
              <button 
                onClick={() => onCancel(token._id)}
                className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors border border-red-200"
              >
                Cancel Spot
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Displays the student's queue tokens
export default function MyQueue() {
  const { user } = useContext(AuthContext);
  const [tokens, setTokens] = useState([]);
  const [activeTab, setActiveTab] = useState("waiting");

  // Load tokens for the logged‑in student
  useEffect(() => {
    if (user?.role !== "student") return;
    async function loadTokens() {
      try {
        const data = await getMyToken();
        setTokens(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load tokens:", error);
        setTokens([]);
      }
    }
    loadTokens();
  }, [user?.role]);

  const tokensByStatus = STATUS_SECTIONS.reduce((groups, section) => {
    groups[section.key] = tokens.filter(
      (token) => token.status === section.key,
    );
    return groups;
  }, {});

  const handleCancel = async (tokenId) => {
    if (!window.confirm("Are you sure you want to cancel this spot in line?")) return;
    
    try {
      await cancelToken(tokenId);
      toast.success("Spot cancelled successfully");
      const data = await getMyToken();
      setTokens(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to cancel spot");
    }
  };

  const activeSection = STATUS_SECTIONS.find(
    (section) => section.key === activeTab,
  );
  const activeTokens = tokensByStatus[activeTab] || [];

  return (
    <DashboardLayout>
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold">My Queue Tracker</h1>

        {user?.role === "student" ? (
          tokens.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                {STATUS_SECTIONS.map((section) => {
                  const isActive = activeTab === section.key;

                  return (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setActiveTab(section.key)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {section.title}
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${isActive
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-600"
                          }`}
                      >
                        {tokensByStatus[section.key].length}
                      </span>
                    </button>
                  );
                })}
              </div>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {activeSection.title}
                  </h2>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                    {activeTokens.length}
                  </span>
                </div>

                {activeTokens.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeTokens.map((token) => (
                      <TokenCard
                        key={token._id}
                        token={token}
                        accentClass={activeSection.accentClass}
                        onCancel={handleCancel}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-gray-300 p-4 text-gray-500">
                    {activeSection.emptyText}
                  </p>
                )}
              </section>
            </div>
          ) : (
            <p className="text-gray-500">
              No active spots. Get a spot in line to get started.
            </p>
          )
        ) : (
          <p className="text-gray-500">This page is only for students.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
