export default function DepartmentCard({ department, onGenerate, loading }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold">{department.name}</h2>

      <p className="mt-2 text-gray-600">{department.description}</p>

      <button
        onClick={() => onGenerate(department._id)}
        disabled={loading}
        variant="primary"
        className="mt-4 w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Token"}
      </button>
    </div>
  );
}
