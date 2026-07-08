import { ArrowUpRight } from "lucide-react";

export default function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
      <div className="flex justify-between">
        <p className="text-gray-500">{title}</p>

        <ArrowUpRight size={20} />
      </div>

      <h2 className="mt-4 text-4xl font-bold">{value}</h2>
    </div>
  );
}
