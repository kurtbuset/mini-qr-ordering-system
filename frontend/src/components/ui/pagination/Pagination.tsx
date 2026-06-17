interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 25, 50, 100],
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No items to display
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-3 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
      {/* Items per page selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <label
            htmlFor="itemsPerPage"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            Show
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-dark text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            per page
          </span>
        </div>
      )}

      {/* Showing x to y of z items */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-dark dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="hidden gap-1 sm:flex">
          {getPageNumbers().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page as number)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-brand-500 text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-dark dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-dark dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}
