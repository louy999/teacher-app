/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, 
  X, 
  Type, 
  Video, 
  DollarSign, 
  Loader2,
} from "lucide-react";

const AddLessonButton = ({ chapterId, onLessonAdded }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [price, setPrice] = useState<any>("");

  const addLessonHandel = async () => {
    if (!title) return alert("Please enter a title");
    setLoading(true);
    try {

   

      await axios.post(`${process.env.local}/lessons`, {
        title,
        chapter_id: chapterId,
        video_url: videoUrl,
        is_active: true,
        is_paid: Number(price) > 0,
        price: Number(price),
      });

      setOpenModal(false);
      resetForm();
      if (onLessonAdded) await onLessonAdded();
    } catch  {
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setVideoUrl("");
    setPrice("");
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpenModal(true)}
        className="text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        <PlusCircle size={22} />
      </motion.button>

      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">Add Lesson</h2>
                  <p className="text-xs text-gray-400 font-medium">Create new content for this chapter</p>
                </div>
                <button 
                  onClick={() => setOpenModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                {/* Title Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                    <Type size={12} /> Lesson Title
                  </label>
                  <input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    placeholder="Enter lesson title..."
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                  />
                </div>

                {/* Video URL Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                    <Video size={12} /> Video URL (YouTube/Vimeo)
                  </label>
                  <input
                    onChange={(e) => setVideoUrl(e.target.value)}
                    value={videoUrl}
                    placeholder="https://..."
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                  />
                </div>


                {/* Price Input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                    <DollarSign size={12} /> Price (0 for Free)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                      placeholder="0.00"
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-xs uppercase">
                      EGP
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-10">
                <button
                  onClick={() => setOpenModal(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={addLessonHandel}
                  disabled={loading}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Publish Lesson"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddLessonButton;