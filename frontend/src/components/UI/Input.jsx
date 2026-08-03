import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  className = '',
  id,
  required = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 bg-slate-900 border ${
          error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
        } rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition duration-150 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export default Input;
