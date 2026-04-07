/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import socket from '../../../lib/socket';
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Loader2, 
  X, 
  DollarSign, 
  Layers 
} from "lucide-react";

const PaidLessonsDash = ({ roleDet }: any) => {
  const [openAddLesson, setOpenAddLesson] = useState(false);
  const [allChaptersFetch, setAllChaptersFetch] = useState<any[]>([]);
  const [checkChapterId, setCheckChapterId] = useState(""); 
  const [selectLessonId, setSelectLessonId] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [dateEx, setDateEx] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const allChapterAndLessons = async () => {
      try {
        const stage = roleDet?.studentExtra?.stage;
        const res = await axios.get(`${process.env.local}/m/chaptersLessons/${process.env.teacherId}/stage/${stage}`);
        setAllChaptersFetch(res.data.data);
      } catch (error) { 
        console.log("Error fetching chapters and lessons:", error); 
      }
    };
    if (roleDet?.studentExtra?.stage) allChapterAndLessons();
  }, [roleDet]);

  const availableLessons = allChaptersFetch.find((c) => c.id === checkChapterId)?.lesson || [];

  const addLesson = async () => {
    if (!selectLessonId.id || !dateEx) {
      setErr("Please select lesson and expiration date");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        student_id: roleDet.student.id,
        lesson_id: selectLessonId.id,
        teacher_id: process.env.teacherId,
        expire: new Date(dateEx + "T23:59:59Z").toISOString(),
        price: selectLessonId.price,
      };
      await axios.post(`${process.env.local}/subscribe`, payload);
      socket.emit('add_Paid');
      setOpenAddLesson(false);
      setCheckChapterId("");
      setSelectLessonId({});
      setDateEx("");
    } catch { 
      setErr("Failed to add lesson ❌"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-600" size={22} />
          <h2 className="text-lg font-bold text-gray-800">Paid Lessons</h2>
        </div>
        <button
          onClick={() => setOpenAddLesson(!openAddLesson)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:scale-95"
        >
          {openAddLesson ? <X size={18} /> : <Plus size={18} />}
          {openAddLesson ? "Cancel" : "Add Lesson"}
        </button>
      </div>

      {/* Add Lesson Animated Form */}
      <AnimatePresence>
        {openAddLesson && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-white border-2 border-blue-100 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Step 1: Select Chapter */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Layers size={14} /> 1. Select Chapter
                </label>
                <select
                  value={checkChapterId}
                  onChange={(e) => {
                    setCheckChapterId(e.target.value);
                    setSelectLessonId({}); 
                  }}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose Chapter...</option>
                  {allChaptersFetch.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Lesson (Filtered from local data) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <BookOpen size={14} /> 2. Choose Lesson
                </label>
                <select
                  disabled={!checkChapterId}
                  value={selectLessonId.id || ""}
                  onChange={(e) => {
                    const lesson = availableLessons.find((l: any) => l.id === e.target.value);
                    if (lesson) setSelectLessonId({ id: lesson.id, price: lesson.price });
                  }}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">Select Lesson...</option>
                  {availableLessons.map((l: any) => (
                    <option key={l.id} value={l.id}>
                        {l.title} - ({l.price} L.E)
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Date & Submit */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Calendar size={14} /> 3. Expiration
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateEx}
                    onChange={(e) => setDateEx(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 p-2 rounded-xl outline-none"
                  />
                  <button
                    disabled={loading || !dateEx || !selectLessonId.id}
                    onClick={addLesson}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 rounded-xl disabled:bg-gray-200 transition-colors"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  </button>
                </div>
              </div>
              {err && <p className="col-span-full text-center text-xs text-red-500 font-medium">{err}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden overflow-y-auto max-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Lesson Title</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Dates (Created - Expire)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {roleDet?.allLessonInSubscribe?.map((sub: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {sub.lesson?.title}
                </td>
                <td className="px-6 py-4 text-emerald-600 font-bold">
                  <DollarSign size={14} className="inline"/> {sub.price}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex flex-col text-[11px]">
                    <span>Created: {format(new Date(sub.date), "dd/MM/yyyy")}</span>
                    <span className="text-red-500">Expires: {format(new Date(sub.expire), "dd/MM/yyyy")}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaidLessonsDash;