/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight,  Timer, Award, RotateCcw, } from "lucide-react";
import QuestionCard from "./QuestionCard";
import ExamResults from "./ExamResults";
import ExamStepper from "./ExamStepper";

const ExamPage = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const student_id = searchParams.get("studentId");
  const lessonId = searchParams.get("lessonId");
  const examId = pathname.split("/")[2];
console.log(searchParams);

  const [examData, setExamData] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeMap, setTimeMap] = useState<Record<number, number>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [direction, setDirection] = useState(0); 

  // 1. Fetch Exam & Check Previous Submission
  useEffect(() => {
    const initExam = async () => {
      try {
        setLoading(true);
        const [examRes, ansRes] = await Promise.all([
          axios.get(`${process.env.local}/qa/exam/${examId}`),
          axios.get(`${process.env.local}/answers/student/${student_id}/exam/${examId}`)
        ]);

        const data = examRes.data.data;
        setExamData(data);

        const initialTimes: any = {};
        data.forEach((q: any, i: number) => initialTimes[i] = parseInt(q.time) * 60);
        setTimeMap(initialTimes);

        if (ansRes.data.data.length > 0) {
          const loadedAns: any = {};
          ansRes.data.data.forEach((item: any) => {
            const idx = data.findIndex((q: any) => q.id === item.question_id);
            if (idx !== -1) loadedAns[idx] = item.answer;
          });
          setAnswers(loadedAns);
          setIsFinished(true);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    initExam();
  }, [examId, student_id]);

  // 2. Timer Logic
  useEffect(() => {
    if (isFinished || loading || !examData[currentIndex]) return;
    const timer = setInterval(() => {
      setTimeMap(prev => {
        if (prev[currentIndex] <= 0) return prev;
        return { ...prev, [currentIndex]: prev[currentIndex] - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, isFinished, loading, examData]);

  // 3. Handlers
  const handleSelect = (ans: string) => {
    if (isFinished || timeMap[currentIndex] <= 0) return;
    setAnswers(prev => ({ ...prev, [currentIndex]: ans }));
  };

  const navigate = (newIndex: number) => {
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  };

  const submitExam = async () => {
    setIsFinished(true);
    try {
      const requests = examData.map((q, i) => {
        const userAnswer = answers[i] ?? "";
        const isCorrect = userAnswer === q.correct_answer;
        return axios.post(`${process.env.local}/answers`, {
          student_id,
          question_id: q.id,
          exams_id: examId,
          answer: userAnswer,
          is_correct: isCorrect,
          marks: isCorrect ? 1 : 0,
        });
      });
      await Promise.all(requests);
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="p-4 bg-white rounded-full shadow-xl">
        <RotateCcw className="text-indigo-600" size={32} />
      </motion.div>
    </div>
  );

  if (isFinished) return <ExamResults examData={examData} answers={answers} lessonId={lessonId} />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <ExamStepper total={examData.length} current={currentIndex} answers={answers} />
           <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-2xl font-bold border border-amber-100">
              <Timer size={18} />
              <span className="tabular-nums">
                {Math.floor(timeMap[currentIndex] / 60)}:{(timeMap[currentIndex] % 60).toString().padStart(2, "0")}
              </span>
           </div>
        </div>

        {/* Question Container */}
        <div className="relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <QuestionCard 
                question={examData[currentIndex]} 
                index={currentIndex} 
                selectedAnswer={answers[currentIndex]} 
                onSelect={handleSelect} 
                isTimeUp={timeMap[currentIndex] <= 0}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center gap-4">
          <button
            onClick={() => navigate(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            <ChevronLeft size={20} /> Previous
          </button>

          {currentIndex === examData.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submitExam}
              disabled={!answers[currentIndex]}
              className="flex items-center gap-2 px-10 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 disabled:bg-slate-300"
            >
              Submit Exam <Award size={20} />
            </motion.button>
          ) : (
            <button
              onClick={() => navigate(currentIndex + 1)}
              disabled={!answers[currentIndex]}
              className="flex items-center gap-2 px-10 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 disabled:opacity-30 transition-all"
            >
              Next <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;