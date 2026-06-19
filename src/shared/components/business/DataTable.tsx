import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  SortingState,
  RowSelectionState,
} from '@tanstack/react-table';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  // Pagination
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  // Sorting
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  // Selection
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  // Optional actions
  bulkActions?: React.ReactNode;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  pageIndex = 0,
  pageSize = 10,
  pageCount = 1,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortingChange,
  rowSelection = {},
  onRowSelectionChange,
  bulkActions,
}: DataTableProps<TData>) {
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    pageCount,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      if (onSortingChange) {
        const nextSorting = typeof updater === 'function' ? updater(sorting || []) : updater;
        onSortingChange(nextSorting);
      }
    },
    onRowSelectionChange: (updater) => {
      if (onRowSelectionChange) {
        const nextSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
        onRowSelectionChange(nextSelection);
      }
    },
  });

  const selectedRowsCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-sm bg-white border border-outline-variant rounded-sm p-md flipkart-shadow">
      {/* Table Action Bar */}
      {(selectedRowsCount > 0 || bulkActions) && (
        <div className="flex items-center justify-between bg-primary-fixed px-sm py-xs rounded-sm border border-outline-variant text-xs">
          <div className="flex items-center gap-md">
            {selectedRowsCount > 0 && (
              <span className="font-semibold text-primary">
                {selectedRowsCount} row(s) selected
              </span>
            )}
            {selectedRowsCount > 0 && bulkActions}
          </div>
        </div>
      )}

      {/* Actual Table */}
      <div className="overflow-x-auto border border-outline-variant rounded-sm custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-surface-container border-b border-outline-variant">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-sm font-label-caps text-outline font-bold select-none cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-xs">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      
                      {header.column.getCanSort() && (
                        <span className="material-symbols-outlined text-[14px]">
                          {header.column.getIsSorted() === 'asc'
                            ? 'arrow_upward'
                            : header.column.getIsSorted() === 'desc'
                            ? 'arrow_downward'
                            : 'unfold_more'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          <tbody className="divide-y divide-outline-variant">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index} className="animate-pulse bg-white">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="p-sm">
                      <div className="h-4 bg-surface-container rounded-sm w-full"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-lg text-outline font-semibold">
                  No records found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-surface-container-low transition-colors ${
                    row.getIsSelected() ? 'bg-primary-fixed/30' : 'bg-white'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-sm font-data-mono text-on-surface">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {onPageChange && (
        <div className="flex items-center justify-between text-xs pt-xs">
          <div className="flex items-center gap-md">
            <span className="text-outline">
              Page {pageIndex + 1} of {pageCount}
            </span>
            <select
              className="bg-white border border-outline-variant rounded-sm px-xs py-0.5"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-sm">
            <button
              disabled={pageIndex === 0 || isLoading}
              onClick={() => onPageChange(pageIndex - 1)}
              className="flex items-center justify-center p-1 border border-outline-variant rounded-sm hover:bg-surface-container-low active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button
              disabled={pageIndex + 1 >= pageCount || isLoading}
              onClick={() => onPageChange(pageIndex + 1)}
              className="flex items-center justify-center p-1 border border-outline-variant rounded-sm hover:bg-surface-container-low active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DataTable;
