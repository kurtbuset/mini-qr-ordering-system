import { useState, useMemo } from "react";

interface UsePaginationProps<T> {
  data: T[];
  initialItemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  currentData: T[];
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

export function usePagination<T>({
  data,
  initialItemsPerPage = 10,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Calculate current data slice
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Reset to page 1 when items per page changes
  const setItemsPerPage = (items: number) => {
    setItemsPerPageState(items);
    setCurrentPage(1);
  };

  // Ensure current page is valid when data changes
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    currentData,
    setCurrentPage,
    setItemsPerPage,
    goToFirstPage,
    goToLastPage,
  };
}
