import React from 'react';
import Input from '../UI/Input';
import { Sliders, Mail, CheckCircle, FileText } from 'lucide-react';

const FormSettings = ({ name, settings, onUpdateName, onUpdateSettings }) => {
  return (
    <div className="bg-slate-900 border-l border-slate-800 p-6 w-80 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
        <Sliders className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-slate-100">Form Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Form Name */}
        <div>
          <Input
            label="Form Name"
            value={name}
            onChange={(e) => onUpdateName(e.target.value)}
            placeholder="e.g. Lead Capture Form"
          />
        </div>

        {/* Submit Button Text */}
        <div>
          <Input
            label="Submit Button Text"
            value={settings.submitButtonText || ''}
            onChange={(e) => onUpdateSettings({ submitButtonText: e.target.value })}
            placeholder="e.g. Submit Request"
          />
        </div>

        {/* Success Message */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Success Message
          </label>
          <textarea
            rows={3}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            value={settings.successMessage || ''}
            onChange={(e) => onUpdateSettings({ successMessage: e.target.value })}
            placeholder="Message shown after submission"
          />
        </div>

        {/* Admin Notification Email */}
        <div>
          <Input
            label="Notification Email"
            type="email"
            value={settings.notificationEmail || ''}
            onChange={(e) => onUpdateSettings({ notificationEmail: e.target.value })}
            placeholder="admin@company.com"
            helperText="Resend API sends submission alerts to this email."
          />
        </div>
      </div>
    </div>
  );
};

export default FormSettings;
