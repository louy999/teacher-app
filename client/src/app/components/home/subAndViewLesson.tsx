import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPoundSign } from "react-icons/fa";
import { format } from "date-fns";

interface Lesson {
  id: string;
  title: string;
  date: string;
  image_url: string;
  is_active: boolean;
  is_paid: boolean;
  price?: number;
}

interface SubAndViewLessonProps {
  lesson: Lesson;
  studentId: string;
}

const SubAndViewLesson: React.FC<SubAndViewLessonProps> = ({ lesson }) => {
  const isViewed = lesson.views?.lesson_id === lesson.id;
  const progressPercent = Number(lesson.views?.progress || 0).toFixed(0);

  return (
    <Link
      href={`/lesson/${lesson.id}`}
      className={`bg-white rounded-md shadow-sm border border-gray-200 cursor-pointer w-60 h-80 flex-shrink-0 transition-transform hover:scale-[1.02] ${
        lesson.is_active ? "block" : "hidden"
      } ${isViewed ? "opacity-60" : ""}`}
    >
      <div className="w-full h-2/3 relative overflow-hidden rounded-t-md">
        <Image
          src={`${process.env.img}/image/${lesson.image_url}`}
          alt={lesson.title}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-t-md"
          sizes="(max-width: 768px) 100vw, 240px"
        />
      </div>

      {isViewed && (
        <div
          className="bg-teal-500 h-[4px] transition-all"
          style={{ width: `${progressPercent}%` }}
        ></div>
      )}

      <div className="px-3 py-2 h-1/3 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-800 truncate">
            {lesson.title}
          </h3>
          <p className="text-sm text-gray-500">
            {format(new Date(lesson.date), "d MMM yyyy")}
          </p>
        </div>

        {lesson.is_paid && !isViewed && (
          <div className="flex items-center text-red-600 font-bold text-sm mt-1">
            Price: {lesson.price} <FaPoundSign className="ml-1" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default SubAndViewLesson;
