import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * 1. Input Primitive
 * Pure white background, subtle border, crisp focus state, and accessible label.
 */
export const Input = forwardRef(({
  label,
  error,
  helperText,
  id,
  className = '',
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-slate-700 font-medium text-sm"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        required={required}
        className={`w-full bg-white border ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
        } text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:ring-2 focus:outline-none transition-colors duration-150 shadow-xs ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});
Input.displayName = 'Input';

/**
 * 2. Textarea Primitive
 */
export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  id,
  rows = 3,
  className = '',
  required = false,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-slate-700 font-medium text-sm"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        className={`w-full bg-white border ${
          error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
        } text-slate-800 placeholder:text-slate-400 text-sm px-3.5 py-2.5 rounded-lg focus:ring-2 focus:outline-none transition-colors duration-150 shadow-xs resize-y ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});
Textarea.displayName = 'Textarea';

/**
 * 3. Select Primitive
 */
export const Select = forwardRef(({
  label,
  error,
  helperText,
  id,
  children,
  className = '',
  required = false,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-slate-700 font-medium text-sm"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={`w-full bg-white border ${
            error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-400 focus:ring-slate-100'
          } text-slate-800 text-sm px-3.5 py-2.5 rounded-lg focus:ring-2 focus:outline-none appearance-none transition-colors duration-150 shadow-xs pr-9 ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && (
        <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});
Select.displayName = 'Select';

/**
 * 4. Button Primitive
 * Variants: primary | secondary | destructive | ghost
 */
export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  icon: Icon,
  ...props
}, ref) => {
  const variantStyles = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 active:bg-black border border-transparent shadow-xs',
    secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-xs',
    destructive: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 active:bg-rose-200 shadow-xs',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
    md: 'px-4 py-2 text-sm rounded-lg gap-2',
    lg: 'px-5 py-2.5 text-base rounded-lg gap-2.5',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium select-none transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
});
Button.displayName = 'Button';

/**
 * 5. Card Primitive
 * Pure white canvas, micro 1px border, micro shadow.
 */
export const Card = ({
  children,
  className = '',
  padding = true,
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-xl shadow-xs ${
        padding ? 'p-6 sm:p-7' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 pb-4 border-b border-slate-100 ${className}`}>
    <div>
      {title && <h3 className="text-slate-900 font-semibold text-base tracking-tight">{title}</h3>}
      {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

/**
 * 6. Table Primitive
 * Clean white wrapper, subtle border lines, soft hover state hover:bg-slate-50/80
 */
export const Table = ({ children, className = '' }) => (
  <div className={`w-full bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden ${className}`}>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-700">
        {children}
      </table>
    </div>
  </div>
);

export const TableHead = ({ children }) => (
  <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider select-none">
    {children}
  </thead>
);

export const TableRow = ({ children, className = '', onClick }) => (
  <tr
    onClick={onClick}
    className={`border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 transition-colors ${
      onClick ? 'cursor-pointer' : ''
    } ${className}`}
  >
    {children}
  </tr>
);

export const TableHeader = ({ children, className = '' }) => (
  <th scope="col" className={`px-4 sm:px-6 py-3 font-semibold ${className}`}>
    {children}
  </th>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-4 sm:px-6 py-3.5 text-slate-700 ${className}`}>
    {children}
  </td>
);
