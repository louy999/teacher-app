/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import AllReplay from "./allReplay";
import Link from "next/link";
import socket from "../../lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Maximize2 } from "lucide-react";

const CommentsContainer = ({ lessonId, showOnlyAdminApproved, title }: any) => {
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.local}/m/getComments/lesson/${lessonId}`);
      setCommentsData(res.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchData();
    socket.on("all_com", fetchData);
    socket.on("all_comment", fetchData);
    return () => {
      socket.off("all_com", fetchData);
      socket.off("all_comment", fetchData);
    };
  }, [fetchData]);

  const filteredComments = commentsData.filter(c => c.shown === showOnlyAdminApproved);

  if (loading) return <div className="animate-pulse space-y-4 p-4"><div className="h-20 bg-slate-100 rounded-2xl" /></div>;

  return (
    <div className="mt-8">
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              className="relative max-w-5xl w-full h-[80vh]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <Image
                src={selectedImage}
                alt="Full size"
                fill
                className="object-contain"
                quality={100}
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
          {filteredComments.length}
        </span>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredComments.map((comment) => (
            <motion.div
              key={comment.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={comment.extraData?.profile_pic || "/default-profile.png"}            
                    alt="User" fill className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {comment.user.full_name} 
                    </span>
                    {!showOnlyAdminApproved && (
                      <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded-md font-bold">Private</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(comment.date).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Comment Text */}
              <div className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
                {comment.text}
              </div>

              {/* Attachments */}
              {comment.file_url && (
                <div className="mb-4">
                  {comment.file_type === "image" ? (
                    <div 
                      className="relative group h-48 w-full max-w-xs rounded-2xl overflow-hidden border border-slate-100 cursor-zoom-in"
                      onClick={() => setSelectedImage(comment.file_url)}
                    >
                      <Image 
                        src={comment.file_url} 
                        alt="Attachment" 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 text-white">
                          <Maximize2 size={20} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link href={comment.file_url} target="_blank" className="inline-flex items-center gap-2 p-3 bg-indigo-50 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-all border border-indigo-100">
                      <FileText size={16} /> Download Attachment
                    </Link>
                  )}
                </div>
              )}

              <AllReplay commentId={comment.id} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default CommentsContainer;