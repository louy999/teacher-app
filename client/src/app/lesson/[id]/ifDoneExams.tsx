"use client";
import React, { useEffect, useState } from "react";
import { MdOutlineAssessment } from "react-icons/md";
import Link from "next/link";
import axios from "axios";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

interface Exam {
  id: string;
  title: string;
  time: number;
}

interface Answer {
  is_correct: boolean;
}

interface Props {
  exam: Exam;
  lessonId: string;
  studentId: string;
}

const IfDoneExams: React.FC<Props> = ({ exam, lessonId, studentId }) => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/answers/student/${studentId}/exam/${exam.id}`
        );
        setAnswers(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [exam.id, studentId]);

  if (loading) return <div>Loading...</div>;

  if (answers.length === 0) {
    return (
      <Link
        href={`/exam/${exam.id}?lessonId=${lessonId}&studentId=${studentId}`}
        className="flex items-center gap-3 mb-2 cursor-pointer hover:bg-slate-100 hover:p-3 hover:mb-3 duration-300 rounded-md transition-all"
      >
        <div className="flex items-center justify-center bg-[#F0F2F5] rounded-md p-3">
          <MdOutlineAssessment className="text-xl " />
        </div>
        <div>
          <div className="text-gray-800 font-semibold text-lg capitalize">
            {exam.title}
          </div>
          <div className="text-sm text-gray-400">{exam.time} Min</div>
        </div>
      </Link>
    );
  }

  const incorrectCount = answers.filter((a) => !a.is_correct).length;
  const totalCount = answers.length;
  const scorePercentage = Math.round(
    ((totalCount - incorrectCount) / totalCount) * 100
  );

  return (
    <div className=" flex items-center gap-3  cursor-pointer border-green-300 border-2 p-2 rounded-md ">
      <div className="flex items-center justify-center bg-[#F0F2F5] rounded-md p-3">
        <MdOutlineAssessment className="text-xl " />
      </div>
      <div>
        <div className="text-gray-800 font-semibold text-lg capitalize flex items-center gap-2">
          <span>{exam.title}</span>
          <span>
            <IoCheckmarkDoneCircleOutline className="text-green-400 text-2xl" />
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-400">{scorePercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default IfDoneExams;
