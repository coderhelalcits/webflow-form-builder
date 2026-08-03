import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/Dashboard/StatsCard';
import SubmissionTable from '../components/Submissions/SubmissionTable';
import SubmissionView from '../components/Submissions/SubmissionView';
import Button from '../components/UI/Button';
import api from '../services/api';
import { FileText, Inbox, PlusCircle, Globe, Activity } from 'lucide-react';

const Dashboard = ({ user, onOpenConnectModal }) => {
  const [stats, setStats] = useState({ totalForms: 0, totalSubmissions: 0, recentSubmissions: [] });
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/submissions/stats');
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 p-8 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Welcome back, {user?.name || 'Developer'}! 👋</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your Webflow custom forms and track live submissions.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/forms/create')} className="shadow-lg shadow-indigo-600/20">
            <PlusCircle className="w-4 h-4 mr-2" /> Build New Form
          </Button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Forms"
          value={stats.totalForms}
          icon={FileText}
          trend="+12%"
          color="indigo"
        />
        <StatsCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={Inbox}
          trend="+24%"
          color="emerald"
        />
        <StatsCard
          title="Webflow Status"
          value={user?.webflowSiteId ? 'Connected' : 'Unlinked'}
          icon={Globe}
          color={user?.webflowSiteId ? 'purple' : 'amber'}
        />
      </div>

      {/* Webflow Quick Connect Callout if not linked */}
      {!user?.webflowSiteId && (
        <div className="p-6 rounded-2xl bg-indigo-900/20 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Connect Webflow Site</h3>
              <p className="text-xs text-slate-400 mt-0.5">Link your Webflow project ID to seamlessly sync form schemas.</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onOpenConnectModal}>
            Connect Now
          </Button>
        </div>
      )}

      {/* Recent Activity Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-100">Recent Submissions</h2>
          </div>
          <button
            onClick={() => navigate('/submissions')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            View All Submissions →
          </button>
        </div>

        <SubmissionTable
          submissions={stats.recentSubmissions}
          onViewSubmission={(sub) => setSelectedSubmission(sub)}
        />
      </div>

      {/* Submission Detail Modal */}
      <SubmissionView
        submission={selectedSubmission}
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
};

export default Dashboard;
