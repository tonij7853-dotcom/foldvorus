import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-xl bg-[#11131a] border border-white/5 overflow-hidden animate-pulse"
        >
          <div className="aspect-video w-full bg-[#181b26]" />
          <div className="p-4 flex flex-col gap-3">
            <div className="h-3 w-1/3 bg-[#1e2230] rounded" />
            <div className="h-4 w-3/4 bg-[#23283a] rounded" />
            <div className="h-3 w-1/2 bg-[#1e2230] rounded" />
            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-2">
              <div className="h-7 w-8 bg-[#181b26] rounded" />
              <div className="h-7 flex-1 bg-[#23283a] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
