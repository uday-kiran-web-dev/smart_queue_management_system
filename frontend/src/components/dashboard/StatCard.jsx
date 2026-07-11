import { ArrowUpRight } from "lucide-react";

const colorStyles = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-emerald-600 bg-emerald-50",
  amber: "text-amber-600 bg-amber-50",
  rose: "text-rose-600 bg-rose-50",
  slate: "text-slate-600 bg-slate-50",
  indigo: "text-indigo-600 bg-indigo-50",
};

export default function StatCard({ title, value, icon: Icon, colorType = "slate" }) {
  const colorClass = colorStyles[colorType] || colorStyles.slate;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <h2 className="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight">{value}</h2>
        </div>
        
        {Icon ? (
          <div className={`rounded-xl p-3 ${colorClass} transition-colors duration-300`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
        ) : (
          <ArrowUpRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        )}
      </div>
    </div>
  );
}
