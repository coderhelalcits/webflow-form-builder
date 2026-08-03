import React from 'react';
import { Trash2, ArrowUp, ArrowDown, Settings, Check } from 'lucide-react';
import Input from '../UI/Input';
import Button from '../UI/Button';

const FieldEditor = ({ field, onUpdateField, onDeleteField, onMoveField, fieldIndex, totalFields }) => {
  if (!field) {
    return (
      <div className="bg-slate-900 border-l border-slate-800 p-6 w-80 h-full flex flex-col items-center justify-center text-center">
        <Settings className="w-10 h-10 text-slate-700 mb-3" />
        <p className="text-sm font-semibold text-slate-400">No field selected</p>
        <p className="text-xs text-slate-500 mt-1">Click any field in the live preview canvas to customize its settings.</p>
      </div>
    );
  }

  const handleOptionsChange = (e) => {
    const rawVal = e.target.value;
    const opts = rawVal.split(',').map((s) => s.trim());
    onUpdateField(field.id, { options: opts });
  };

  const optionsString = Array.isArray(field.options) ? field.options.join(', ') : (field.options || '');

  return (
    <div className="bg-slate-900 border-l border-slate-800 p-6 w-80 flex flex-col h-full overflow-y-auto">
      {/* Field Editor Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {field.type} Field
          </span>
          <h3 className="text-base font-bold text-slate-100 mt-1">Field Properties</h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onMoveField(fieldIndex, fieldIndex - 1)}
            disabled={fieldIndex === 0}
            title="Move Up"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMoveField(fieldIndex, fieldIndex + 1)}
            disabled={fieldIndex === totalFields - 1}
            title="Move Down"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteField(field.id)}
            title="Delete Field"
            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Field Controls */}
      <div className="space-y-5 flex-1">
        {/* Label */}
        <Input
          label="Field Label"
          value={field.label || ''}
          onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
        />

        {/* Placeholder (for text, email, phone, textarea, dropdown) */}
        {['text', 'email', 'phone', 'textarea', 'dropdown'].includes(field.type) && (
          <Input
            label="Placeholder Text"
            value={field.placeholder || ''}
            onChange={(e) => onUpdateField(field.id, { placeholder: e.target.value })}
          />
        )}

        {/* Options List (for dropdown, checkbox, radio) */}
        {['dropdown', 'checkbox', 'radio'].includes(field.type) && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Options (Comma Separated)
            </label>
            <textarea
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              value={optionsString}
              onChange={handleOptionsChange}
              placeholder="Option 1, Option 2, Option 3"
            />
            <p className="text-[11px] text-slate-500 mt-1">Separate options with commas.</p>
          </div>
        )}

        {/* Required Toggle */}
        <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-200">Required Field</p>
            <p className="text-xs text-slate-400">User must fill this before submitting</p>
          </div>
          <button
            type="button"
            onClick={() => onUpdateField(field.id, { required: !field.required })}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              field.required ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                field.required ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;
