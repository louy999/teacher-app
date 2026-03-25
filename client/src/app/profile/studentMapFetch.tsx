/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { getCookie } from "cookies-next/client";
import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, UserCircle } from "lucide-react";

const StudentMapFetch = ({ dataStudent }: { dataStudent: any }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, userRes] = await Promise.all([
          axios.get(`${process.env.local}/users/${dataStudent.student_id}`, {
            headers: { Authorization: `${getCookie("dataRoleToken")}` }
          }),
          axios.get(`${process.env.local}/students/${dataStudent.student_id}`)
        ]);
        setUser({ ...res.data.data, ...userRes.data.data });
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [dataStudent]);

  if (loading || !user) return <div className="h-48 bg-white rounded-[2rem] animate-pulse" />;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute -right-4 -top-4 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <GraduationCap size={120} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Profile Pic with Ring */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-indigo-100 group-hover:border-indigo-500 transition-colors duration-500">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-100">
              <Image
                src={user.profile_pic}
                alt="student"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md text-indigo-600">
            <UserCircle size={20} />
          </div>
        </div>

        {/* Student Info */}
        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {user.full_name}
        </h3>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full text-slate-500 text-xs font-bold mb-6">
          <GraduationCap size={14} />
          Grade {user.stage}
        </div>

        {/* Action Button */}
        <Link 
          href={`/profile/${dataStudent.student_id}`}
          className="w-full py-3.5 bg-slate-900 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 hover:shadow-indigo-200"
        >
          View Full Profile
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default StudentMapFetch;