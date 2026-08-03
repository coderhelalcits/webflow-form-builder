import React from 'react';
import { LogOut, User, Globe } from 'lucide-react';
import { getWebflowSiteName } from '../../utils/helpers';

const Navbar = ({ user, onLogout, onConnectWebflow }) => {
  const siteName = getWebflowSiteName(user?.webflowSiteId);

  return (
    <header className="h-16 border-b border-slate-800 glass-nav px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          SaaS Dashboard v1.0
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Connect Webflow Action */}
        <button
          onClick={onConnectWebflow}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition max-w-xs truncate"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span className="truncate">{user?.webflowSiteId ? siteName : 'Connect Webflow'}</span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-200 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 leading-tight">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Log out"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
