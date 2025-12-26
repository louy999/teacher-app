/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios from "axios";
import { format } from "date-fns";
import LessonName from "./lessonName";
import Image from "next/image";
import Link from "next/link"; 
import imageIconTeacher from "../../images/graduate-hat.png";
import rocket from "../../images/rocket.png";

const ViewedLessons = async ({ roleDet }: any) => {
  try {
    const allViewsFetch = await axios.get(
      `${process.env.local}/views/student/${roleDet.id}`
    );

    const lessons = allViewsFetch.data.data;

    return (
      <div className="w-full  px-4 py-6">
        <h2 className="text-[#121416] text-lg flex items-center gap-2 font-bold mb-5">
          <Image src={imageIconTeacher} alt="icon" className="w-6 h-6" />
          <span>Your Learning Journey</span>
          <Image src={rocket} alt="rocket" className="w-5 h-5" />
        </h2>

        <div className="flex flex-col gap-4">
          {lessons.map((view: any, index: number) => {
            const date = new Date(view.date);
            const formattedDate = isNaN(date.getTime())
              ? "N/A"
              : format(date, "d MMM");

            return (
              <div
                key={index}
                className="flex items-center justify-between p-5 bg-white border border-[#dde1e3] rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="text-[#121416] font-bold text-lg leading-tight">
                    <LessonName lessonId={view.lesson_id} />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[#637587] text-sm font-medium min-w-fit">Progress:</span>
                    <div className="w-32 md:w-48 h-2.5 bg-slate-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#07835b] rounded-full transition-all duration-500" 
                        style={{ width: `${view.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-[#637587] text-sm font-normal">
                    Last viewed: {formattedDate}
                  </div>
                </div>

                <div className="ml-4 shrink-0">
                  {view.progress >= 95 ? (
                    <span className="bg-green-50 text-[#07835b] border border-green-200 text-xs font-bold px-4 py-2 rounded-full">
                      Completed
                    </span>
                  ) : (
                    <Link href={`/lesson/${view.lesson_id}`}>
                      <button className="bg-[#249b63] cursor-pointer hover:bg-[#1e8354] text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm">
                        Continue
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return (
      <div className="p-6 text-red-500 bg-red-50 rounded-xl border border-red-100">
        Failed to load your learning journey.
      </div>
    );
  }
};

export default ViewedLessons;