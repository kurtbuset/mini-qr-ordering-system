import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  colorClass = "bg-brand-500",
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`flex items-center font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? (
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${colorClass} bg-opacity-10`}
        >
          <div className={`text-2xl ${colorClass.replace("bg-", "text-")}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};
