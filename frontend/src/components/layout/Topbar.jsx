import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ title = "Dashboard" }) {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{user?.name}</p>

          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
