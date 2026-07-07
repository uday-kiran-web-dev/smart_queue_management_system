import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 className="text-xl font-bold">Student Dashboard</h1>

      <div>
        <p className="font-semibold">{user?.name}</p>

        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
    </header>
  );
}
