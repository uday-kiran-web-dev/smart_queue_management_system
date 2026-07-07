import DashboardLayout from "../../components/layout/DashboardLayout";

import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatCard from "../../components/dashboard/StatCard";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <WelcomeCard />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <StatCard title="Current Token" value="--" />

        <StatCard title="Queue Position" value="--" />

        <StatCard title="Waiting Time" value="--" />
      </div>
    </DashboardLayout>
  );
}
