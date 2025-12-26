/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import LessonName from "../lessonName";
import Image from "next/image";
import filesIcon from "../../../images/word.png";
import performanceIcon from "../../../images/performance.png";
import examTimeIcon from "../../../images/exam-time.png"; 

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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const allExamFetch = await axios.get(`${process.env.local}/exams`);

        const examResultsData = await Promise.all(
          allExamFetch.data.data.map(async (exam: any) => {
            try {
              const allAnswers = await axios.get(
                `${process.env.local}/answers/student/${roleDet.id}/exam/${exam.id}`
              );

              if (allAnswers.data.data.length === 0) return null;

              const correctAnswersCount = allAnswers.data.data.reduce(
                (acc: number, answer: any) => acc + (answer.is_correct ? 1 : 0),
                0
              );

              const totalQuestions = allAnswers.data.data.length;
              const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);

              const examTime = allAnswers.data.data[0]?.date;
              const formattedDate = format(new Date(examTime), "dd MMM: yyyy HH:mm");

              return {
                examName: exam.title,
                examId: exam.id,
                lessonName: exam.lesson_id,
                score: percentage,
                completedAt: formattedDate,
              };
            } catch (error) {
              console.log(error);
              
              return null;
            }
          })
        );

        setExamResults(examResultsData.filter((result) => result !== null) as ExamResult[]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAll();
  }, [roleDet.id]);

  const getStatusBadge = (score: number) => {
    if (score < 60) {
      return (
        <div className="flex items-center gap-1 bg-[#fff4e5] text-[#663c00]  px-3 py-1 rounded-lg text-sm font-semibold border border-[#ffe2b3]">
          <span className="text-orange-500">⚠️</span> Needs Improvement
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 bg-[#e7f4e9] text-[#1e4620] px-3 py-1 rounded-lg text-sm font-semibold border border-[#c3e6cb]">
        <span className="text-green-500">✅</span> Great Job
      </div>
    );
  };

  return (
    <div className="w-11/12 lg:w-8/12 p-4 bg-white relative -top-7 rounded-b-2xl">
      {/* Header */}
      <h2 className="text-[#121416] flex gap-2 text-lg items-center font-bold px-2 pb-5 pt-5 ">
        <Image src={filesIcon} alt="icon" width={22} height={22} />
        <span>Your Performance</span>
        <Image src={performanceIcon} alt="icon" width={22} height={22} />
      </h2>

      {/* Cards Container */}
      <div className="flex flex-col gap-4">
        {examResults.map((result, index) => (
          <div
            key={index}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white border border-[#ff9d0042] rounded-[24px] shadow-sm overflow-hidden"
          >
            {/* Left Section: Icon & Info */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Image src={examTimeIcon} alt="exam icon" width={48} height={48} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[#121416] font-bold text-xl capitalize">
                  {result.examName}
                </h3>
                <div className="text-[#637587] text-sm mb-3">
                  <LessonName lessonId={result.lessonName} />
                </div>

                {/* Score & Status */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-black text-[#121416]">
                    {result.score}%
                  </span>
                  {getStatusBadge(result.score)}
                </div>

                {/* Date */}
                <p className="text-[#637587] text-[13px]">
                  Completed on: <span className="font-medium">{result.completedAt}</span>
                </p>
              </div>
            </div>

          
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllViewsExam;