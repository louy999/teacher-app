/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, UserCircle, CreditCard, PlayCircle, Loader2, 
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2 
} from "lucide-react";
import InfoStudent from "./infoStudent";
import PaidLessonsDash from "./paidLessons";
import ViewedLessonsDash from "./viewdLesson";
import AllViewsExam from '../../../profile/[studentId]/allViewsExam';
import socket from '../../../lib/socket';

const EditStudent = ({ dataStudent, setOpenModal }: any) => {
  const [dataUser, setDataUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const dropIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { scale: 0.9, opacity: 0 }
  };

  const allDataProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.local}/m/profile/student/${dataStudent.id}/teacher/${process.env.teacherId}`);
      const data = await res.json();
      setDataUser(data.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, [dataStudent.id]);

  useEffect(() => {
    if (dataStudent?.id) allDataProfile();
  }, [allDataProfile, dataStudent]);

  useEffect(() => {
    socket.on('all_paid', allDataProfile);
    return () => {
      socket.off('all_paid', allDataProfile);
    };
  }, [allDataProfile]);

  // --- دالة تغيير حالة الطالب (Active/Inactive) ---
  const toggleStudentStatus = async () => {
    setUpdatingStatus(true);
    try {
      const currentStatus = dataUser?.student?.active;
      const newStatus = !currentStatus;

      // إرسال طلب التحديث للسيرفر
      // تفترض هذه الدالة وجود مسار API جاهز مثل: PATCH /api/students/:id/status
      await axios.patch(`${process.env.local}/students/${dataStudent.id}/status`, {
        active: newStatus,
        teacherId: process.env.teacherId
      });

      // تحديث البيانات محلياً فوراً أو إعادة جلبها
      await allDataProfile(); 
      setShowConfirmModal(false); // إغلاق مودال التأكيد
      
    } catch (error) {
      console.error("Failed to update student status:", error);
      // هنا يمكنك إضافة تنبيه خطأ للمستخدم (Toast Notification)
    } finally {
      setUpdatingStatus(false);
    }
  };

  // تحديد هل الطالب نشط حالياً أم لا
  const isStudentActive = dataUser?.student?.active === true;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-slate-900/40 backdrop-blur-md z-[100] p-4">
      <motion.div
        variants={dropIn}
        initial="hidden" animate="visible" exit="exit"
        className="w-full max-w-5xl bg-[#f8fafc] rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white relative"
      >
        {/* --- Header --- */}
        <div className="bg-white/80 backdrop-blur-md px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <UserCircle size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Student Intelligence</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Comprehensive Profile Review</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* --- زر الحالة الجديد (الديناميكي) --- */}
            {dataUser && (
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowConfirmModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border ${
                  isStudentActive 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" 
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                }`}
              >
                {isStudentActive ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                {isStudentActive ? "Active" : "Inactive"}
              </motion.button>
            )}

            {/* زر الإغلاق */}
            <button 
              onClick={() => setOpenModal(false)}
              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* --- Content Body --- */}
        <div className="overflow-y-auto p-8 space-y-8 custom-scrollbar relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {loading ? (
              // --- Loading State Animation ---
              <motion.div
                key="loader"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#f8fafc] z-10"
              >
                <div className="relative flex items-center justify-center">
                    <Loader2 className="text-indigo-600 animate-spin" size={48} />
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute w-20 h-20 bg-indigo-500 rounded-full -z-10" 
                    />
                </div>
                <p className="mt-4 text-slate-500 font-black text-xs uppercase tracking-[0.3em] animate-pulse">
                    Analyzing Data...
                </p>
              </motion.div>
            ) : (
              // --- Main Content ---
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Info Section */}
                <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                  <InfoStudent roleDet={dataUser} />
                </section>

                {/* Paid Lessons Section */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 px-4">
                    <CreditCard className="text-emerald-500" size={20} />
                    <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider">Financial & Access</h3>
                  </div>
                  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <PaidLessonsDash roleDet={dataUser} />
                  </div>
                </section>

                {/* Watch History & Exams */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 px-4">
                    <PlayCircle className="text-indigo-500" size={20} />
                    <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider">Learning Progress</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <ViewedLessonsDash roleDet={dataUser} />
                    </div>
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <AllViewsExam roleDet={dataUser} />
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- مودال التأكيد المزدوج (Premium Confirmation Modal) --- */}
        <AnimatePresence>
          {showConfirmModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
              {/* Backdrop الداخلي */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => !updatingStatus && setShowConfirmModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              
              {/* كارت التأكيد */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border border-slate-100"
              >
                <div className={`p-4 rounded-2xl inline-block mb-6 ${isStudentActive ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}>
                  {isStudentActive ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
                </div>

                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
                  {isStudentActive ? "Deactivate Student?" : "Activate Student?"}
                </h3>
                
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
                  {isStudentActive 
                    ? `Are you sure you want to deactivate ${dataUser?.student?.full_name}? They will lose access to all course materials immediately.`
                    : `Are you sure you want to activate ${dataUser?.student?.full_name}? They will regain access to their enrolled courses.`
                  }
                </p>

                {/* أزرار الأكشن */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    disabled={updatingStatus}
                    onClick={() => setShowConfirmModal(false)}
                    className="bg-slate-100 text-slate-600 font-black py-4 rounded-2xl text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={updatingStatus}
                    onClick={toggleStudentStatus}
                    className={`font-black py-4 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 text-white shadow-lg disabled:opacity-50 ${
                      isStudentActive 
                      ? "bg-rose-600 hover:bg-rose-700 shadow-rose-200" 
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    }`}
                  >
                    {updatingStatus ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      isStudentActive ? "Yes, Deactivate" : "Yes, Activate"
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EditStudent;