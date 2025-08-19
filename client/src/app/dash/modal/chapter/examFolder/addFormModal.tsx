"use client";
import React, { useState } from "react";
import axios from "axios";
import { IoMdAddCircle, IoMdTrash } from "react-icons/io";
import { FaCheckDouble } from "react-icons/fa";

interface AddFormModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  type?: "question" | "exam";
  lessonId?: number;
  examId?: number;
  onCreated?: () => void;
}

const AddFormModal: React.FC<AddFormModalProps> = ({
  open,
  setOpen,
  type = "question",
  lessonId,
  examId,
  onCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    question: "",
    answers: [""],
    correct_answer: "",
    notes: "",
    file_url: "",
    file_type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (i: number, val: string) => {
    const updated = [...formData.answers];
    updated[i] = val;
    setFormData((prev) => ({ ...prev, answers: updated }));
  };

  const handleAddAnswer = () => {
    setFormData((prev) => ({ ...prev, answers: [...prev.answers, ""] }));
  };

  const handleDeleteAnswer = (i: number) => {
    const updated = formData.answers.filter((_, idx) => idx !== i);
    setFormData((prev) => ({
      ...prev,
      answers: updated,
      correct_answer:
        prev.correct_answer === formData.answers[i] ? "" : prev.correct_answer,
    }));
  };

  const handleCorrectAnswer = (ans: string) => {
    setFormData((prev) => ({ ...prev, correct_answer: ans }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const uploadFile = async (): Promise<string> => {
    if (!file) return "";
    const form = new FormData();
    form.append("image", file);
    const res = await axios.post(`${process.env.img}/upload/image`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let uploadedFileName = "";
      if (file) {
        uploadedFileName = await uploadFile();
      }

      if (type === "exam") {
        await axios.post(`${process.env.local}/exams`, {
          title: formData.title,
          time: formData.time,
          lesson_id: lessonId,
        });
      } else {
        const res = await axios.post(`${process.env.local}/qa`, {
          exams_id: examId,
          question: formData.question,
          answers: formData.answers,
          correct_answer: formData.correct_answer,
          time: formData.time,
          notes: formData.notes,
          file_url: uploadedFileName,
          file_type: uploadedFileName ? "image" : "",
        });
        console.log(res.data.data);
      }

      setFormData({
        title: "",
        time: "",
        question: "",
        answers: [""],
        correct_answer: "",
        notes: "",
        file_url: "",
        file_type: "",
      });
      setFile(null);
      setOpen(false);
      if (onCreated) onCreated();
    } catch (err) {
      console.error("Error saving:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          ></div>

          <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-lg z-10">
            <h2 className="text-lg font-semibold mb-4">
              {type === "exam" ? "Add New Exam" : "Add New Question"}
            </h2>

            {type === "question" && (
              <>
                <div className="mb-3">
                  <label className="block text-sm text-gray-700">
                    Question
                  </label>
                  <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="Enter question"
                  />
                </div>

                <div className="mb-3">
                  <label className="block font-semibold mb-1">Answers:</label>
                  <div className="space-y-2">
                    {formData.answers.map((ans, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between w-full p-2 ${
                          formData.correct_answer === ans
                            ? "border-green-300 border-2"
                            : "border"
                        } rounded`}
                      >
                        <input
                          type="text"
                          className="w-full p-2 border rounded mr-2"
                          value={ans}
                          onChange={(e) =>
                            handleAnswerChange(i, e.target.value)
                          }
                        />
                        <div className="flex gap-2 items-center">
                          {formData.correct_answer === ans ? (
                            <div
                              className="w-8 h-8 rounded-full border cursor-pointer flex items-center justify-center bg-green-500"
                              onClick={() => handleCorrectAnswer(ans)}
                            >
                              <FaCheckDouble className="text-white" />
                            </div>
                          ) : (
                            <div
                              className="w-8 h-8 cursor-pointer bg-white rounded-full border flex items-center justify-center"
                              onClick={() => handleCorrectAnswer(ans)}
                            ></div>
                          )}
                          <IoMdTrash
                            className="cursor-pointer text-red-500 w-6 h-6"
                            onClick={() => handleDeleteAnswer(i)}
                          />
                        </div>
                      </div>
                    ))}
                    <div
                      className="flex items-center gap-2 cursor-pointer text-blue-600 mt-2"
                      onClick={handleAddAnswer}
                    >
                      <IoMdAddCircle className="w-6 h-6" /> Add Answer
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm text-gray-700">Notes</label>
                  <input
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="Optional notes"
                  />
                </div>
                <div className="mb-3">
                  <label className="block font-semibold mb-1">
                    Time (minutes):
                  </label>
                  <input
                    type="number"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-gray-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border rounded-lg p-2 mt-1"
                  />
                </div>
              </>
            )}

            {type === "exam" && (
              <>
                <div className="mb-3">
                  <label className="block text-sm text-gray-700">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="Enter exam title"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm text-gray-700">
                    Time (minutes)
                  </label>
                  <input
                    name="time"
                    type="number"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1"
                    placeholder="Enter exam time"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFormModal;
