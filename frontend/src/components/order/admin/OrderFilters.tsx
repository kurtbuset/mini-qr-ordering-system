type OrderTypeFilter = "all" | "dine_in" | "takeout";

interface OrderFiltersProps {
  selectedFilter: OrderTypeFilter;
  onFilterChange: (filter: OrderTypeFilter) => void;
  counts: {
    all: number;
    dine_in: number;
    takeout: number;
  };
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  selectedFilter,
  onFilterChange,
  counts,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onFilterChange("all")}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
            selectedFilter === "all"
              ? "bg-brand-500 text-white shadow-lg"
              : "bg-white text-gray-700 shadow hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          All
          <span className="ml-2 text-xs opacity-75">({counts.all})</span>
        </button>
        <button
          onClick={() => onFilterChange("dine_in")}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
            selectedFilter === "dine_in"
              ? "bg-brand-500 text-white shadow-lg"
              : "bg-white text-gray-700 shadow hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Dine In
          <span className="ml-2 text-xs opacity-75">({counts.dine_in})</span>
        </button>
        <button
          onClick={() => onFilterChange("takeout")}
          className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
            selectedFilter === "takeout"
              ? "bg-brand-500 text-white shadow-lg"
              : "bg-white text-gray-700 shadow hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Takeout
          <span className="ml-2 text-xs opacity-75">({counts.takeout})</span>
        </button>
      </div>
    </div>
  );
};
