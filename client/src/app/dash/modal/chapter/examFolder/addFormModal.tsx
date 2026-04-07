/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Image as ImageIcon, 
  Timer, 
  FileText, 
  MessageSquare,
  Loader2,
  Save,
  Gamepad2
} from "lucide-react";

interface AddFormModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  type?: "question" | "exam";
  lessonId?: number;
  examId?: number;
  onCreated?: () => void;
  fetchExams: () => void;
}

const AddFormModal: React.FC<AddFormModalProps> = ({
  open,
  setOpen,
  type = "question",
  lessonId,
  examId,
  onCreated,
  fetchExams,
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (formData.answers.length <= 1) return;
    const updated = formData.answers.filter((_, idx) => idx !== i);
    setFormData((prev) => ({
      ...prev,
      answers: updated,
      correct_answer: prev.correct_answer === formData.answers[i] ? "" : prev.correct_answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let uploadedFileName = "";
      
      if (file) {
        const form = new FormData();
        form.append("image", file);
        const res = await axios.post(`${process.env.img}/upload/image`, form);
        uploadedFileName = res.data;
      }

      if (type === "exam") {
        await axios.post(`${process.env.local}/exams`, {
          title: formData.title,
          time: formData.time,
          lesson_id: lessonId,
        });
      } else {
        await axios.post(`${process.env.local}/qa`, {
          exams_id: examId,
          question: formData.question,
          answers: formData.answers,
          correct_answer: formData.correct_answer,
          time: formData.time,
          notes: formData.notes,
          file_url: uploadedFileName,
          file_type: uploadedFileName ? "image" : "",
        });
      }

      // Reset & Close
      setFormData({ title: "", time: "", question: "", answers: [""], correct_answer: "", notes: "" });
      setFile(null);
      setOpen(false);
      if (onCreated) onCreated();
      fetchExams();
    } catch (err) {
      console.error("Save Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[#FBFCFE] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl custom-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl text-white shadow-lg ${type === 'exam' ? 'bg-orange-500 shadow-orange-100' : 'bg-blue-600 shadow-blue-100'}`}>
                  {type === 'exam' ? <Gamepad2 size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-800 tracking-tight">
                    {type === "exam" ? "Create New Assessment" : "Add New Question"}
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fill in the details below</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {type === "question" ? (
                <>
                  {/* Question Field */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                      <FileText size={12} /> Question Statement
                    </label>
                    <textarea
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-white border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all font-bold text-gray-700"
                      placeholder="What is the capital of...?"
                    />
                  </div>

                  {/* Answers Section */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Answer Choices
                    </label>
                    <div className="grid gap-3">
                      {formData.answers.map((ans, i) => (
                        <motion.div 
                          layout
                          key={i}
                          className={`flex items-center gap-3 p-2 bg-white rounded-2xl border-2 transition-all ${formData.correct_answer === ans && ans !== "" ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-50'}`}
                        >
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, correct_answer: ans }))}
                            className={`p-2 rounded-xl transition-all ${formData.correct_answer === ans && ans !== "" ? 'text-emerald-600' : 'text-gray-300 hover:text-emerald-400'}`}
                          >
                            {formData.correct_answer === ans && ans !== "" ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                          </button>
                          
                          <input
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-gray-700"
                            placeholder={`Option ${i + 1}`}
                            value={ans}
                            onChange={(e) => handleAnswerChange(i, e.target.value)}
                          />
                          
                          <button onClick={() => handleDeleteAnswer(i)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                    <button 
                      onClick={handleAddAnswer}
                      className="flex items-center gap-2 text-blue-600 font-bold text-xs mt-2 hover:bg-blue-50 w-fit px-4 py-2 rounded-xl transition-all"
                    >
                      <Plus size={16} /> Add Another Choice
                    </button>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                        <Timer size={12} /> Time (Min)
                      </label>
                      <input
                        type="number"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all font-bold text-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                        <ImageIcon size={12} /> Illustration
                      </label>
                      <label className="flex items-center gap-3 w-full bg-white border border-gray-100 p-4 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all shadow-sm">
                         <div className="bg-gray-100 p-1.5 rounded-lg"><ImageIcon size={16} className="text-gray-400" /></div>
                         <span className="text-xs font-bold text-gray-400 line-clamp-1">{file ? file.name : "Select Image"}</span>
                         <input type="file" accept="image/*" className="hidden" onChange={(e: any) => setFile(e.target.files?.[0])} />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                      <MessageSquare size={12} /> Explanatory Notes
                    </label>
                    <input
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-bold text-gray-700"
                      placeholder="Optional explanation for the answer..."
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Exam Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                        <FileText size={12} /> Exam Title
                      </label>
                      <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 shadow-sm font-bold text-gray-700"
                        placeholder="Midterm, Final Exam..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                        <Timer size={12} /> Duration (Minutes)
                      </label>
                      <input
                        name="time"
                        type="number"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 shadow-sm font-bold text-gray-700"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white px-8 py-6 border-t border-gray-100 flex gap-4">
              <button
                disabled={loading}
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
                onClick={() => setOpen(false)}
              >
                Discard
              </button>
              <button
                disabled={loading}
                onClick={handleSubmit}
                className={`flex-[2] py-4 text-white rounded-2xl font-black shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${type === 'exam' ? 'bg-orange-500 shadow-orange-100 hover:bg-orange-600' : 'bg-blue-600 shadow-blue-100 hover:bg-blue-700'}`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {loading ? "Processing..." : `Create ${type === 'exam' ? 'Assessment' : 'Question'}`}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddFormModal;