/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ExamImage from "./examImage";
import ExamAnswers from "./examAnswers";
import { IoMdAddCircle } from "react-icons/io";
import AddFormModal from "./addFormModal";

const EditExamDash = ({
  setOpenModelEditExam,
  examId,
}: {
  setOpenModelEditExam: (val: boolean) => void;
  examId: string;
}) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editImage, setEditImage] = useState<any>(null);
  const [editQues, setEditQues] = useState("");
  const [editAnswers, setEditAnswers] = useState<string[]>([]);
  const [correctAnser, setCorrectAnser] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const res = await axios.get(`${process.env.local}/qa/exam/${examId}`);
        setQuestions(res.data.data);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };
    fetchExamDetails();
  }, [examId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const q = questions[currentIndex];

      let fileUrl = q.file_url;
      let fileType = q.file_type;

      if (editImage) {
        const formData = new FormData();
        formData.append(
          editImage.type.startsWith("image/") ? "image" : "file",
          editImage
        );

        const uploadUrl = editImage.type.startsWith("image/")
          ? `${process.env.img}/upload/image`
          : `${process.env.img}/upload/file`;

        const uploadRes = await axios.post(uploadUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        fileUrl = uploadRes.data;
        fileType = editImage.type;
      }

      const updatedQuestion = {
        id: q.id,
        question: editQues,
        answers: editAnswers,
        correct_answer: correctAnser,
        time: editTime,
        notes: editNotes,
        file_url: fileUrl,
        file_type: fileType,
      };

      const res = await axios.patch(`${process.env.local}/qa`, updatedQuestion);

      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex] = res.data;
      setQuestions(updatedQuestions);

      alert("Saved successfully");
    } catch (err) {
      console.error("Error saving question:", err);
      alert("Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (currentQuestion) {
      setEditQues(currentQuestion.question || "");
      setEditTime(currentQuestion.time || "");
      setEditNotes(currentQuestion.notes || "");
      setEditAnswers(currentQuestion.answers || []);
      setCorrectAnser(currentQuestion.correct_answer || "");
      setEditImage(null);
    }
  }, [currentQuestion]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black/50 z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Exam</h2>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {questions.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`cursor-pointer rounded-full w-8 h-8 flex items-center justify-center text-white ${
                i === currentIndex ? "bg-blue-600" : "bg-gray-500"
              }`}
            >
              {i + 1}
            </div>
          ))}
          <IoMdAddCircle
            className="cursor-pointer w-9 h-9 text-blue-600"
            onClick={() => setOpen(true)}
          />
          <AddFormModal
            open={open}
            setOpen={setOpen}
            type="question"
            examId={examId}
            onCreated={() => console.log("Question Created!")}
          />
        </div>

        {currentQuestion ? (
          <>
            <ExamImage
              currentQuestion={currentQuestion}
              setEditImage={setEditImage}
            />
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Question:</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={editQues}
                  onChange={(e) => setEditQues(e.target.value)}
                />
              </div>

              <ExamAnswers
                editAnswers={editAnswers}
                setEditAnswers={setEditAnswers}
                correctAnser={correctAnser}
                setCorrectAnser={setCorrectAnser}
              />

              <div>
                <label className="block font-semibold mb-1">
                  Time (minutes):
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  onChange={(e) => setEditTime(e.target.value)}
                  value={editTime}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Notes:</label>
                <textarea
                  className="w-full p-2 border rounded"
                  onChange={(e) => setEditNotes(e.target.value)}
                  value={editNotes}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                onClick={() => setOpenModelEditExam(false)}
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <div>No question data</div>
        )}
      </div>
    </div>
  );
};

export default EditExamDash;
