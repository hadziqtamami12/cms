import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Search, Trash2,
  CheckCircle2, XCircle, ArrowUpDown, ChevronLeft, ChevronRight,
  Filter, Check, X, CheckSquare, MinusSquare, Square
} from 'lucide-react';

/**
 * Modern Enterprise DataTable Component
 * Features:
 * 1. Automatic Dynamic Row Numbering (No.) based on current page
 * 2. Multi-column ASC / DESC Sorting with visual arrow indicators
 * 3. Master Checkbox with Indeterminate state & Row-level Checkboxes
 * 4. Floating Sticky Bulk Action Bar (Bulk Delete & Bulk Status Update)
 * 5. Built-in Client Search & Pagination controls
 */
export const DataTable = ({
  columns = [], // Array of { key, label, sortable?: boolean, render?: (val, row, index) => ReactNode, className?: string }
  data = [],
  rowKey = 'id',
  pageSizeOptions = [5, 10, 25, 50],
  defaultPageSize = 10,
  emptyMessage = 'Belum ada data tersedia.',
  searchPlaceholder = 'Cari data...',
  // Bulk action handlers
  onBulkDelete,
  onBulkStatusUpdate,
  bulkStatusOptions = [
    { label: 'Set Aktif / Terbit', value: 'active', color: 'emerald' },
    { label: 'Set Nonaktif / Draf', value: 'inactive', color: 'amber' }
  ],
  // External sorting handler (optional)
  onSortChange,
  // Custom toolbar additions
  extraToolbar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // { key, direction: 'asc' | 'desc' }
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isBulkStatusOpen, setIsBulkStatusOpen] = useState(false);
  const masterCheckboxRef = useRef(null);

  // 1. Client-side Search Filtering
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase().trim();

    return data.filter((row) => {
      return columns.some((col) => {
        const val = row[col.key];
        if (val === null || val === undefined) return false;
        if (typeof val === 'object') {
          return JSON.stringify(val).toLowerCase().includes(query);
        }
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, columns]);

  // 2. Client-side Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Handle nulls
      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';

      // Number comparison (strip currency/formatting like 'Rp 500.000' or '50%')
      if (typeof valA === 'string' && typeof valB === 'string') {
        const numA = Number(valA.replace(/[^\d.-]/g, ''));
        const numB = Number(valB.replace(/[^\d.-]/g, ''));
        if (!isNaN(numA) && !isNaN(numB) && valA.match(/\d/) && valB.match(/\d/)) {
          return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
        }
      }

      // Date comparison
      const dateA = Date.parse(valA);
      const dateB = Date.parse(valB);
      if (!isNaN(dateA) && !isNaN(dateB) && typeof valA === 'string' && valA.includes('-')) {
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // String comparison
      const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortConfig]);

  // 3. Pagination Slicing
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset to page 1 if totalPages changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // 4. Master Checkbox Selection & Indeterminate state
  const currentPageIds = useMemo(() => {
    return paginatedData.map(row => row[rowKey] || row.id);
  }, [paginatedData, rowKey]);

  const isAllCurrentPageSelected = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every(id => selectedRowIds.includes(id));
  }, [currentPageIds, selectedRowIds]);

  const isSomeSelected = useMemo(() => {
    return currentPageIds.some(id => selectedRowIds.includes(id)) && !isAllCurrentPageSelected;
  }, [currentPageIds, selectedRowIds, isAllCurrentPageSelected]);

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleMasterCheckboxChange = () => {
    if (isAllCurrentPageSelected) {
      // Deselect all on current page
      setSelectedRowIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      // Select all on current page
      setSelectedRowIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleRowCheckboxChange = (id) => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // 5. Column Sorting Toggle
  const handleSort = (columnKey, isSortable) => {
    if (!isSortable) return;

    let nextDirection = 'asc';
    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === 'asc') nextDirection = 'desc';
      else if (sortConfig.direction === 'desc') nextDirection = null;
    }

    const nextConfig = { key: nextDirection ? columnKey : null, direction: nextDirection };
    setSortConfig(nextConfig);

    if (onSortChange) {
      onSortChange(nextConfig.key, nextConfig.direction);
    }
  };

  // Bulk Actions
  const handleTriggerBulkDelete = () => {
    if (selectedRowIds.length === 0) return;
    if (window.confirm(`Yakin ingin menghapus ${selectedRowIds.length} data terpilih secara serentak? Tindakan ini tidak dapat dibatalkan.`)) {
      if (onBulkDelete) {
        onBulkDelete(selectedRowIds);
      }
      setSelectedRowIds([]);
    }
  };

  const handleTriggerBulkStatus = (statusValue) => {
    if (selectedRowIds.length === 0) return;
    if (onBulkStatusUpdate) {
      onBulkStatusUpdate(selectedRowIds, statusValue);
    }
    setIsBulkStatusOpen(false);
    setSelectedRowIds([]);
  };

  return (
    <div className="w-full space-y-3.5 relative">
      {/* Table Toolbar (Search, Page Size, Extra Actions) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end">
          {extraToolbar}

          {/* Page Size Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Tampil:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span>baris</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle relative min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
                {/* 1. Master Checkbox */}
                <th scope="col" className="w-10 px-3.5 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <input
                      ref={masterCheckboxRef}
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      onChange={handleMasterCheckboxChange}
                      aria-label="Pilih semua data di halaman ini"
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                </th>

                {/* 2. Column "No." (Dynamic numbering) */}
                <th scope="col" className="w-12 px-3 py-3 text-center font-bold text-slate-500">
                  No.
                </th>

                {/* 3. Dynamic User Columns */}
                {columns.map((col) => {
                  const isSorted = sortConfig.key === col.key;
                  const isSortable = col.sortable !== false;

                  return (
                    <th
                      key={col.key}
                      scope="col"
                      onClick={() => handleSort(col.key, isSortable)}
                      className={`py-3 px-4 transition-colors ${
                        isSortable ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-900' : ''
                      } ${isSorted ? 'bg-blue-50/70 text-blue-700' : ''} ${col.className || ''}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.label}</span>
                        {isSortable && (
                          <span className="shrink-0 text-slate-400">
                            {isSorted ? (
                              sortConfig.direction === 'asc' ? (
                                <ChevronUp className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-3 h-3 text-slate-300 hover:text-slate-500" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="py-12 text-center text-slate-400">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-600 text-sm">{emptyMessage}</p>
                      {searchQuery && (
                        <p className="text-xs text-slate-400">
                          Tidak ditemukan data dengan kata kunci "{searchQuery}"
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => {
                  const id = row[rowKey] || row.id || `row-${idx}`;
                  const isSelected = selectedRowIds.includes(id);
                  // Dynamic sequential number accounting for current page:
                  const rowNumber = (currentPage - 1) * pageSize + idx + 1;

                  return (
                    <tr
                      key={id}
                      className={`transition-colors ${
                        isSelected ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Row Checkbox */}
                      <td className="px-3.5 py-3.5 text-center">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleRowCheckboxChange(id)}
                            aria-label={`Pilih baris ${rowNumber}`}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                      </td>

                      {/* Row Number (No.) */}
                      <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-500 text-xs">
                        {rowNumber}
                      </td>

                      {/* Column Cells */}
                      {columns.map((col) => (
                        <td key={col.key} className={`py-3.5 px-4 text-slate-800 ${col.className || ''}`}>
                          {col.render
                            ? col.render(row[col.key], row, rowNumber)
                            : (row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '-')}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Summary & Pagination Navigation */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            <span>
              Menampilkan{' '}
              <strong className="font-bold text-slate-900">
                {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>
              {' - '}
              <strong className="font-bold text-slate-900">
                {Math.min(currentPage * pageSize, totalItems)}
              </strong>{' '}
              dari <strong className="font-bold text-slate-900">{totalItems}</strong> data
            </span>
            {searchQuery && (
              <span className="text-slate-400 ml-1.5">(difilter dari {data.length} total)</span>
            )}
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white font-bold cursor-pointer transition-colors"
              title="Halaman Pertama"
            >
              «
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white font-bold cursor-pointer transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page number pill */}
            <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white font-bold cursor-pointer transition-colors flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white font-bold cursor-pointer transition-colors"
              title="Halaman Terakhir"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* Floating / Sticky Bulk Action Bar */}
      {selectedRowIds.length > 0 && (
        <aside
          aria-label="Bar Aksi Massal Data Terpilih"
          className="fixed bottom-6 inset-x-4 max-w-xl mx-auto z-40 animate-bounce-in select-none"
        >
          <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 text-white shadow-2xl p-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3">
            {/* Selected Count Indicator */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                {selectedRowIds.length}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-100">
                item dipilih
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Bulk Status Update Dropdown */}
              {onBulkStatusUpdate && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsBulkStatusOpen(prev => !prev)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-600 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Ubah Status</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isBulkStatusOpen && (
                    <div className="absolute bottom-full mb-2 right-0 w-48 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in">
                      {bulkStatusOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleTriggerBulkStatus(opt.value)}
                          className="w-full text-left px-3.5 py-2 hover:bg-slate-100 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                        >
                          <span className={`w-2 h-2 rounded-full ${opt.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bulk Delete Button */}
              {onBulkDelete && (
                <button
                  type="button"
                  onClick={handleTriggerBulkDelete}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Terpilih</span>
                </button>
              )}

              {/* Deselect / Cancel */}
              <button
                type="button"
                onClick={() => setSelectedRowIds([])}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Batalkan pilihan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default DataTable;
