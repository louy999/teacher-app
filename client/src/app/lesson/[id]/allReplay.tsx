/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import socket from "../../lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import { CornerDownRight, CheckCircle } from "lucide-react";

const AllReplay: React.FC<AllReplayProps> = ({ commentId }) => {
  const [replayData, setReplayData] = useState<any[]>([]);

  const fetchReplay = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.local}/m/replay/comment/${commentId}`);
      setReplayData(res.data.data);
    } catch (error) { console.error(error); }
  }, [commentId]);

  useEffect(() => {
    fetchReplay();
    socket.on("all_replay", fetchReplay);
    return () => { socket.off("all_replay", fetchReplay); };
  }, [fetchReplay]);

  if (replayData.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 relative">
      <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-slate-100" />
      
      <AnimatePresence>
        {replayData.map((replay) => (
          <motion.div
            key={replay.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 items-start"
          >
            <CornerDownRight className="text-slate-300 mt-2 shrink-0" size={16} />
            
            <div className="flex-1 bg-indigo-50/50 border border-indigo-100 p-4 rounded-3xl relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative h-6 w-6 rounded-full overflow-hidden">
                   <Image 
                    src={`${process.env.img}/image/${replay.extraData?.profile_pic || 'default.png'}`}
                    alt="Admin" fill className="object-cover"
                   />
                </div>
                <span className="font-black text-xs text-indigo-700 flex items-center gap-1">
                  {replay.user.full_name}
                  <CheckCircle size={10} className="fill-indigo-600 text-white" />
                </span>
                <span className="text-[10px] text-indigo-400 font-medium">
                  • {new Date(replay.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {replay.text}
              </p>

              {replay.file_url && (
                <div className="mt-3">
                   {/* نفس منطق الملفات والصور في التعليق الأساسي */}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
export default AllReplay