import { useState, useMemo } from 'react';
import { debounce } from '@/utils';

interface UseDataTableProps<T> {
  data: T[];
  searchFields?: (keyof T)[];
  initialSortKey?: keyof T;
  initialSortOrder?: 'asc' | 'desc';
}

interface SortConfig<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}

/**
 * Custom hook for data table functionality
 * Handles search, sort, pagination with TypeScript safety
 */
export function useDataTable<T extends Record<string, any>>({
  data,
  searchFields = [],
  initialSortKey,
  initialSortOrder = 'asc',
}: UseDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: initialSortKey || null,
    direction: initialSortOrder,
  });

  // Debounced search to avoid excessive filtering
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim() || searchFields.length === 0) return data;

    const lowercaseSearch = searchTerm.toLowerCase();
    
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowercaseSearch);
      })
    );
  }, [data, searchTerm, searchFields]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle different data types with proper type checking
      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (Object.prototype.toString.call(aValue) === '[object Date]' && 
                 Object.prototype.toString.call(bValue) === '[object Date]') {
        comparison = (aValue as Date).getTime() - (bValue as Date).getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortConfig]);

  // Handle sort
  const handleSort = (key: keyof T): void => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  // Reset all filters
  const resetFilters = (): void => {
    setSearchTerm('');
    setSortConfig({
      key: initialSortKey || null,
      direction: initialSortOrder,
    });
  };

  return {
    // Data
    data: sortedData,
    
    // Search
    searchTerm,
    setSearch: debouncedSearch,
    
    // Sort
    sortConfig,
    handleSort,
    
    // Utilities
    resetFilters,
    isEmpty: sortedData.length === 0,
    total: data.length,
    filtered: sortedData.length,
  };
}