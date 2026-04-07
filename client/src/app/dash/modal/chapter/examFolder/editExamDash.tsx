/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Plus, 
  Save, 
  HelpCircle, 
  Timer, 
  FileText, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from "lucide-react";

// المكونات الفرعية الخاصة بك
import ExamImage from "./examImage";
import ExamAnswers from "./examAnswers";
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

  const fetchExamDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.local}/qa/exam/${examId}`);
      setQuestions(res.data.data);
    } catch (error) {
      console.error("Error fetching exam details:", error);
    }
  }, [examId]);

  useEffect(() => {
    fetchExamDetails();
  }, [fetchExamDetails]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const q = questions[currentIndex];
      let fileUrl = q.file_url;
      let fileType = q.file_type;

      if (editImage) {
        const formData = new FormData();
        formData.append(editImage.type.startsWith("image/") ? "image" : "file", editImage);
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

      await axios.patch(`${process.env.local}/qa`, updatedQuestion);
      await fetchExamDetails();
      alert("Question updated successfully!");
    } catch (err) {
      console.error(err);
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={() => setOpenModelEditExam(false)}
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
      />

      {/* Main Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-[#F8FAFC] w-full max-w-4xl max-h-[92vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">Question Editor</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Exam ID: {examId}</p>
            </div>
          </div>
          <button 
            onClick={() => setOpenModelEditExam(false)}
            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* Question Stepper */}
          <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
            {questions.map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentIndex(i)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center ${
                  i === currentIndex 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setOpen(true)}
              className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all border-2 border-dashed border-emerald-200"
            >
              <Plus size={20} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {currentQuestion ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Image Section */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
                   <ExamImage currentQuestion={currentQuestion} setEditImage={setEditImage} />
                </div>

                {/* Question Text */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 space-y-3">
                  <div className="flex items-center gap-2 text-gray-400 uppercase font-black text-[10px]">
                    <FileText size={14} /> Question Body
                  </div>
                  <textarea
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700 transition-all"
                    value={editQues}
                    onChange={(e) => setEditQues(e.target.value)}
                    placeholder="Enter the question text here..."
                  />
                </div>

                {/* Answers Section */}
                {/* <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
                   <ExamAnswers
                    editAnswers={editAnswers}
                    setEditAnswers={setEditAnswers}
                    correctAnser={correctAnser}
                    setCorrectAnser={setCorrectAnser}
                  />
                </div> */}

                {/* Meta Data (Time & Notes) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 space-y-3">
                    <div className="flex items-center gap-2 text-gray-400 uppercase font-black text-[10px]">
                      <Timer size={14} /> Time Limit
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        onChange={(e) => setEditTime(e.target.value)}
                        value={editTime}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-300">Min</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 space-y-3">
                    <div className="flex items-center gap-2 text-gray-400 uppercase font-black text-[10px]">
                      <ImageIcon size={14} /> Teacher Notes
                    </div>
                    <input
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      onChange={(e) => setEditNotes(e.target.value)}
                      value={editNotes}
                      placeholder="Special instructions..."
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 italic">
                No questions found. Click + to add one.
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="bg-white px-8 py-6 border-t border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex gap-2">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="p-3 bg-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="p-3 bg-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-200 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setOpenModelEditExam(false)}
              className="px-6 py-4 text-gray-500 font-bold text-sm hover:bg-gray-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Question
            </button>
          </div>
        </div>
      </motion.div>

      <AddFormModal
        open={open}
        setOpen={setOpen}
        type="question"
        examId={examId}
        onCreated={fetchExamDetails}
      />
    </div>
  );
};

export default EditExamDash;