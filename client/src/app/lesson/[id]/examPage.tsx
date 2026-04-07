/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import IfDoneExams from "./ifDoneExams";

interface ExamPageProps {
  lessonId: string;
  studentId: string;
  exam:{
    title:string,
    time:string|number,
    lessonId:string
  }
}

const ExamPage: React.FC<ExamPageProps> = ({  lesson, studentId }) => {
  
  console.log(lesson)
    if (lesson.exams.length === 0) {
      return <p className="text-indigo-200 text-xs italic">No quizzes available for this lesson yet.</p>;
    }
    return (
      <div className="space-y-3">
        {lesson.exams.map((e: any) => (
          <IfDoneExams
            key={e.id}
            lesson={lesson}
            answers={e.studentAnswer}
            exam={e}
            studentId={studentId}
          />
        ))}
      </div>
    );
 
};

export default ExamPage;