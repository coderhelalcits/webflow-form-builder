import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Inbox, PlusCircle, ExternalLink, Zap } from 'lucide-react';

const Sidebar = ({ connectedSiteId }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Forms', path: '/forms', icon: FileText },
    { name: 'Submissions', path: '/submissions', icon: Inbox },
    { name: 'Create Form', path: '/forms/create', icon: PlusCircle }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">FlowForm</h1>
          <p className="text-xs text-indigo-400 font-medium">Webflow Form Builder</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Webflow Site Status Footer */}
      <div className="p-4 m-4 rounded-xl glass-card bg-slate-800/40 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Webflow Status</span>
          <span className={`w-2 h-2 rounded-full ${connectedSiteId ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        </div>
        <p className="text-xs text-slate-300 font-medium truncate">
          {connectedSiteId ? `Connected: ${connectedSiteId}` : 'No Webflow site linked'}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
