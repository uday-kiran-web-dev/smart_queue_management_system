import { useEffect, useState, useContext } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

import { getMyToken } from "../../services/dashboardService";

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
    emptyText: "No completed tokens.",
    accentClass: "border-gray-500 bg-gray-50 text-gray-700",
  },
];

function formatStatus(status = "") {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function TokenCard({ token, accentClass }) {
  return (
    <div className={`border-l-4 p-4 ${accentClass}`}>
      <p className="mb-2">
        <strong>Token:</strong>{" "}
        <span className="text-lg font-semibold">{token.token_number}</span>
      </p>
      <p className="mb-2">
        <strong>Department:</strong> {token.department_name}
      </p>
      <p className="mb-2">
        <strong>Status:</strong> {formatStatus(token.status)}
      </p>
      {token.purpose && (
        <p className="mb-2">
          <strong>Purpose:</strong> {token.purpose}
        </p>
      )}
      {token.scheduled_at && (
        <p className="mb-2">
          <strong>Scheduled Time:</strong>{" "}
          {new Date(token.scheduled_at).toLocaleString()}
        </p>
      )}
      <p className="text-sm text-gray-500">
        <strong>Created:</strong> {new Date(token.created_at).toLocaleString()}
      </p>
    </div>
  );
}

/* -------------------------------------------------
  MyQueue component – displays the student's queue tokens
  ------------------------------------------------- */
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

  const activeSection = STATUS_SECTIONS.find(
    (section) => section.key === activeTab,
  );
  const activeTokens = tokensByStatus[activeTab] || [];

  return (
    <DashboardLayout>
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold">My Queue</h1>

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
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {section.title}
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          isActive
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
                  <div className="space-y-4">
                    {activeTokens.map((token) => (
                      <TokenCard
                        key={token._id}
                        token={token}
                        accentClass={activeSection.accentClass}
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
              No tokens found. Generate a token to get started.
            </p>
          )
        ) : (
          <p className="text-gray-500">This page is only for students.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
