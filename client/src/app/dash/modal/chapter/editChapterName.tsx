/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Settings2, 
  Type, 
  GraduationCap, 
  Loader2, 
  Save 
} from "lucide-react";

const EditChapterName = ({
  setOpenModelEditChapter,
  setNewName,
  newName,
  setNewStage,
  dataTeacher,
  newStage,
  onSubmitEdit,
  loading,
}: {
  setOpenModelEditChapter: (v: boolean) => void;
  setNewName: (v: string) => void;
  newName: string;
  setNewStage: (v: string) => void;
  dataTeacher: string[]; // بما أنها أصبحت Array من الـ env
  newStage: string;
  loading: boolean;
  onSubmitEdit: () => void;
}) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex justify-center items-center p-4">
        {/* Backdrop مع تأثير التغبيش */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpenModelEditChapter(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                <Settings2 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-800 tracking-tight">Edit Chapter</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Update chapter details</p>
              </div>
            </div>
            <button
              onClick={() => setOpenModelEditChapter(false)}
              className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitEdit();
            }}
            className="space-y-6"
          >
            {/* Chapter Name Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                <Type size={12} /> Chapter Title
              </label>
              <input
                type="text"
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm font-semibold text-gray-700"
                placeholder="Enter new name..."
              />
            </div>

            {/* Stage/Grade Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                <GraduationCap size={12} /> Assigned Stage
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm font-semibold text-gray-700 appearance-none cursor-pointer"
                  onChange={(e) => setNewStage(e.target.value)}
                  value={newStage}
                >
                  <option value="" disabled>Select Grade Level</option>
                  {dataTeacher.map((grade, index) => (
                    <option key={index} value={grade.trim()}>
                      {grade.trim()}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <GraduationCap size={16} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setOpenModelEditChapter(false)}
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 bg-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditChapterName;