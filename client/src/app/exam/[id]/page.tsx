"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";

interface Question {
  id: string;
  question: string;
  answers: string[];
  correct_answer: string;
  time: string;
  notes?: string;
  file_url?: string;
  file_type?: string;
  date?: string;
  exams_id?: string;
}

const ExamPage: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const student_id = searchParams.get("studentId");
  const lessonId = searchParams.get("lessonId");

  const [examData, setExamData] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeMap, setTimeMap] = useState<Record<number, number>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  useEffect(() => {}, []);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get<{ data: Question[] }>(
          `${process.env.local}/qa/exam/${pathname.split("/")[2]}`
        );
        const data = response.data.data;
        const initialTimes: Record<number, number> = {};
        data.forEach((q, index) => {
          initialTimes[index] = parseInt(q.time) * 60;
        });
        setExamData(data);
        setTimeMap(initialTimes);
      } catch (error) {
        console.error("Failed to fetch exam data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeMap((prev) => {
        const updated = { ...prev };
        if (updated[currentIndex] > 0) updated[currentIndex]--;
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isFinished]);

  const currentQuestion: Question | undefined = examData[currentIndex];

  const handleSelect = (ans: string): void => {
    if (!currentQuestion || isFinished) return;
    if (timeMap[currentIndex] <= 0) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: ans }));
  };
  useEffect(() => {
    const ifDoneExam = async () => {
      try {
        const examId = pathname.split("/")[2];
        const res = await axios.get(
          `${process.env.local}/answers/student/${student_id}/exam/${examId}`
        );

        const previousAnswers = res.data.data;

        if (previousAnswers.length > 0) {
          const loadedAnswers: Record<number, string> = {};

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          previousAnswers.forEach((ansItem: any) => {
            const questionIndex = examData.findIndex(
              (q) => q.id === ansItem.question_id
            );
            if (questionIndex !== -1) {
              loadedAnswers[questionIndex] = ansItem.answer;
            }
          });

          setAnswers(loadedAnswers);
          setIsFinished(true);
        }
      } catch (error) {
        console.log("Error checking exam completion", error);
      }
    };

    if (examData.length > 0 && student_id) {
      ifDoneExam();
    }
  }, [examData, student_id, pathname]);

  const handleNext = (): void => {
    if (currentIndex < examData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinish = async (): Promise<void> => {
    setIsFinished(true);

    if (!student_id) {
      console.error("Missing student_id");
      return;
    }

    try {
      for (let i = 0; i < examData.length; i++) {
        const q = examData[i];
        const userAnswer = answers[i] ?? "";
        const isCorrect = userAnswer === q.correct_answer;
        const marks = isCorrect ? 1 : 0;
        const examId = pathname.split("/")[2];
        const payload = {
          student_id,
          question_id: q.id,
          exams_id: examId,
          answer: userAnswer,
          is_correct: isCorrect,
          marks,
        };

        await axios.post(`${process.env.local}/answers`, payload);
      }

      console.log("All answers submitted successfully");
    } catch (error) {
      console.error("Error submitting answers", error);
    }
  };

  const formatTime = (sec: number): string => {
    const min = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${min}:${s}`;
  };

  if (loading) return <div className="p-4">Loading...</div>;

  if (isFinished) {
    const total = examData.length;
    let correct = 0;

    examData.forEach((q, i) => {
      if (answers[i] === q.correct_answer) correct++;
    });

    const incorrect = total - correct;
    const percentage = Math.round((correct / total) * 100);

    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Final Exam Results</h2>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Student Performance</h3>

          <div className="flex justify-between items-center mb-2">
            <div className="text-xl font-semibold">{percentage}%</div>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex gap-6 mb-6">
            <div className="flex-1 p-4 bg-gray-50 border rounded">
              <p className="text-sm text-gray-600">Correct Answers</p>
              <p className="mt-1 text-2xl font-bold text-green-700">
                {correct}
              </p>
            </div>
            <div className="flex-1 p-4 bg-gray-50 border rounded">
              <p className="text-sm text-gray-600">Incorrect Answers</p>
              <p className="mt-1 text-2xl font-bold text-red-700">
                {incorrect}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Answer Breakdown</h3>

          <table className="w-full border-collapse border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border border-gray-300 text-left">
                  Question
                </th>
                <th className="p-2 border border-gray-300 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {examData.map((q, i) => {
                const userAnswer = answers[i];
                const isCorrect = userAnswer === q.correct_answer;

                return (
                  <tr key={q.id} className="border-t border-gray-300">
                    <td className="p-2 border border-gray-300">
                      Question {i + 1}
                    </td>
                    <td className="p-2 border border-gray-300">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              window.location.href = `/lesson/${lessonId}`;
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="p-4">No questions found.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white  ">
      {/* Stepper */}
      <div className="flex justify-center mb-6 space-x-4">
        {examData.map((q, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          return (
            <div key={q.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? "bg-green-600 border-green-600 text-white"
                    : isActive
                    ? "bg-black border-black text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              {idx !== examData.length - 1 && (
                <div
                  className={`w-10 h-1 ${
                    isCompleted ? "bg-green-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Question Header */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-semibold">
          Question {currentIndex + 1} of {examData.length}
        </h2>
        <span className="text-sm text-gray-600">
          Time Left: {formatTime(timeMap[currentIndex])}
        </span>
      </div>

      {/* Question Text */}
      {currentQuestion.file_url && currentQuestion.file_type && (
        <Image
          src={`${process.env.img}/image/${currentQuestion.file_url}`}
          alt="Question Image"
          width={300}
          height={300}
          priority
          className="flex items-center gap-3 transition"
        />
      )}
      <p className="mb-4 text-gray-800">{currentQuestion.question}</p>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.answers.map((ans, i) => {
          const isSelected = answers[currentIndex] === ans;
          return (
            <label
              key={i}
              className={`flex items-center p-3 border rounded cursor-pointer ${
                isSelected ? "bg-blue-50 border-blue-600" : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`question-${currentIndex}`}
                value={ans}
                checked={isSelected}
                onChange={() => handleSelect(ans)}
                className="form-radio text-blue-600 h-5 w-5"
              />
              <span className="ml-3 text-gray-900">{ans}</span>
            </label>
          );
        })}
      </div>
      <div>
        {currentQuestion.notes && (
          <div className="p-4 bg-gray-100 rounded-md mb-4">
            <h3 className="text-sm font-semibold mb-2">Notes:</h3>
            <p className="text-sm text-gray-700">{currentQuestion.notes}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentIndex === examData.length - 1 ? (
          <button
            onClick={handleFinish}
            className="bg-blue-600 text-white py-2 px-4 rounded"
            disabled={!answers[currentIndex]}
          >
            Finish
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!answers[currentIndex]}
            className="bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamPage;
