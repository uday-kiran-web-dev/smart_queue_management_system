import { Link } from "react-router-dom";
import clsx from "clsx";
import { LayoutDashboard, Ticket, User, LogOut } from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Queue System</h2>

      <nav className="space-y-4">
        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-lg p-3 transition",
              isActive ? "bg-blue-600 text-white" : "hover:bg-slate-700",
            )
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/student/generate-token"
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-lg p-3 transition",
              isActive ? "bg-blue-600 text-white" : "hover:bg-slate-700",
            )
          }
        >
          <Ticket size={20} />
          Generate Token
        </NavLink>

        <NavLink
          to="/student/my-queue"
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-lg p-3 transition",
              isActive ? "bg-blue-600 text-white" : "hover:bg-slate-700",
            )
          }
        >
          <Ticket size={20} />
          My Queue
        </NavLink>

        <NavLink
          to="/student/profile"
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 rounded-lg p-3 transition",
              isActive ? "bg-blue-600 text-white" : "hover:bg-slate-700",
            )
          }
        >
          <User size={20} />
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}
