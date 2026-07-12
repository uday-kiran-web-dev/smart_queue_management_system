import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Building2,
  ClipboardList,
  History,
  LayoutDashboard,
  Ticket,
  User,
  LogOut,
  Clock,
  X,
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useContext(AuthContext);
  const isStudent = user?.role === "student";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside 
      className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-screen transition-transform duration-300 ease-in-out md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-6 pb-2">
        <h2 className="text-2xl font-bold">Queue System</h2>
        <button 
          onClick={() => setOpen(false)}
          className="md:hidden text-slate-400 hover:text-white p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="space-y-4 flex-1 p-6 overflow-y-auto">
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
              Get Spot in Line
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
              <Clock size={20} />
              Status Tracker
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
              Queue Management
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
              Offices / Help Desks
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

      <div className="mt-auto p-6 border-t border-slate-700 bg-slate-900">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg p-3 w-full hover:bg-red-600 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
