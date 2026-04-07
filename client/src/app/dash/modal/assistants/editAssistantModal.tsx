/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import { X, ShieldCheck, UserCog, Phone, Save, Loader2 } from "lucide-react";
import socket from "../../../lib/socket";

const EditAssistantModal = ({
  setOpenModalEditAssistant,
  assist,
  dataUser,
}: any) => {
  // --- States (Unchanged) ---
  const [accessList, setAccessList] = useState<string[]>(
    assist.extraDataAccess.access || []
  );
  const [loading, setLoading] = useState(false);

  // --- Static Data (Unchanged) ---
  const allAccess = ["assistants", "students", "parents", "chapters"];

  // --- Logic (Unchanged) ---
  const toggleAccess = (item: string) => {
    if (accessList.includes(item)) {
      setAccessList(accessList.filter((acc) => acc !== item));
    } else {
      setAccessList([...accessList, item]);
    }
  };

  // --- Update Logic (Unchanged but with added UX loading) ---
  const editAccess = async () => {
    setLoading(true);
    try {
      await axios.patch(`${process.env.local}/assistants`, {
        profile_pic: assist.extraDataAccess.profile_pic,
        access: accessList,
        id: assist.extraDataAccess.id,
      });
      setOpenModalEditAssistant(false);
      socket.emit("add_assist");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={() => setOpenModalEditAssistant(false)}
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100"
      >
        {/* Header Section */}
        <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
                    <UserCog size={22} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Edit Assistant</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update permissions & access</p>
                </div>
            </div>
            <button 
                onClick={() => setOpenModalEditAssistant(false)}
                className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-full transition-all active:scale-90"
            >
                <X size={24} />
            </button>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8">
            {/* Assistant Profile Summary */}
            <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="relative shrink-0">
                    <Image
                        src={`${assist.extraDataAccess.profile_pic}`}
                        alt="assistant"
                        width={80}
                        height={80}
                        className="rounded-2xl object-cover border-4 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{dataUser.full_name}</h3>
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                            <Phone size={12} className="text-indigo-500" /> {dataUser.phone}
                        </span>
                        <span className="inline-flex w-fit bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                            {dataUser.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Access Management Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <ShieldCheck size={16} className="text-indigo-600" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Dashboard Permissions</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {allAccess.map((item, index) => {
                        const isActive = accessList.includes(item);
                        return (
                            <motion.button
                                key={index}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => toggleAccess(item)} // Logic Unchanged
                                className={`flex items-center justify-between p-4 rounded-2xl border font-black text-xs transition-all ${
                                    isActive 
                                    ? "bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-100" 
                                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                                }`}
                            >
                                <span className="capitalize">{item}</span>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isActive ? "bg-white border-white" : "border-slate-200"}`}>
                                    {isActive && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                                </div>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 pt-0 flex gap-4">
            <button
                onClick={() => setOpenModalEditAssistant(false)}
                className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-sm hover:bg-slate-200 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={editAccess} // Logic Unchanged
                disabled={loading}
                className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:bg-indigo-400"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {loading ? "Saving Changes..." : "Save Permissions"}
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditAssistantModal;