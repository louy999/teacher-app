/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import React from "react";
import axios from "axios";
import { format } from "date-fns";
import LessonName from "./lessonName";

const PaidLessons = async ({ roleDet }: any) => {
  try {
    const allSubFetch = await axios.get(
      `${process.env.local}/subscribe/student/${roleDet.id}`
    );

    return (
      <div className="w-8/12 px-4">
        <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          Paid Lessons
        </h2>
        <div className="px-4 py-3 @container">
          <div className="flex overflow-hidden rounded-xl border border-[#dde1e3] bg-white">
            <table className="flex-1">
              <thead>
                <tr className="bg-white">
                  <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Lesson Title
                  </th>
                  <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Price
                  </th>
                  <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Creation Date
                  </th>
                  <th className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                    Expire Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {allSubFetch.data.data.map((sub: any, index: number) => {
                  const dateExpire = new Date(sub.expire);
                  const date = new Date(sub.date);

                  const formattedDateExpire = isNaN(dateExpire.getTime())
                    ? "Invalid Date"
                    : format(dateExpire, "MMM dd, yyyy ");
                  const formattedDateCreate = isNaN(date.getTime())
                    ? "Invalid Date"
                    : format(date, "MMM dd, yyyy ");

                  return (
                    <tr className="border-t border-t-[#dde1e3]" key={index}>
                      <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
                        <LessonName lessonId={sub.lesson_id} />
                      </td>
                      <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                        {Number(sub.price)}L.E
                      </td>
                      <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                        {formattedDateCreate}
                      </td>
                      <td className="table-d88966aa-49a9-4186-883c-49d0ed6895d9-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                        {formattedDateExpire}
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
  } catch (error) {
    console.log(error);

    return <div>Error view</div>;
  }
};

export default PaidLessons;
