/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { format, parseISO } from "date-fns";
const LessonsSubscribe = ({ dataSubLessons }) => {
  return (
    <>
      <h3 className="text-[#111518] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
        Lessons Subscriptions
      </h3>
      <div className="px-4 py-3 @container">
        <div className="flex overflow-hidden rounded-xl border border-[#dbe1e6] bg-white">
          <table className="flex-1">
            <thead>
              <tr className="bg-white">
                <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-120 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                  Student Name
                </th>
                <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-240 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                  Lesson Name
                </th>
                <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-360 px-4 py-3 text-left text-[#111518] w-[400px] text-sm font-medium leading-normal">
                  price
                </th>
                <th className="table-560aaddd-f3c5-48f5-9f1b-d2656e304ddc-column-480 px-4 py-3 text-left text-[#111518] w-60  text-sm font-medium leading-normal">
                  expire Date
                </th>
              </tr>
            </thead>
            <tbody>
              {dataSubLessons.map((lessonSub: any, index: any) => {
                const expireDate = parseISO(lessonSub.expire);
                const formattedExpire = isNaN(expireDate.getTime())
                  ? "Invalid Date"
                  : format(expireDate, "MMM dd, yyyy");

                return (
                  <tr className="border-t border-t-[#dbe1e6]" key={index}>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#111518] text-sm font-normal leading-normal">
                      {lessonSub.student.full_name}
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
                      {lessonSub.lesson.title}
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
                      {lessonSub.price} L.E
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#60768a] text-sm font-normal leading-normal">
                      {formattedExpire}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default LessonsSubscribe;
