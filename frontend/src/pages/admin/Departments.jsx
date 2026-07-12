import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { getDepartments } from "../../services/dashboardService";
import { createDepartment } from "../../services/adminService";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadDepartments() {
    try {
      const response = await getDepartments();
      setDepartments(response);
    } catch (loadError) {
      console.error(loadError);
      setError("Failed to load departments.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Department name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createDepartment({
        name: trimmedName,
        description: trimmedDescription || null,
      });
      setName("");
      setDescription("");
      await loadDepartments();
    } catch (submitError) {
      console.error(submitError);
      setError(
        submitError.response?.data?.detail || "Failed to create department.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDepartments();
  }, []);

  return (
    <DashboardLayout title="Departments">
      <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white p-6 shadow"
        >
          <h2 className="mb-5 text-2xl font-bold">Add Department</h2>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <label className="mb-2 block text-sm font-medium">
            Department Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            placeholder="International Office"
          />

          <label className="mb-2 block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mb-5 min-h-28 w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            placeholder="Optional"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Department"}
          </button>
        </form>

        <section className="rounded-xl bg-white p-6 shadow">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Departments</h2>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              {departments.length}
            </span>
          </div>

          {departments.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Description</th>
                  </tr>
                </thead>

                <tbody>
                  {departments.map((department) => (
                    <tr key={department._id} className="border-b last:border-b-0">
                      <td className="p-4 font-medium">{department.name}</td>
                      <td className="p-4 text-gray-600">
                        {department.description || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-gray-300 p-4 text-gray-500">
              No departments found.
            </p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
