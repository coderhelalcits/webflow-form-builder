import React from 'react';
import Modal from '../UI/Modal';
import { formatDate } from '../../utils/helpers';
import { Calendar, FileText, CheckCircle2 } from 'lucide-react';

const SubmissionView = ({ submission, isOpen, onClose }) => {
  if (!submission) return null;

  const dataObj = submission.data || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submission Details" maxWidth="max-w-lg">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Form Name</span>
            <p className="text-sm font-bold text-slate-100">{submission.formName || 'Webflow Form'}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</span>
            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(submission.createdAt)}
            </p>
          </div>
        </div>

        {/* Dynamic Key Value Fields */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Submitted Form Data</h4>
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-4">
            {Object.keys(dataObj).length === 0 ? (
              <p className="text-xs text-slate-500 italic">No data entries recorded.</p>
            ) : (
              Object.entries(dataObj).map(([key, val]) => (
                <div key={key} className="border-b border-slate-900 pb-3 last:border-0 last:pb-0">
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">{key}</span>
                  <p className="text-sm text-slate-100 font-medium whitespace-pre-wrap">{val || <span className="text-slate-600 italic">Empty</span>}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SubmissionView;
