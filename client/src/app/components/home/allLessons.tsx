import React from "react";
import SubAndViewLesson from "./subAndViewLesson";

interface AllLessonsProps {
  allData: allData;
}

const AllLessons: React.FC<AllLessonsProps> = async ({ allData }) => {
  return (
    <div className="flex gap-4 overflow-x-auto p-4 bg-slate-100 rounded-lg overflow-y-hidden">
      {allData.map((lesson) => (
        <SubAndViewLesson key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
};

export default AllLessons;
