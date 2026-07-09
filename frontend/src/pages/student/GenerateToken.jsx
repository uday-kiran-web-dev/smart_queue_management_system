import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./GenerateToken.css";

import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  generateToken,
  getDepartments,
  getMyToken,
} from "../../services/dashboardService";
import { AuthContext } from "../../context/AuthContext";

/* -------------------------------------------------
  GenerateToken component – form for students to generate a queue token
  ------------------------------------------------- */
export default function GenerateToken() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  // Optional scheduled datetime for the appointment (Date object)
  const [scheduledAt, setScheduledAt] = useState(null);
  // Store the student's existing tokens to enforce generation rules
  const [myTokens, setMyTokens] = useState([]);
  const { user } = useContext(AuthContext);

  const handleLoadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      toast.error("Failed to load departments");
    }
  };

  // Load the student's current tokens once the component mounts
  useEffect(() => {
    async function loadMyTokens() {
      try {
        const data = await getMyToken();
        setMyTokens(Array.isArray(data) ? data : []);
      } catch (error) {
        // Silently ignore; token generation will still work but may allow duplicates
        console.error("Failed to load existing tokens:", error);
      }
    }
    loadMyTokens();
  }, []);

  // Redirect if not a student (after all hooks have been called)
  if (user?.role !== "student") {
    return (
      <DashboardLayout>
        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="mb-6 text-3xl font-bold">Generate Queue Token</h1>
          <p className="text-gray-500">This page is only for students.</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }

    setLoading(true);
    // Prevent generating another waiting token for the same department
    const hasWaitingToken = myTokens.some(
      (t) => t.department_id === selectedDepartment && t.status === "waiting",
    );
    if (hasWaitingToken) {
      toast.error(
        "You already have a waiting token for this department. Please wait until it is called, skipped, or completed.",
      );
      setLoading(false);
      return;
    }

    // If a scheduled time is provided, ensure it is in the future
    if (scheduledAt) {
      const now = new Date();
      if (scheduledAt <= now) {
        toast.error(
          "Please select a future date and time for the appointment.",
        );
        setLoading(false);
        return;
      }
      const day = scheduledAt.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6
      const hour = scheduledAt.getHours();

      // Check if it's a weekend
      if (day === 0 || day === 6) {
        toast.error("Appointments can only be scheduled on weekdays.");
        setLoading(false);
        return;
      }
      // Check if the time is between 9 AM and 4 PM (16:00)
      // The upper bound is exclusive, so 16 means up to 3:59 PM.
      if (hour < 9 || hour >= 16) {
        toast.error("Appointments must be scheduled between 9 AM and 4 PM.");
        setLoading(false);
        return;
      }
    }

    try {
      const data = await generateToken(
        selectedDepartment,
        purpose,
        scheduledAt ? scheduledAt.toISOString() : null,
      );
      setToken(data.token);
      toast.success("Token generated successfully!");
      // Refresh token list after successful generation
      const refreshed = await getMyToken();
      setMyTokens(Array.isArray(refreshed) ? refreshed : []);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to generate token");
    } finally {
      setLoading(false);
    }
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };
  return (
    <DashboardLayout>
      <div className="max-w-2xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-3xl font-bold">Generate Queue Token</h1>

        {!token ? (
          <form onSubmit={handleGenerateToken} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                onClick={handleLoadDepartments}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a department...</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose/Query (Optional)
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Fee submission, Certificate request, Counseling"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* New date‑time picker for appointment scheduling */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date & Time (Optional)
              </label>
              <div className="w-full">
                <DatePicker
                  selected={scheduledAt}
                  onChange={(date) => setScheduledAt(date)}
                  showTimeSelect
                  filterDate={isWeekday}
                  minDate={new Date()}
                  minTime={new Date(new Date().setHours(9, 0, 0, 0))}
                  maxTime={new Date(new Date().setHours(15, 59, 0, 0))}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select a date and time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Generating..." : "Generate Token"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-2">Your Token Number:</p>
              <p className="text-3xl font-bold text-green-700 text-center">
                {token.token_number}
              </p>
            </div>

            <button
              onClick={() => setToken(null)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Generate Another Token
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
