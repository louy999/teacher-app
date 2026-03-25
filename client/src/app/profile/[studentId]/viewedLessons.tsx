"use client";
import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import LessonName from "./lessonName";
import Link from "next/link"; 
import { PlayCircle, CheckCircle2, Rocket, Clock } from "lucide-react";

const ViewedLessons = ({ roleDet, lessons }: any) => {
  // Assuming lessons are passed as props or fetched in a parent Server Component
  // If fetching here, keep it as a Server Component but without motion (or wrap children)
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Rocket size={20} />
          </div>
          Learning Journey
        </h2>
      </div>

      <div className="space-y-4">
        {lessons?.map((view: any, index: number) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className="group flex items-center justify-between p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-indigo-100 rounded-[2rem] transition-all hover:shadow-lg hover:shadow-indigo-500/5"
          >
            <div className="flex-1 space-y-3">
              <h3 className="font-bold text-slate-900 text-lg">
                <LessonName lessonId={view.lesson_id} />
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-[200px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${view.progress}%` }}
                    className="h-full bg-indigo-600 rounded-full"
                  />
                </div>
                <span className="text-xs font-bold text-indigo-600">{view.progress}%</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Clock size={14} />
                <span>Last activity: {format(new Date(view.date), "MMM d, yyyy")}</span>
              </div>
            </div>

            <div className="ml-4">
              {view.progress >= 95 ? (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl font-bold text-xs border border-emerald-100">
                  <CheckCircle2 size={16} /> Completed
                </div>
              ) : (
                <Link href={`/lesson/${view.lesson_id}`}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-slate-900 text-white p-3 rounded-xl shadow-lg hover:bg-indigo-600 transition-colors"
                  >
                    <PlayCircle size={20} />
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default ViewedLessons