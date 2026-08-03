import React from 'react';
import { Type, Mail, Phone, AlignLeft, ChevronDown, CheckSquare, Disc, Plus } from 'lucide-react';
import { FIELD_TYPES } from '../../utils/helpers';

const iconMap = {
  Type,
  Mail,
  Phone,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  Disc
};

const FieldList = ({ onAddField }) => {
  return (
    <div className="bg-slate-900 border-r border-slate-800 p-5 w-72 flex flex-col h-full overflow-y-auto">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Add Form Fields</h3>
      <div className="space-y-2.5">
        {FIELD_TYPES.map((field) => {
          const Icon = iconMap[field.icon] || Type;
          return (
            <button
              key={field.type}
              onClick={() => onAddField(field.type)}
              className="w-full p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 rounded-xl text-left flex items-center justify-between group transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white">{field.label}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">{field.description}</p>
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FieldList;
