import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Queue System</h2>

      <nav className="space-y-4">
        <Link to="/student/dashboard" className="block hover:text-blue-400">
          Dashboard
        </Link>

        <Link
          to="/student/generate-token"
          className="block hover:text-blue-400"
        >
          Generate Token
        </Link>

        <Link to="/student/my-queue" className="block hover:text-blue-400">
          My Queue
        </Link>

        <Link to="/student/profile" className="block hover:text-blue-400">
          Profile
        </Link>
      </nav>
    </aside>
  );
}
