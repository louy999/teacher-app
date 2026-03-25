/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Home, CheckCircle2, XCircle, Eye } from "lucide-react";

const ExamResults = ({ examData, answers, lessonId }: any) => {
  const [showReview, setShowReview] = useState(false);
  
  const correct = examData.filter((q: any, i: number) => answers[i] === q.correct_answer).length;
  const percentage = Math.round((correct / examData.length) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="max-w-3xl mx-auto py-12 px-4"
    >
      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-50">
        {/* --- 1. Summary Header --- */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Quiz Results</h2>
          <p className="text-slate-400 font-medium">Great effort! Review your performance below.</p>
        </div>

        {/* --- 2. Stats Grid --- */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 text-center">
             <p className="text-[10px] font-black uppercase text-indigo-400 mb-1 tracking-widest">Your Score</p>
             <p className="text-4xl font-black text-indigo-600">{percentage}%</p>
          </div>
          <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100/50 text-center">
             <p className="text-[10px] font-black uppercase text-emerald-400 mb-1 tracking-widest">Correct</p>
             <p className="text-4xl font-black text-emerald-600">{correct}/{examData.length}</p>
          </div>
        </div>

        {/* --- 3. Actions --- */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <button 
            onClick={() => setShowReview(!showReview)}
            className="flex-1 py-4 bg-white text-slate-900 border-2 border-slate-100 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Eye size={20} /> {showReview ? "Hide Review" : "Review Answers"}
          </button>
          
          <button 
            onClick={() => window.location.href = `/lesson/${lessonId}`}
            className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            <Home size={20} /> Exit to Lesson
          </button>
        </div>

        {/* --- 4. Review Section (Accordion) --- */}
        <AnimatePresence>
          {showReview && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4 pt-6 border-t border-slate-100"
            >
              <h3 className="text-lg font-black text-slate-800 mb-4 px-2">Detailed Feedback</h3>
              {examData.map((q: any, i: number) => {
                const isCorrect = answers[i] === q.correct_answer;
                return (
                  <div 
                    key={i} 
                    className={`p-5 rounded-[1.5rem] border ${isCorrect ? 'border-emerald-100 bg-emerald-50/20' : 'border-red-100 bg-red-50/20'}`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? <CheckCircle2 className="text-emerald-500 mt-1 shrink-0" size={20} /> : <XCircle className="text-red-500 mt-1 shrink-0" size={20} />}
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-800">Question {i + 1}: {q.question}</p>
                        <div className="flex flex-wrap gap-4 text-xs font-medium">
                          <p className="text-slate-500">
                             Your Answer: <span className={isCorrect ? "text-emerald-600" : "text-red-600"}>{answers[i] || "Skipped"}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-emerald-600">
                               Correct: <span>{q.correct_answer}</span>
                            </p>
                          )}
                        </div>
                        {q.notes && (
                          <div className="mt-2 p-3 bg-white/50 rounded-xl text-[11px] text-slate-500 border border-slate-100 italic">
                            💡 {q.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ExamResults;