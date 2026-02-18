import { Fragment } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '@/utils';
import type { DataTableProps, TableSortState } from '@/types';

/**
 * Reusable DataTable component with TypeScript generics
 * Supports sorting, custom renders, loading states, and empty states
 * 
 * @example
 * const columns: DataTableColumn<User>[] = [
 *   { key: 'name', header: 'Name', sortable: true },
 *   { key: 'email', header: 'Email' },
 *   { key: 'actions', header: 'Actions', render: (user) => <ActionsMenu user={user} /> }
 * ];
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data found',
  className,
  onSort,
}: DataTableProps<T>) {
  const handleSort = (key: string): void => {
    if (!onSort) return;
    
    // Simple sort direction toggle logic
    // In real app, you might want to track current sort state
    onSort(key, 'asc');
  };

  if (loading) {
    return (
      <div className={cn(
        'w-full rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}>
        <div className="flex items-center justify-center p-12">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            <span className="text-sm font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn(
        'w-full rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}>
        <div className="flex flex-col items-center justify-center p-12 text-gray-500">
          <div className="mb-2 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">No data available</p>
          <p className="text-xs text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm',
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={`header-${String(column.key)}-${index}`}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors',
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUpIcon className="h-3 w-3 text-gray-400" />
                        <ChevronDownIcon className="h-3 w-3 text-gray-400 -mt-1" />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
              <tr 
                key={`row-${rowIndex}`}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="px-4 py-3 whitespace-nowrap text-sm"
                  >
                    {column.render ? (
                      column.render(item, rowIndex)
                    ) : (
                      <span className="text-gray-900">
                        {String(item[column.key] ?? '')}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer - Optional pagination area */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{data.length}</span> results
          </div>
          {/* Add pagination controls here if needed */}
        </div>
      </div>
    </div>
  );
}