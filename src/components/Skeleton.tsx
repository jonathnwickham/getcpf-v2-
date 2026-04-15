const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-100 animate-pulse rounded-lg ${className}`} />
);

export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="space-y-0">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 px-4 py-3.5 border-b border-gray-100">
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} className={`h-4 ${j === 0 ? "w-32" : j === 1 ? "w-48" : "w-20"}`} />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
