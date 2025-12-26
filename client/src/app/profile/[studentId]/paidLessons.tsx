/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import React from "react";
import axios from "axios";
import { format } from "date-fns";
import LessonName from "./lessonName";
import Image from 'next/image';
import purchasedCoursesIcon from '../../images/book.png';
import webinarIcon from '../../images/webinar.png';

const PaidLessons = async ({ roleDet }: any) => {
  try {
    const allSubFetch = await axios.get(
      `${process.env.local}/subscribe/student/${roleDet.id}`
    );

    return (
      <div className="w-full  px-4">
        <h2 className="text-[#121416] flex items-center gap-2 text-base font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          <Image src={purchasedCoursesIcon} alt="Purchased Courses" width={20} height={20} />
<span>Purchased Courses</span>      
          <Image src={webinarIcon} alt="Purchased Courses" width={20} height={20} />
  </h2>
        <div className="px-4 py-3 @container">
          <div className="flex overflow-hidden rounded-xl border border-[#dde1e3] bg-white">
            {allSubFetch.data.data.map((sub: any, index: number) => {
              const dateExpire = new Date(sub.expire);
              // const date = new Date(sub.date);

              const formattedDateExpire = isNaN(dateExpire.getTime())
                ? "Invalid Date"
                : format(dateExpire, "MMM dd, yyyy ");
              // const formattedDateCreate = isNaN(date.getTime())
              //   ? "Invalid Date"
              //   : format(date, "MMM dd, yyyy ");

              return (
                <div
                  key={index}
                  className="flex  gap-2 border-b border-r last:border-0 p-4 justify-between items-center w-full"
                >
                  <div>
                    <div>
                      <LessonName lessonId={sub.lesson_id} />
                    </div>
                    <div className="text-sm text-[#6e7679]">
                      <span>Expired:</span>
                      <span>{formattedDateExpire}</span>
                    </div>
                  </div>
                  <div className="flex gap-5 items-start justify-start">
                    <div className="font-semibold text-slate-600">
                      {Number(sub.price)} EGP
                    </div>
                    <div className="">
                      {dateExpire > new Date() ? (
                        <span className="text-sm bg-green-400 rounded-lg p-2 text-slate-900  ">
                          Active
                        </span>
                      ) : (
                        <span className="text-sm text-red-500">Expired</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
