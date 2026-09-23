import React from 'react';

/**
 * ResponsiveTableCard
 * Automatically renders a clean enterprise data table on desktop (>=768px),
 * and automatically adapts into stacked vertical cards on mobile (<768px)
 * completely eliminating horizontal scrollbars.
 */
export const ResponsiveTableCard = ({
  columns = [], // Array of { key, label, render? }
  data = [],
  emptyMessage = 'Belum ada data tersedia.',
  cardAction = null // Optional custom action button renderer for mobile card
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop View: Clean Standard High-Contrast Table (>=768px) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-subtle">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700 font-semibold">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="px-5 py-3.5 text-xs uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-slate-50/75 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 whitespace-nowrap text-slate-800">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View: Vertical Stacked Cards (<768px) - Absolutely Zero Horizontal Scroll */}
      <div className="md:hidden space-y-3">
        {data.map((row, idx) => (
          <div
            key={row.id || idx}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2.5 transition-all hover:border-slate-300"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-b-0 text-sm">
                <span className="font-medium text-slate-500 text-xs uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="font-semibold text-slate-800 text-right">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '-')}
                </span>
              </div>
            ))}
            {cardAction && (
              <div className="pt-2">
                {cardAction(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveTableCard;
