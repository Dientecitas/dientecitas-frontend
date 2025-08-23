import React from 'react';

const TableLoader = ({ 
  rows = 5, 
  columns = 4, 
  showHeader = true,
  className = '' 
}) => {
  const shimmerClass = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          {/* Header skeleton */}
          {showHeader && (
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <th key={colIndex} className="px-6 py-4">
                    <div className={`h-4 rounded ${shimmerClass}`} />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          
          {/* Body skeleton */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div 
                      className={`h-4 rounded ${shimmerClass}`}
                      style={{
                        width: `${60 + Math.random() * 40}%`,
                        animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s`
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableLoader;