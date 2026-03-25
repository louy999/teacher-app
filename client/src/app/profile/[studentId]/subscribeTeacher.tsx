/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertCircle, Calendar } from "lucide-react";

const SubscribeTeacher = ({ studentId }: any) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... Fetch logic remains similar ...
    // SetTimeLeft(diff)
    setLoading(false);
  }, [studentId.id]);

  if (loading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] min-w-[280px]"
    >
      <div className="flex items-center gap-3 mb-4">
        {timeLeft > 0 ? (
          <div className="p-2 bg-emerald-400 rounded-xl">
            <ShieldCheck className="text-white" size={20} />
          </div>
        ) : (
          <div className="p-2 bg-orange-400 rounded-xl">
            <AlertCircle className="text-white" size={20} />
          </div>
        )}
        <span className="font-bold text-white uppercase text-xs tracking-widest">
          Subscription Status
        </span>
      </div>

      <div className="space-y-1">
        {timeLeft > 0 ? (
          <>
            <p className="text-indigo-100 text-xs font-medium">Valid for next:</p>
            <p className="text-2xl font-black text-white tabular-nums">
               {Math.floor(timeLeft / (1000 * 60 * 60 * 24))} Days left
            </p>
          </>
        ) : (
          <p className="text-orange-200 font-bold">Plan Expired</p>
        )}
      </div>
    </motion.div>
  );
};
export default  SubscribeTeacher