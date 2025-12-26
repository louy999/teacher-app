import React from "react";
import Link from "next/link";
import Image from "next/image";
import {  FaLock } from "react-icons/fa";
import { format } from "date-fns";

interface Lesson {
  id: string;
  title: string;
  date: string;
  image_url: string;
  is_active: boolean;
  is_paid: boolean;
  is_new?: boolean;
  price?: number;
  views?: { lesson_id: string; progress: number };
}

interface SubAndViewLessonProps {
  lesson: Lesson;
  studentId: string;
}

const SubAndViewLesson: React.FC<SubAndViewLessonProps> = ({ lesson }) => {
  const isViewed = lesson.views?.lesson_id === lesson.id;
  const progressPercent = Number(lesson.views?.progress || 0).toFixed(0);

  return (
    <div className="w-80 flex-shrink-0">
      <Link
        href={lesson.is_active ? `/lesson/${lesson.id}` : "#"}
        className={`relative flex flex-col h-96 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.03] border ${
          lesson.is_active ? "border-gray-200" : "border-gray-300"
        }`}
      >
        {/* Thumbnail */}
        <div className="relative h-2/3 w-full">
          <Image
            src={`${process.env.img}/image/${lesson.image_url}`}
            alt={lesson.title}
            fill
            style={{ objectFit: "cover" }}
            className={`rounded-t-2xl ${
              !lesson.is_active ? "opacity-50 grayscale" : ""
            }`}
            sizes="(max-width: 768px) 100vw, 240px"
          />

          {/* Locked overlay */}
          {!lesson.is_active && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <FaLock className="text-white text-3xl" />
            </div>
          )}

          {/* New badge */}
          {lesson.is_new && lesson.is_active && (
            <span className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 text-xs font-bold rounded">
              NEW
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {isViewed && (
          <div className="h-2 bg-green-500 transition-all" style={{ width: `${progressPercent}%` }}></div>
        )}

        {/* Content */}
        <div className="flex flex-col justify-between h-1/3 p-3 bg-white">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 truncate">{lesson.title}</h3>
            <p className="text-sm text-gray-500">{format(new Date(lesson.date), "d MMM yyyy")}</p>
          </div>

          {/* Action Section */}
          <div>
            {lesson.is_active ? (
              isViewed ? (
                <button className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-lg font-semibold mt-2">
                  Continue
                </button>
              ) : lesson.is_paid ? (
                <button className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg font-semibold mt-2 flex items-center justify-center">
                  Unlock for {lesson.price} EGP
                </button>
              ) : (
                <button className="w-full cursor-pointer bg-indigo-500 text-white py-2 rounded-lg font-semibold mt-2">
                  Start Lesson
                </button>
              )
            ) : (
              <button className="w-full cursor-pointer bg-gray-500 text-white py-2 rounded-lg font-semibold mt-2">
                Renew Subscription
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SubAndViewLesson;
