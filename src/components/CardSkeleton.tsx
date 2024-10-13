import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = () => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-dark-background">
      <Skeleton height={200} />
      <div className="mt-4">
        <Skeleton width={`60%`} />
      </div>
      <div className="mt-2">
        <Skeleton width={`80%`} />
      </div>
      <div className="mt-2">
        <Skeleton width={`40%`} />
      </div>
    </div>
  );
};

export default CardSkeleton;
