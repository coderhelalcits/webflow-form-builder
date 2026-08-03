import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'indigo' }) => {
  const colors = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20'
  };

  return (
    <div className="glass-card bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex items-center justify-between shadow-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-100">{value}</h3>
        {trend && (
          <p className="text-xs font-medium text-emerald-400 mt-2 flex items-center gap-1">
            <span>↑ {trend}</span> <span className="text-slate-500">vs last month</span>
          </p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} border flex items-center justify-center`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default StatsCard;
