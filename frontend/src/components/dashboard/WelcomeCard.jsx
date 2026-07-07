import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function WelcomeCard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="rounded-xl bg-blue-600 p-8 text-white">
      <h2 className="text-3xl font-bold">Welcome, {user?.name}</h2>

      <p className="mt-2">
        Manage your university administrative services digitally.
      </p>
    </div>
  );
}
