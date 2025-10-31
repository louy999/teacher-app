import React from "react";
import SubAndViewLesson from "./subAndViewLesson";

interface AllLessonsProps {
  allData: allData;
}

const AllLessons: React.FC<AllLessonsProps> = async ({ allData }) => {
  return (
    <div className="flex gap-4 overflow-x-auto p-4 bg-[#F9FAFB] rounded-lg overflow-y-hidden">
      {allData
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((lesson) => (
          <SubAndViewLesson key={lesson.id} lesson={lesson} />
        ))}
    </div>
  );
};

export default AllLessons;
