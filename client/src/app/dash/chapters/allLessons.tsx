/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, 
  ChevronRight, 
  Play, 
  FileText, 
  Loader2 
} from "lucide-react";

const AllLessonsDash = ({ chapterId, setLessonId }: any) => {
  const [allData, setAllData] = useState([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addLessonsFetch = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/lessons/chapter/${chapterId}`
      );
      setAllData(res.data.data);
    } catch {
    }
  }, [chapterId]);

  useEffect(() => {
    addLessonsFetch();
  }, [addLessonsFetch]);

  const handleDeleteLesson = async (e: React.MouseEvent, lessonId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    setDeletingId(lessonId);
    try {
      await axios.delete(`${process.env.local}/lessons/${lessonId}`);
      addLessonsFetch();
    } catch  {
     
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="px-3 py-2 space-y-2">
      <AnimatePresence>
        {allData
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((l: any, i: number) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLessonId(l.id)}
              className="group flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Play size={14} fill="currentColor" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {l.title}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <FileText size={10} /> {l.type || "Video Lesson"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteLesson(e, l.id)}
                  disabled={deletingId === l.id}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  {deletingId === l.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
                
                {/* Indicator */}
                <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {allData.length === 0 && (
        <p className="text-center text-[10px] text-gray-400 py-4 italic">
          No lessons added to this chapter yet.
        </p>
      )}
    </div>
  );
};

export default AllLessonsDash;