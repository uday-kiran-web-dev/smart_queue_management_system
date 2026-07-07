export default function Button({ children, type = "submit", loading = false }) {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
