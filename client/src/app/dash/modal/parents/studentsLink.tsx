/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Trash2, 
  ExternalLink, 
  GraduationCap,
  Loader2 
} from "lucide-react";
import InfoStudent from "../students/infoStudent";
import ViewedLessonsDash from "../students/viewdLesson";
import PaidLessonsDash from "../students/paidLessons";

const StudentsLink = ({ studentId, onRemove }: any) => {
  const [roleDet, setRoleDet] = useState<any>({});
  const [studentDet, setStudentDet] = useState<any>({});
  const [openModel, setOpenModel] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const res = await axios.get(`${process.env.local}/students/${studentId}`);
        setStudentDet(res.data.data);
        const studentDetails = await axios.get(`${process.env.local}/users/${studentId}`, {
          headers: { Authorization: `${getCookie("dataRoleToken")}` },
        });
        setRoleDet(studentDetails.data.data);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };
    fetchStudentDetails();
  }, [studentId]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // لمنع فتح المودال عند الضغط على حذف
    if (window.confirm(`Are you sure you want to unlink ${roleDet.full_name}?`)) {
      setIsDeleting(true);
      try {
        // هنا تضع رابط الـ API الخاص بحذف العلاقة بين ولي الأمر والطالب
        await axios.delete(`${process.env.local}/ps/student/${studentId}`);
        if (onRemove) onRemove(studentId); 
        alert("Student unlinked successfully");
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      {/* Student Link Card */}
      <motion.div 
        whileHover={{ x: 5 }}
        className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl shadow-sm mb-3 group transition-all hover:border-blue-200"
      >
        <div 
          onClick={() => setOpenModel(true)}
          className="flex items-center gap-3 cursor-pointer flex-1"
        >
          <div className="bg-blue-50 p-2 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <User size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
              {roleDet.full_name || "Loading..."}
              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
            </div>
            <div className="text-[10px] text-gray-400 flex items-center gap-1 font-medium italic">
              <GraduationCap size={10} /> {studentDet?.stage || "N/A"}
            </div>
          </div>
        </div>

        {/* Delete Action */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
          title="Unlink Student"
        >
          {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
      </motion.div>

      {/* Student Profile Deep-Dive Modal */}
      <AnimatePresence>
        {openModel && (
          <div className="fixed inset-0 flex justify-center items-center z-[200] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setOpenModel(false)}
            />
            
            <motion.div 
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-[#f8fafc] w-full max-w-4xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Internal Modal Header */}
              <div className="p-4 bg-white border-b border-gray-100 flex items-center gap-4">
                <button 
                  onClick={() => setOpenModel(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                >
                  <ArrowLeft size={24} />
                </button>
                <h3 className="font-black text-gray-800 tracking-tight">Student Insight Card</h3>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <InfoStudent roleDet={roleDet} studentDet={studentDet} />
                </section>
                
                <div className="grid grid-cols-1 gap-6">
                  <PaidLessonsDash roleDet={roleDet} studentDet={studentDet} />
                  <ViewedLessonsDash roleDet={roleDet} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentsLink;