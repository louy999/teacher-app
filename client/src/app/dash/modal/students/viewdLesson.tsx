/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { format } from "date-fns";
import LessonName from "../../../profile/[studentId]/lessonName";
import { motion } from "framer-motion";
import { PlayCircle, Clock, Activity, History } from "lucide-react";

const ViewedLessonsDash = ({ roleDet }: any) => {



  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2">
          <History className="text-blue-600" size={22} />
          <h2 className="text-lg font-bold text-gray-800">Watching Activity</h2>
        </div>
        <div className="text-xs font-semibold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
          Total: {roleDet.allLessonsInView.length} Lessons
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold z-10">
              <tr>
                <th className="px-6 py-4 flex items-center gap-2">
                   <PlayCircle size={14} /> Lesson Title
                </th>
                <th className="px-6 py-4">
                   <div className="flex items-center gap-2"><Activity size={14} /> Progress</div>
                </th>
                <th className="px-6 py-4">
                   <div className="flex items-center gap-2"><Clock size={14} /> Last View</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {roleDet.allLessonsInView.map((view: any, index: number) => {
                const date = new Date(view.date);
                const progressNum = Number(view.progress);
                const formattedDate = isNaN(date.getTime())
                  ? "N/A"
                  : format(date, "MMM dd, yyyy • HH:mm");

                return (
                  <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-5 font-medium text-gray-800">
                      <LessonName lessonId={view.lesson_id} />
                    </td>
                    
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5 w-40">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500">
                          <span>{progressNum}%</span>
                          <span>Completed</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressNum}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: index * 0.05 }}
                            className={`h-full rounded-full ${getProgressColor(progressNum)} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-gray-500 tabular-nums">
                      {formattedDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {roleDet.allLessonsInView.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-2 opacity-30">
            <PlayCircle size={48} />
            <p className="font-medium">No activity recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewedLessonsDash;