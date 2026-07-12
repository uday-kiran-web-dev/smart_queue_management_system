import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ title = "Dashboard", setSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 md:px-6 py-4">
      <div className="flex items-center gap-4">
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1 -ml-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        )}
        <h1 className="text-lg md:text-xl font-bold truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right">
          <p className="font-semibold truncate max-w-[200px]">{user?.name}</p>
          <p className="text-sm text-gray-500 truncate max-w-[200px]">{user?.email}</p>
        </div>

        <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
