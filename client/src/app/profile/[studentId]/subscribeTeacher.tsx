/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertCircle, Clock, Lock } from "lucide-react";

const SubscribeTeacher = ({ studentData }: any) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const isAccountActive = studentData?.sub?.active === true;
  const expireDateStr = studentData?.sub?.expire_date;

  useEffect(() => {
    if (isAccountActive && expireDateStr) {
      const calculateTimeLeft = () => {
        const difference = new Date(expireDateStr).getTime() - new Date().getTime();
        setTimeLeft(difference > 0 ? difference : 0);
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000 * 60); // تحديث كل دقيقة

      return () => clearInterval(timer);
    }
  }, [isAccountActive, expireDateStr]);

  if (!isAccountActive) {
    return null; 
    return <div className="text-red-500 font-bold p-4">Account Suspended</div>;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative overflow-hidden p-6 rounded-[2.5rem] border transition-all duration-500 min-w-[300px] ${
          timeLeft > 0 
          ? "bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border-emerald-500/30 backdrop-blur-md" 
          : "bg-gradient-to-br from-red-500/10 to-orange-600/10 border-red-500/30 backdrop-blur-md"
        }`}
      >
        <div className="absolute -right-4 -bottom-4 opacity-10">
           {timeLeft > 0 ? <ShieldCheck size={120} /> : <AlertCircle size={120} />}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${timeLeft > 0 ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-red-500"}`}>
              {timeLeft > 0 ? <ShieldCheck className="text-white" size={20} /> : <Lock className="text-white" size={20} />}
            </div>
            <div>
              <span className="block font-black text-white uppercase text-[10px] tracking-[0.2em]">
                System Access
              </span>
              <span className={`text-[10px] font-bold ${timeLeft > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {timeLeft > 0 ? "SUBSCRIPTION ACTIVE" : "SUBSCRIPTION EXPIRED"}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {timeLeft > 0 ? (
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-xs font-bold mb-1 flex items-center gap-1">
                  <Clock size={12} /> REMAINING TIME
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white tracking-tighter">
                    {days}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">Days</span>
                  <span className="text-2xl font-black text-white tracking-tighter ml-2">
                    {hours}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">Hrs</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                 />
              </div>
            </div>
          ) : (
            <div className="py-2">
              <h4 className="text-2xl font-black text-white mb-1">Access Locked</h4>
              <p className="text-red-300/80 text-sm font-medium">Your plan has reached its end date.</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscribeTeacher;