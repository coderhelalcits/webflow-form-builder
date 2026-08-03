import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import api from '../services/api';
import { useFormStore } from '../store/formStore';
import { generateEmbedCode, formatDate } from '../utils/helpers';
import { PlusCircle, Code, Edit3, Trash2, Calendar, FileText, Copy, Check } from 'lucide-react';

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmbedForm, setSelectedEmbedForm] = useState(null);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const setFormState = useFormStore((state) => state.setFormState);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/forms');
      if (res.forms) {
        setForms(res.forms);
      }
    } catch (err) {
      console.error('Failed to fetch forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (form) => {
    setFormState(form);
    navigate(`/forms/edit/${form.id}`);
  };

  const handleDelete = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form and its submissions?')) return;
    try {
      await api.delete(`/forms/${formId}`);
      setForms(forms.filter((f) => f.id !== formId));
    } catch (err) {
      alert('Failed to delete form.');
    }
  };

  const handleCopyEmbed = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Webflow Forms</h1>
          <p className="text-sm text-slate-400 mt-1">Manage all your active form schemas and get embed scripts.</p>
        </div>
        <Button onClick={() => navigate('/forms/create')}>
          <PlusCircle className="w-4 h-4 mr-2" /> Create New Form
        </Button>
      </div>

      {/* Forms Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-semibold">Loading forms...</div>
      ) : forms.length === 0 ? (
        <div className="glass-card bg-slate-900/60 p-12 rounded-2xl border border-slate-800 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-200">No forms created yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
            Get started by building your first custom form for your Webflow site.
          </p>
          <Button onClick={() => navigate('/forms/create')}>Create Form Now</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form.id} className="glass-card bg-slate-900/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {Array.isArray(form.fields) ? form.fields.length : 0} Fields
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(form.createdAt)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 mb-2 truncate">{form.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  Notification: {form.settings?.notificationEmail || 'Account email'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedEmbedForm(form)}
                  className="text-xs font-semibold"
                >
                  <Code className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> Embed Code
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(form)}
                    title="Edit Form"
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    title="Delete Form"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embed Code Modal */}
      {selectedEmbedForm && (
        <Modal
          isOpen={!!selectedEmbedForm}
          onClose={() => setSelectedEmbedForm(null)}
          title={`Embed Code for ${selectedEmbedForm.name}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Copy and paste this HTML/Script embed code into an <strong>Embed Component</strong> on your Webflow page.
            </p>

            <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed">
              <pre>{generateEmbedCode(selectedEmbedForm.id)}</pre>
              <button
                onClick={() => handleCopyEmbed(generateEmbedCode(selectedEmbedForm.id))}
                className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 flex items-center gap-1 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Snippet'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">How to install on Webflow:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Open your Webflow Designer project.</li>
                <li>Add an <strong>Embed Element</strong> to your page.</li>
                <li>Paste the code snippet above and click <strong>Save & Close</strong>.</li>
                <li>Publish your site to see your live custom form!</li>
              </ol>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Forms;
