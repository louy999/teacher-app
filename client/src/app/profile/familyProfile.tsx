/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { jwtVerify } from "jose";
import axios from "axios";
import StudentMapFetch from "./studentMapFetch";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

const FamilyProfile = () => {
  const [dataParent, setDataParent] = useState([]);
  const value = getCookie("dataRoleToken");

  useEffect(() => {
    const getData = async () => {
      if (!value) return;
      try {
        const decoded: any = await jwtVerify(value, new TextEncoder().encode(process.env.TOKEN_SECRET));
        const res = await axios.get(`${process.env.local}/ps/parent/${decoded.payload.user.id}/teacher/${process.env.teacherId}`);
        setDataParent(res.data.data);
      } catch (e) { console.log(e); }
    };
    getData();
  }, [value]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <Users size={28} />
            <span className="text-sm font-black uppercase tracking-widest">Parent Dashboard</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Family Profiles</h1>
          <p className="text-slate-500 font-medium">Manage your children&apos;s educational journey in one place.</p>
        </div>
        <div className="bg-indigo-50 px-6 py-4 rounded-3xl border border-indigo-100">
           <span className="block text-[10px] font-black uppercase text-indigo-400">Total Registered</span>
           <span className="text-2xl font-black text-indigo-700">{dataParent.length} Children</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataParent.map((par: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StudentMapFetch dataStudent={par} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FamilyProfile;