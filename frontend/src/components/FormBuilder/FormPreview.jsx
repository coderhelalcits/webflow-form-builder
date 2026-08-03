import React from 'react';
import { Eye, Smartphone, Monitor } from 'lucide-react';

const FormPreview = ({ formTitle, fields, settings, selectedFieldId, onSelectField }) => {
  return (
    <div className="flex-1 bg-slate-950 p-8 flex flex-col items-center justify-start overflow-y-auto min-h-full">
      {/* Canvas Top Toolbar */}
      <div className="w-full max-w-xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Webflow Preview Canvas</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-medium">
          <Monitor className="w-3.5 h-3.5 text-indigo-400" /> Desktop Embed
        </div>
      </div>

      {/* Styled Embed Preview Card */}
      <div className="w-full max-w-xl bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 transition-all duration-300">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{formTitle || 'Untitled Form'}</h2>
          <p className="text-xs text-slate-500 mt-1">Embedded Webflow Form Component</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {fields.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-slate-300 rounded-xl text-center">
              <p className="text-sm font-semibold text-slate-500">Form canvas is empty</p>
              <p className="text-xs text-slate-400 mt-1">Add fields from the left palette to build your form.</p>
            </div>
          ) : (
            fields.map((field) => {
              const isSelected = selectedFieldId === field.id;
              return (
                <div
                  key={field.id}
                  onClick={() => onSelectField(field.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-transparent hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                    {field.label || 'Unlabeled Field'}
                    {field.required && <span className="text-rose-500 ml-1">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      disabled
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 cursor-pointer"
                    />
                  ) : field.type === 'dropdown' ? (
                    <select
                      disabled
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 cursor-pointer"
                    >
                      <option>{field.placeholder || '-- Select Option --'}</option>
                      {(field.options || []).map((opt, i) => (
                        <option key={i}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <div className="space-y-2 mt-2">
                      {(field.options && field.options.length > 0 ? field.options : [field.placeholder || field.label]).map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                          <input type="checkbox" disabled className="w-4 h-4 text-indigo-600 rounded" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'radio' ? (
                    <div className="space-y-2 mt-2">
                      {(field.options || ['Option 1', 'Option 2']).map((opt, i) => (
                        <label key={i} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                          <input type="radio" disabled className="w-4 h-4 text-indigo-600" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={field.type === 'phone' ? 'tel' : field.type}
                      disabled
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 cursor-pointer"
                    />
                  )}
                </div>
              );
            })
          )}

          {fields.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                className="w-full py-3 px-4 bg-indigo-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-indigo-600/30 cursor-pointer hover:bg-indigo-700 transition"
              >
                {settings.submitButtonText || 'Submit'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormPreview;
