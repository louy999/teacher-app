/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Target, Calendar, BarChart3, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import Link from 'next/link';

const AllViewsExam = ({ roleDet }: any) => {
  const examResults = roleDet?.examsWithAnswers || [];

  return (
    <section className="p-6 md:p-10 bg-[#f8fafc] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-2xl shadow-indigo-200">
            <BarChart3 size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Progress</h2>
            <p className="text-slate-500 font-medium">Review your latest exam attempts and grades</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {examResults.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <Target className="mx-auto text-slate-200 mb-4" size={60} />
            <h3 className="text-slate-400 font-bold text-lg">No exam records found yet</h3>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 gap-6"
          >
            {examResults.map((exam: any, index: number) => {
              // --- منطق الحساب الجديد بناءً على الداتا الراجعة ---
              const totalQuestions = exam.answers?.length || 0;
              const correctAnswers = exam.answers?.filter((a: any) => a.is_correct === true).length || 0;
              const scorePercentage = totalQuestions > 0 
                ? Math.round((correctAnswers / totalQuestions) * 100) 
                : 0;
              
              const isPassing = scorePercentage >= 50;
              const lastActivity = exam.answers?.[0]?.date || exam.date;

              return (
                <motion.div
                  key={exam.id || index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.01 }}
                  className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    
                    {/* 1. Exam Icon & Title */}
                    <div className="flex items-center gap-6 min-w-[300px]">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 ${
                        isPassing ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                      }`}>
                        {isPassing ? <Award size={40} /> : <Target size={40} />}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-slate-800 text-2xl group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                          {exam.title}
                        </h3>
                        <div className="flex items-center gap-3">
                           <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                             <Clock size={14} /> {exam.time} Mins
                           </span>
                           <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                             isPassing ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                           }`}>
                             {isPassing ? 'Passed' : 'Need Review'}
                           </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Stats Breakdown */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 border-l border-slate-50 pl-0 lg:pl-8">
                        <div>
                            <span className="block text-[10px] font-black text-slate-300 uppercase mb-1">Correct</span>
                            <span className="text-slate-700 font-bold flex items-center gap-1">
                                <CheckCircle2 size={16} className="text-emerald-500" /> {correctAnswers} / {totalQuestions}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-300 uppercase mb-1">Completion</span>
                            <span className="text-slate-700 font-bold flex items-center gap-1">
                                <Calendar size={16} className="text-indigo-400" /> {format(new Date(lastActivity), "MMM dd")}
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <span className="block text-[10px] font-black text-slate-300 uppercase mb-1">Status</span>
                            <div className="h-2 w-24 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${scorePercentage}%` }}
                                    className={`h-full ${isPassing ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Final Score & Action */}
                    <div className="flex items-center justify-between lg:justify-end gap-8">
                        <div className="text-right">
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Grade</span>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-5xl font-black tabular-nums tracking-tighter ${isPassing ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {scorePercentage}
                                </span>
                                <span className="text-slate-400 font-bold text-lg">%</span>
                            </div>
                        </div>
                        <Link href={`/exam/${exam.id}?lessonId=${exam.lesson_id}&studentId=${roleDet.student.id}`} >
                            <motion.button 
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-slate-900 text-white p-5 rounded-[1.5rem] shadow-xl hover:bg-indigo-600 transition-all"
                            >
                                <ChevronRight size={24} />
                            </motion.button>
                        </Link>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AllViewsExam;