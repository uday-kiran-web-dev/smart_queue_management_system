export default function Button({ children, loading = false, type = "submit" }) {
  return (
    <button
      type={type}
      disabled={loading}
      className="
                w-full
                rounded-lg
                bg-blue-600
                p-3
                text-white
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
            "
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
