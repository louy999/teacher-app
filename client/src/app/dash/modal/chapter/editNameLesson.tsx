/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit3, 
  Coins, 
  X, 
  Check, 
  Loader2, 
  Type,
} from "lucide-react";

const EditNameLesson = ({ lesson, setLesson }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalPrice, setOpenModalPrice] = useState(false);
  const [newTitle, setNewTitle] = useState(lesson.title || "");
  const [priceUpdate, setPriceUpdate] = useState(lesson.price);
  const [loading, setLoading] = useState(false);

  // دالة موحدة لتحديث أي حقل في الدرس
  const updateLesson = async (payload: any, closeModals = true) => {
    setLoading(true);
    try {
      await axios.patch(`${process.env.local}/lessons`, {
        ...lesson,
        ...payload,
        id: lesson.id,
      });
      const res = await axios.get(`${process.env.local}/lessons/${lesson.id}`);
      setLesson(res.data.data);
      if (closeModals) {
        setOpenModal(false);
        setOpenModalPrice(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 py-2">
        {/* Title Badge */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => setOpenModal(true)}
          className="group flex items-center gap-3 bg-white border border-gray-100 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all"
        >
          <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Type size={16} />
          </div>
          <span className="text-sm font-bold text-gray-700">{lesson.title}</span>
          <Edit3 size={14} className="text-gray-300 group-hover:text-indigo-400" />
        </motion.div>

        {/* Price Badge */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => setOpenModalPrice(true)}
          className="group flex items-center gap-3 bg-white border border-gray-100 px-4 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 cursor-pointer transition-all"
        >
          <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Coins size={16} />
          </div>
          <span className="text-sm font-black text-emerald-700">{lesson.price} <small className="text-[10px]">EGP</small></span>
          <Edit3 size={14} className="text-gray-300 group-hover:text-emerald-400" />
        </motion.div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
          <span className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-tighter">Status</span>
          <div 
            onClick={() => !loading && updateLesson({ is_active: !lesson.is_active }, false)}
            className={`relative w-14 h-8 rounded-xl cursor-pointer p-1 transition-colors duration-300 ${lesson.is_active ? 'bg-indigo-600' : 'bg-gray-300'}`}
          >
            <motion.div 
              animate={{ x: lesson.is_active ? 24 : 0 }}
              className="w-6 h-6 bg-white rounded-lg shadow-sm flex items-center justify-center"
            >
              {loading ? <Loader2 size={10} className="animate-spin text-indigo-600" /> : 
                lesson.is_active ? <Check size={12} className="text-indigo-600" /> : <X size={12} className="text-gray-400" />
              }
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reusable Modal for Name and Price */}
      <AnimatePresence>
        {(openModal || openModalPrice) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setOpenModal(false); setOpenModalPrice(false); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-800 tracking-tight">
                  {openModal ? "Edit Lesson Name" : "Edit Lesson Price"}
                </h2>
                <p className="text-xs text-gray-400 font-medium">Update the information for your students</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={openModal ? "text" : "number"}
                    value={openModal ? newTitle : priceUpdate}
                    onChange={(e) => openModal ? setNewTitle(e.target.value) : setPriceUpdate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all"
                    placeholder={openModal ? "Enter title..." : "0.00"}
                  />
                  {openModalPrice && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xs">EGP</span>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => openModal ? updateLesson({ title: newTitle }) : updateLesson({ price: Number(priceUpdate), is_paid: Number(priceUpdate) > 0 })}
                    disabled={loading}
                    className="flex-[2] bg-indigo-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Save</>}
                  </button>
                  <button
                    onClick={() => { setOpenModal(false); setOpenModalPrice(false); }}
                    className="flex-1 bg-gray-100 text-gray-500 p-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    <X size={18} className="mx-auto" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditNameLesson;