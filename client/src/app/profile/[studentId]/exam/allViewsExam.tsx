/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import LessonName from "../lessonName";
import Link from "next/link";

interface RoleDet {
  id: string;
}

interface ExamResult {
  examName: string;
  examId: string;
  lessonName: string;
  score: string;
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

              const correctAnswersCount = allAnswers.data.data.reduce(
                (acc: number, answer: any) => acc + (answer.is_correct ? 1 : 0),
                0
              );

              const totalQuestions = allAnswers.data.data.length;

              const percentage = (
                (correctAnswersCount / totalQuestions) *
                100
              ).toFixed(2);

              const examTime = allAnswers.data.data[0]?.date;
              const formattedDate = format(
                new Date(examTime),
                "yyyy-MM-dd HH:mm:ss"
              );

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

        setExamResults(examResultsData.filter((result) => result !== null));
      } catch (error) {
        console.log(error);
      }
    };

    fetchAll();
  }, [roleDet.id]);

  return (
    <div className="w-8/12 px-4">
      <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Exam Results
      </h2>
      <div className="px-4 py-3 @container">
        <div className="flex overflow-hidden rounded-xl border border-[#dde1e3] bg-white">
          <table className="flex-1">
            <thead>
              <tr className="bg-white">
                <th className="px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                  Exam Name
                </th>
                <th className="px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                  Lesson Name
                </th>
                <th className="px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                  Score (%)
                </th>
                <th className="px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                  Completed At
                </th>
              </tr>
            </thead>
            <tbody>
              {examResults.map((result, index) => {
                return (
                  <tr className="border-t border-t-[#dde1e3]" key={index}>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
                      <Link
                        href={`/exam/${result.examId}?lessonId=${result.lessonName}&studentId=${roleDet.id}`}
                        className="border-b border-b-black/50 px-1 hover:text-black/70 duration-300 hover:text-base"
                      >
                        {result.examName}
                      </Link>
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
                      <LessonName lessonId={result.lessonName} />
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                      {result.score}%
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-[#6a7681] text-sm font-normal leading-normal">
                      {result.completedAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllViewsExam;
