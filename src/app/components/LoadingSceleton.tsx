import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 animate-fade-in">
      {/* Navbar Skeleton */}
      <div className="w-full h-16 bg-gray-200 animate-pulse"></div>

      <div className="flex flex-1">
        {/* Sidebar Skeleton (hidden on small screens) */}
        <div className="hidden md:block w-64 h-full bg-gray-200 animate-pulse"></div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
