"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Phone, User } from "lucide-react";

const PersonalDetails = ({ roleDet, studentDet }: any) => {
  return (
    <motion.section 
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col md:flex-row items-center gap-8 text-white"
    >
      <div className="relative group">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl relative"
        >
          <Image
            src={`${studentDet.profile_pic}`}
            alt="Student avatar"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute -bottom-2 -right-2 bg-emerald-400 p-3 rounded-2xl shadow-lg border-4 border-[#6366F1]">
          <User size={20} className="text-white" />
        </div>
      </div>

      <div className="text-center md:text-left space-y-3">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-black tracking-tight"
        >
          {roleDet.full_name}
        </motion.h1>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-sm font-medium">
            <Phone size={16} className="text-indigo-200" />
            {roleDet.phone}
          </div>
          <div className="flex items-center gap-2 bg-emerald-400/20 px-4 py-2 rounded-xl backdrop-blur-md border border-emerald-400/20 text-sm font-bold text-emerald-100">
            <GraduationCap size={18} />
            Grade {studentDet.stage}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default PersonalDetails;