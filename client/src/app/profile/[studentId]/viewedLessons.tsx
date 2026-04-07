/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link"; 
import { PlayCircle, CheckCircle2, Rocket, Clock, ArrowUpRight, BookOpen } from "lucide-react";

const ViewedLessons = ({ roleDet }: any) => {
  const lessons = roleDet?.allLessonsInView || [];

  return (
    <div className="p-6 md:p-10 bg-white/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200">
              <Rocket size={24} />
            </div>
            Learning Journey
          </h2>
          <p className="text-slate-500 font-medium ml-1">
            You have participated in {lessons.length} lessons so far. Keep going!
          </p>
        </div>
        
        {/* Quick Stats Badge */}
        <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Active Progress</span>
        </div>
      </div>

      {/* Lessons List/Grid */}
      <div className="grid grid-cols-1 gap-6">
        {lessons.map((view: any, index: number) => {
          const isCompleted = view.progress >= 95;
          
          return (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              key={index}
              className="group relative bg-white border border-slate-100 p-6 rounded-[2.5rem] transition-all hover:border-indigo-200 hover:shadow-[0_20px_50px_-20px_rgba(79,70,229,0.15)] overflow-hidden"
            >
              {/* Background Glow on Hover */}
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 max-w-[70%]">
                    <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                         {isCompleted ? 'Finished' : 'In Progress'}
                       </span>
                    </div>
                    <h3 className="font-black text-slate-800 text-xl leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {view.lesson?.title || "Untitled Lesson"}
                    </h3>
                  </div>

                  {isCompleted ? (
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                      <CheckCircle2 size={24} />
                    </div>
                  ) : (
                    <Link href={`/lesson/${view.lesson_id}`}>
                      <motion.div 
                        whileHover={{ rotate: 45, scale: 1.1 }}
                        className="p-3 bg-slate-900 text-white rounded-2xl cursor-pointer hover:bg-indigo-600 transition-colors"
                      >
                        <ArrowUpRight size={24} />
                      </motion.div>
                    </Link>
                  )}
                </div>

                {/* Progress Visual */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-tighter">
                    <span className="text-slate-400">Completion Score</span>
                    <span className="text-indigo-600">{view.progress}%</span>
                  </div>
                  <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${view.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        isCompleted 
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500" 
                        : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                    <Clock size={14} className="text-slate-300" />
                    <span>Updated {format(new Date(view.date), "MMM d, yyyy")}</span>
                  </div>
                  
                  {!isCompleted && (
                    <Link href={`/lesson/${view.lesson_id}`} className="text-indigo-600 text-xs font-black flex items-center gap-1 hover:underline">
                      RESUME <PlayCircle size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {lessons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-6 bg-slate-100 rounded-full text-slate-300">
            <BookOpen size={48} />
          </div>
          <p className="text-slate-500 font-bold">No lessons viewed yet. Start your journey today!</p>
        </div>
      )}
    </div>
  );
};

export default ViewedLessons;