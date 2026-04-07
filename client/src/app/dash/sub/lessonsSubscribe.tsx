/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { User, Book, CreditCard, Calendar } from "lucide-react";

const LessonsSubscribe = ({ dataSubLessons }: { dataSubLessons: any[] }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <h3 className="text-gray-800 text-lg font-black flex items-center gap-2">
          <Book className="text-blue-500" size={20} />
          Lessons Subscriptions
        </h3>
        <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
          {dataSubLessons.length} Total
        </span>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 uppercase text-[10px] font-black tracking-widest bg-white">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Lesson</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Expire Date</th>
            </tr>
          </thead>
          <tbody>
            {dataSubLessons.map((lessonSub: any, index: number) => {
              const expireDate = parseISO(lessonSub.expire);
              const formattedExpire = isNaN(expireDate.getTime())
                ? "Invalid Date"
                : format(expireDate, "MMM dd, yyyy");

              return (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index} 
                  className="group hover:bg-blue-50/30 transition-colors border-t border-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                        <User size={14} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{lessonSub.student.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500 italic">
                    {lessonSub.lesson.title}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-sm">
                      <CreditCard size={14} />
                      {lessonSub.price} <span className="text-[10px]">L.E</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {formattedExpire}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LessonsSubscribe;