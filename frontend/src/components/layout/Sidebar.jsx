import { useContext } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  Building2,
  ClipboardList,
  History,
  LayoutDashboard,
  Ticket,
  User,
  LogOut,
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const isStudent = user?.role === "student";

  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Queue System</h2>

      <nav className="space-y-4">
        <NavLink
          to={isStudent ? "/student/dashboard" : "/admin/dashboard"}
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

        {isStudent && (
          <>
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
          </>
        )}

        {!isStudent && (
          <>
            <NavLink
              to="/admin/tokens"
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg p-3 transition",
                  isActive ? "bg-blue-600 text-white" : "hover:bg-slate-700",
                )
              }
            >
              <ClipboardList size={20} />
              Tokens
            </NavLink>

            <NavLink
              to="/admin/departments"
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg p-3 transition",
                  isActive ? "bg-blue-600 text-white" : "hover:bg-slate-700",
                )
              }
            >
              <Building2 size={20} />
              Departments
            </NavLink>

            <NavLink
              to="/admin/history"
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg p-3 transition",
                  isActive ? "bg-blue-600 text-white" : "hover:bg-slate-700",
                )
              }
            >
              <History size={20} />
              History
            </NavLink>
          </>
        )}

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

      <div className="mt-auto pt-6 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 rounded-lg p-3 w-full hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
