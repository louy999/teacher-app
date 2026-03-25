"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Target, Calendar, BarChart3, Loader2, AlertCircle } from "lucide-react";
import LessonName from "../lessonName";

interface RoleDet {
  id: string;
}

interface ExamResult {
  examName: string;
  examId: string;
  lessonName: string;
  score: number;
  completedAt: string;
}

const AllViewsExam = ({ roleDet }: { roleDet: RoleDet }) => {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamPerformance = async () => {
      try {
        setLoading(true);
        // 1. Get all exams
        const allExamsRes = await axios.get(`${process.env.local}/exams`);
        const exams = allExamsRes.data.data;

        // 2. Fetch answers for each exam in parallel
        const results = await Promise.all(
          exams.map(async (exam: any) => {
            try {
              const answersRes = await axios.get(
                `${process.env.local}/answers/student/${roleDet.id}/exam/${exam.id}`
              );

              const studentAnswers = answersRes.data.data;
              if (!studentAnswers || studentAnswers.length === 0) return null;

              const correctCount = studentAnswers.filter((a: any) => a.is_correct).length;
              const totalQuestions = studentAnswers.length;
              const percentage = Math.round((correctCount / totalQuestions) * 100);
              
              const completionDate = studentAnswers[0]?.date || new Date();

              return {
                examName: exam.title,
                examId: exam.id,
                lessonName: exam.lesson_id,
                score: percentage,
                completedAt: format(new Date(completionDate), "dd MMM, yyyy"),
              };
            } catch (err) {
              return null;
            }
          })
        );

        setExamResults(results.filter((r) => r !== null) as ExamResult[]);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (roleDet?.id) fetchExamPerformance();
  }, [roleDet.id]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-400 font-medium animate-pulse">Analyzing performance data...</p>
      </div>
    );
  }

  return (
    <section className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Exam Performance</h2>
            <p className="text-slate-400 text-sm font-medium">Tracking your quiz scores and progress</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {examResults.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"
          >
            <AlertCircle className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-500 font-bold">No exams completed yet.</p>
            <p className="text-slate-400 text-sm">Your results will appear here once you finish a quiz.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4"
          >
            {examResults.map((result, index) => {
              const isPassing = result.score >= 60;
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  className="group relative flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className={`p-4 rounded-2xl shrink-0 transition-colors ${
                      isPassing ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                    }`}>
                      <Award size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {result.examName}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                        <Target size={14} />
                        <LessonName lessonId={result.lessonName} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-8 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <div className="text-center">
                      <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Grade</span>
                      <span className={`text-3xl font-black tabular-nums ${isPassing ? 'text-emerald-500' : 'text-orange-500'}`}>
                        {result.score}%
                      </span>
                    </div>

                    <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />

                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] font-black uppercase block tracking-widest mb-1">Date</span>
                      <span className="text-slate-600 text-sm font-bold flex items-center justify-end gap-1">
                        <Calendar size={14} className="text-slate-300" />
                        {result.completedAt}
                      </span>
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