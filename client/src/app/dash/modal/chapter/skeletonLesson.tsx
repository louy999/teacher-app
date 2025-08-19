import React from "react";

const SkeletonLesson = () => {
  return (
    <div className="w-full rounded-md bg-white/40 shadow-2xl">
      <div className="animate-pulse flex flex-col items-center justify-center p-4 ">
        <div className="h-90 w-3/4 bg-gray-200 rounded-md mb-2 "></div>
        <div className="h-8 w-3/4 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-16 w-3/4 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-80 w-3/4 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-80 w-3/4 bg-gray-200 rounded-md mb-2"></div>
      </div>
    </div>
  );
};

export default SkeletonLesson;
