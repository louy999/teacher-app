/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios from "axios";
import IfDoneExams from "./ifDoneExams";

interface ExamPageProps {
  lessonId: string;
  studentId: string;
}

const ExamPage: React.FC<ExamPageProps> = async ({ lessonId, studentId }) => {
  try {
    const res = await axios.get(
      `${process.env.local}/exams/lesson/${lessonId}`
    );

    return (
      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Assessment</h2>
        {res.data.data.map((e: any, i: number) => (
          <IfDoneExams
            key={i}
            exam={e}
            lessonId={lessonId}
            studentId={studentId}
          />
        ))}
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div className="text-red-500 p-4">Failed to load exam data.</div>;
  }
};

export default ExamPage;
