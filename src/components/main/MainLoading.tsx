import React from 'react';
import CardSkeleton from '../CardSkeleton'; // Adjust the import path as needed

interface LoadingProps {
  numCards: number;
}

const Loading: React.FC<LoadingProps> = ({ numCards }) => {
  return (
    <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: numCards }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

export default Loading;
