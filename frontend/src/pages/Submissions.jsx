import React, { useEffect, useState } from 'react';
import SubmissionTable from '../components/Submissions/SubmissionTable';
import SubmissionView from '../components/Submissions/SubmissionView';
import api from '../services/api';
import { Inbox, Filter, RefreshCw } from 'lucide-react';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [forms, setForms] = useState([]);
  const [selectedFormFilter, setSelectedFormFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeSubmission, setActiveSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
    fetchForms();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/submissions');
      if (res.submissions) {
        setSubmissions(res.submissions);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const res = await api.get('/forms');
      if (res.forms) {
        setForms(res.forms);
      }
    } catch (err) {}
  };

  const filteredSubmissions = selectedFormFilter === 'all'
    ? submissions
    : submissions.filter((s) => s.formId === selectedFormFilter);

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Form Submissions</h1>
          <p className="text-sm text-slate-400 mt-1">View and export responses collected from your Webflow sites.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedFormFilter}
              onChange={(e) => setSelectedFormFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Forms ({submissions.length})</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900">{f.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchSubmissions}
            title="Refresh"
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Submissions Table Component */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-semibold">Loading submissions...</div>
      ) : (
        <SubmissionTable
          submissions={filteredSubmissions}
          onViewSubmission={(sub) => setActiveSubmission(sub)}
        />
      )}

      {/* Detail Modal */}
      <SubmissionView
        submission={activeSubmission}
        isOpen={!!activeSubmission}
        onClose={() => setActiveSubmission(null)}
      />
    </div>
  );
};

export default Submissions;
