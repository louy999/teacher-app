/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import axios from "axios";
import { format } from "date-fns";
import LessonName from "../../../profile/[studentId]/lessonName";
import { useEffect, useState } from "react";

const ViewedLessonsDash = ({ roleDet }: any) => {
  const [allViewsFetch, setAllViewsFetch] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/views/student/${roleDet.id}`
        );
        console.log(res.data.data);
        setAllViewsFetch(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [roleDet.id]);
  return (
    <div className="w-full p-2 h-60 overflow-y-auto">
      <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Viewed Lessons
      </h2>
      <div className="px-4 py-3">
        <div className="flex overflow-hidden rounded-xl border border-[#dde1e3] bg-white">
          <table className="flex-1">
            <thead>
              <tr className="bg-white">
                <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                  Lesson Title
                </th>
                <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                  Progress
                </th>
                <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                  Date Viewed
                </th>
              </tr>
            </thead>
            <tbody>
              {allViewsFetch.map((view: any, index: number) => {
                const date = new Date(view.date);

                const formattedDate = isNaN(date.getTime())
                  ? "Invalid Date"
                  : format(date, "MMM dd, yyyy HH:mm");

                return (
                  <tr className="border-t border-t-[#dde1e3]" key={index}>
                    <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
                      <LessonName lessonId={view.lesson_id} />
                    </td>
                    <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                      {Number(view.progress)}%
                    </td>
                    <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                      {formattedDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewedLessonsDash;
