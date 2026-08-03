import React from 'react';
import { Eye, Calendar, Inbox, FileText } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const SubmissionTable = ({ submissions = [], onViewSubmission }) => {
  if (submissions.length === 0) {
    return (
      <div className="glass-card bg-slate-900/60 p-12 rounded-2xl border border-slate-800 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-200">No submissions yet</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Embed your form into your Webflow site to start collecting user submissions.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Form Name</th>
              <th className="px-6 py-4">Submission Summary</th>
              <th className="px-6 py-4">Submitted At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {submissions.map((sub) => {
              const dataKeys = Object.keys(sub.data || {});
              const firstVal = dataKeys.length > 0 ? `${dataKeys[0]}: ${sub.data[dataKeys[0]]}` : 'Empty submission';
              const secondVal = dataKeys.length > 1 ? ` | ${dataKeys[1]}: ${sub.data[dataKeys[1]]}` : '';

              return (
                <tr key={sub.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-semibold text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    {sub.formName || 'Webflow Form'}
                  </td>
                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                    {firstVal}{secondVal}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formatDate(sub.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewSubmission(sub)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold transition border border-indigo-500/20"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmissionTable;
