"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, PlayCircle, Timer, Award, ChevronRight } from "lucide-react";

interface Exam {
  id: string;
  title: string;
  time: number;
}



interface Props {
  exam: Exam;
  lessonId: string;
  studentId: string;
}

const IfDoneExams: React.FC<Props> = ({ lesson, exam,  studentId ,answers}) => {
console.log(lesson)

  if (answers.length === 0) {
    return (
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          href={`/exam/${exam.id}?lessonId=${lesson.id}&studentId=${studentId}`}
          className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-500/20 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
              <PlayCircle size={22} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white capitalize">{exam.title}</h4>
              <p className="text-[10px] text-indigo-200 flex items-center gap-1 mt-1 font-medium">
                <Timer size={12} /> {exam.time} Minutes
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-white/40 group-hover:text-white" />
        </Link>
      </motion.div>
    );
  }

  const correctCount = answers.filter((a) => a.is_correct).length;
  const scorePercentage = Math.round((correctCount / answers.length) * 100);
  const isExcellent = scorePercentage >= 80;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-white rounded-2xl border-2 border-emerald-400/30 flex items-center justify-between shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${isExcellent ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
          <Award size={22} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-800 capitalize flex items-center gap-2">
            {exam.title}
            <CheckCircle2 size={14} className="text-emerald-500" />
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${isExcellent ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {scorePercentage}% Score
            </span>
            <span className="text-[10px] text-slate-400 font-medium italic">Completed</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IfDoneExams;