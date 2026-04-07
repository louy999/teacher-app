/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardCheck, 
  Plus, 
  Trash2, 
  Timer, 
  LayoutList,
  Loader2,
  ChevronRight
} from "lucide-react";

// Components
import EditExamDash from "../modal/chapter/examFolder/editExamDash";
import AddFormModal from "../modal/chapter/examFolder/addFormModal";

const ExamsDash = ({ lessonId }: { lessonId: string }) => {
  const [dataExam, setDataExam] = useState<any[]>([]);
  const [openExamId, setOpenExamId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.local}/exams/lesson/${lessonId}`);
      setDataExam(res.data.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleDeleteExam = async (examId: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return;
    
    setDeletingId(examId);
    try {
      await axios.delete(`${process.env.local}/exams/${examId}`);
      setDataExam((prev) => prev.filter((exam) => exam.id !== examId));
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2.5 rounded-2xl text-orange-600">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-800 tracking-tight">Assessments</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quizzes & Exams</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all"
        >
          <Plus size={18} />
          Create Exam
        </motion.button>
      </div>

      {/* Exams List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {dataExam.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-gray-400"
            >
              <LayoutList size={40} strokeWidth={1} className="mb-2 opacity-20" />
              <p className="text-xs font-medium">No assessments assigned to this lesson</p>
            </motion.div>
          ) : (
            dataExam.map((exam) => (
              <motion.div
                key={exam.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[1.5rem] hover:border-orange-200 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setOpenExamId(exam.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-orange-50 transition-colors">
                    <ClipboardCheck className="text-gray-400 group-hover:text-orange-500 transition-colors" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-700 capitalize">{exam.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                        <Timer size={10} />
                        {exam.time} Minutes
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    disabled={deletingId === exam.id}
                    className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    {deletingId === exam.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                  <div className="p-2 text-gray-300 group-hover:text-orange-400 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AddFormModal
        open={isAddModalOpen}
        setOpen={setIsAddModalOpen}
        fetchExams={fetchExams}
        type="exam"
        lessonId={lessonId}
      />

      {openExamId && (
        <EditExamDash
          setOpenModelEditExam={() => setOpenExamId(null)}
          examId={openExamId}
        />
      )}
    </div>
  );
};

export default ExamsDash;