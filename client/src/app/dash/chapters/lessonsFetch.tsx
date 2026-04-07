/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  ClipboardCheck, 
  MessageCircle, 
  Layers 
} from "lucide-react";

// المكونات الفرعية الخاصة بك
import SkeletonLesson from "../modal/chapter/skeletonLesson";
import EditNameLesson from "../modal/chapter/editNameLesson";
import EditPlayer from "../modal/chapter/editPlayer";
import EditFilesLesson from "../modal/chapter/editFilesLesson";
import ExamsDash from "./examsDash";
import CommentAllDash from "../modal/chapter/comments/comment";

const LessonsFetch = ({ lessonId }: { lessonId: string | number }): any => {
  const [lesson, setLesson] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  useEffect(() => {
    if (!lessonId) return;
    const fetchLessonDetails = async () => {
      setIsDataLoading(true);
      try {
        const res = await axios.get(`${process.env.local}/lessons/${lessonId}`);
        setLesson(res.data.data);
      } catch (error) {
        console.error("Error fetching lesson details:", error);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchLessonDetails();
  }, [lessonId]);

  // حالة التحميل (Skeleton)
  if (!lesson || isDataLoading) return <SkeletonLesson />;

  // إعدادات الحركة (Variants)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col w-full h-full overflow-y-auto no-scrollbar p-4 md:p-6 space-y-8 bg-gray-50/30"
    >
      {/* القسم الأول: الرأس والمشغل (Main Content) */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <BookOpen size={24} />
            </div>
            <div>
              <EditNameLesson lesson={lesson} setLesson={setLesson} />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Lesson ID: #{lesson.id} • Active Management
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
          <EditPlayer lesson={lesson} setLesson={setLesson} />
        </div>
      </motion.section>

      {/* القسم الثاني: الأدوات التعليمية (Files & Exams) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* الملفات والمذكرات */}
        <motion.section variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FileText size={20} />
            </div>
            <h3 className="font-black text-gray-800 tracking-tight">Attachments & PDF</h3>
          </div>
          <EditFilesLesson lessonId={lesson.id} />
        </motion.section>

        {/* الاختبارات والتقييم */}
        <motion.section variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-50 p-2 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <ClipboardCheck size={20} />
            </div>
            <h3 className="font-black text-gray-800 tracking-tight">Lesson Assessment</h3>
          </div>
          <ExamsDash lessonId={lesson.id} />
        </motion.section>
      </div>

      {/* القسم الثالث: التواصل (Comments) */}
      <motion.section variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <MessageCircle size={20} />
            </div>
            <h3 className="font-black text-gray-800 tracking-tight">Student Discussion</h3>
          </div>
          <div className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase">
            Interaction Hub
          </div>
        </div>
        <CommentAllDash lessonId={lesson.id} />
      </motion.section>
      
      {/* Footer بسيط لإنهاء الصفحة بشكل جمالي */}
      <div className="py-10 text-center">
        <div className="inline-flex items-center gap-2 text-gray-300">
          <Layers size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">End of Content Management</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LessonsFetch;