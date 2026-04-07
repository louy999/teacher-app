/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Phone, Lock, KeyRound, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import socket from "../../../lib/socket";

const AddAssistantsModal = ({ setModalAddAssist }: any) => {
  // --- States (Unchanged) ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [accessList, setAccessList] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false); // Added for button UX

  // --- Static Data (Unchanged) ---
  const allAccess = ["students", "parents", "assistants", "chapters"];

  // --- Logic (Unchanged) ---
  const toggleAccess = (item: string) => {
    if (accessList.includes(item)) {
      setAccessList(accessList.filter((a) => a !== item));
    } else {
      setAccessList([...accessList, item]);
    }
  };

  // --- Save Logic (Unchanged but with added UX loading) ---
  const handleSave = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(
        `${process.env.local}/teacherAssist/teacher/${process.env.teacherId}`
      );
      
      // Check limit logic (Unchanged)
      if (res.data.data.length >= Number(process.env.assist)) {
        setErr(`Plan limit reached. Maximum assistants: ${process.env.assist}`);
        setLoading(false);
        return;
      } else {
        // Post logic (Unchanged)
        await axios.post(`${process.env.local}/m/addUser`, {
          full_name: name,
          phone,
          password,
          role: "assistants",
          teacher_id: process.env.teacherId,
          access: accessList,
        });

        // Reset & Close logic (Unchanged)
        setName("");
        setPhone("");
        setPassword("");
        setAccessList([]);
        socket.emit("add_assist");
        setModalAddAssist(false);
      }
    } catch (error) {
      console.error("Error creating assistant:", error);
      setErr("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Drop-in Animation for Modal ---
  const dropIn = {
    hidden: { y: "-50px", opacity: 0 },
    visible: { 
      y: "0", 
      opacity: 1,
      transition: { duration: 0.3, type: "spring", damping: 25, stiffness: 500 }
    },
    exit: { y: "50px", opacity: 0 }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm left-0 top-0 h-screen w-screen flex items-center justify-center z-[150] p-4">
        {/* Backdrop (Click outside to close - Unchanged Logic via setModalAddAssist) */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={() => setModalAddAssist(false)} 
          className="absolute inset-0"
        />

        {/* Modal Content Card */}
        <motion.div 
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-[480px] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl border border-blue-100 shadow-innershadow-blue-500/10">
                    <UserPlus size={22} strokeWidth={2.5}/>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Add Assistant</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enroll a new team member</p>
                </div>
            </div>
            <button 
              onClick={() => setModalAddAssist(false)} 
              className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-full transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[60vh]">
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <UserPlus size={14} className="text-slate-300"/> Full Name
              </label>
              <div className="relative group">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all placeholder:text-slate-300 placeholder:font-medium"
                    placeholder="E.g., Ahmed Ali"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Phone size={14} className="text-slate-300"/> Primary Phone
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-800 font-bold outline-none tabular-nums focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all placeholder:text-slate-300 placeholder:font-medium"
                    placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Lock size={14} className="text-slate-300"/> Secure Password
              </label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-200 transition-all placeholder:text-slate-300 placeholder:font-medium"
                    placeholder="Enter password"
                />
              </div>
            </div>

            {/* Access control buttons (Logic unchanged) */}
            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-slate-300"/> Dashboard Access Permissons
              </label>
              <div className="flex flex-wrap gap-2.5">
                {allAccess.map((item, idx) => {
                  const isActive = accessList.includes(item);
                  return (
                    <motion.span
                        key={idx}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleAccess(item)} // Logic Unchanged
                        className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter flex items-center gap-2 transition-all border shadow-sm ${
                        isActive
                            ? "bg-blue-600 text-white border-blue-700 shadow-blue-100"
                            : "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                        <ShieldCheck size={14} strokeWidth={isActive ? 3 : 2}/>
                        {item}
                    </motion.span>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Error Message Section (Logic Unchanged) */}
          <AnimatePresence>
            {err && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="mt-6 flex items-center gap-2 bg-rose-50 text-rose-500 p-4 rounded-xl border border-rose-100 text-xs font-bold capitalize">
                    <AlertTriangle size={16}/> {err}
                </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons Footer (Logic Unchanged) */}
          <div className="mt-10 grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalAddAssist(false)} // Logic Unchanged
              className="p-4 rounded-2xl cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={loading} // UX Addition (Disabled while loading)
              onClick={handleSave} // Logic Unchanged
              className="p-4 rounded-2xl cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:bg-slate-200 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20}/> : "Enroll Assistant"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddAssistantsModal;