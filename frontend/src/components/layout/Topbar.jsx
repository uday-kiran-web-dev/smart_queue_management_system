import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ title = "Dashboard", setSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="relative flex items-center gap-4" ref={dropdownRef}>
        <div className="hidden md:block text-right cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <p className="font-semibold truncate max-w-[200px] hover:text-blue-600 transition-colors">{user?.name}</p>
          <p className="text-sm text-gray-500 truncate max-w-[200px]">{user?.email}</p>
        </div>

        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        >
          {user?.name?.charAt(0).toUpperCase()}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-slate-100 md:hidden bg-slate-50/50">
              <p className="font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            
            <Link 
              to="/student/profile" 
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <User size={16} /> Profile
            </Link>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
