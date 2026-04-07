/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  Edit3, 
  X, 
  Loader2, 
  Link as LinkIcon, 
  PlayCircle,
  Save
} from "lucide-react";

const EditPlayer = ({ lesson, setLesson }: any) => {
  const [openModal, setOpenModal] = useState(false);
  const [newUrl, setNewUrl] = useState(lesson.video_url || ""); // سميتها newUrl لدقة المعنى
  const [loading, setLoading] = useState(false);

  const handleEditClick = async () => {
    if (!newUrl) return alert("Please enter a valid video URL");
    setLoading(true);
    try {
      await axios.patch(`${process.env.local}/lessons`, {
        ...lesson,
        video_url: newUrl,
        id: lesson.id,
      });
      
      const update = await axios.get(`${process.env.local}/lessons/${lesson.id}`);
      setLesson(update.data.data);
      setOpenModal(false);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative group w-full aspect-video md:aspect-auto md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 bg-black">
        {/* Overlay Edit Button - يظهر عند تمرير الماوس */}
        <div className="absolute top-4 right-4 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/30 hover:bg-white/40 transition-all font-bold text-sm"
          >
            <Edit3 size={16} />
            Change Video
          </motion.button>
        </div>

        {/* Video Info Tag */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border border-white/10">
            <PlayCircle size={14} className="text-indigo-400" />
            Current Source: {lesson.video_url?.substring(0, 30)}...
          </div>
        </div>

        {/* The Player */}
        <ReactPlayer
          url={lesson.video_url}
          controls
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          config={{
            youtube: { playerVars: { showinfo: 1 } }
          }}
        />
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                    <Video size={20} />
                  </div>
                  <h2 className="text-xl font-black text-gray-800 tracking-tight">Update Source</h2>
                </div>
                <button 
                  onClick={() => setOpenModal(false)}
                  className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-gray-400 uppercase ml-2 flex items-center gap-1">
                    <LinkIcon size={12} /> Video URL
                  </label>
                  <input
                    type="text"
                    onChange={(e) => setNewUrl(e.target.value)}
                    value={newUrl}
                    placeholder="Paste YouTube, Vimeo, or MP4 link..."
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditClick}
                    disabled={loading || !newUrl}
                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Update Video
                      </>
                    )}
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

export default EditPlayer;