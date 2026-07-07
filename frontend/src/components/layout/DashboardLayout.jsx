import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children, title = "Dashboard" }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar title={title} />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
