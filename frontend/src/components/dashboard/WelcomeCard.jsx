import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Sparkles } from "lucide-react";

export default function WelcomeCard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 text-white shadow-lg transition-transform duration-300 hover:scale-[1.01]">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome, {user?.name}
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-indigo-100 font-medium leading-relaxed">
            Manage your university administrative services digitally. Keep track of your queues, appointments, and history in one place.
          </p>
        </div>
        <div className="hidden sm:block rounded-full bg-white/10 p-4 backdrop-blur-sm">
          <Sparkles className="h-8 w-8 text-indigo-100" />
        </div>
      </div>
    </div>
  );
}
