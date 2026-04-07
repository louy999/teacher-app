/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import EditStudent from "../modal/students/editStudent";
import { motion } from "framer-motion";
import { UserCog, Phone, GraduationCap, ShieldCheck, ShieldAlert } from "lucide-react"; 

const AllStudent = ({ student }: any) => {
  const [openModal, setOpenModal] = useState(false);

  // Check if student is active from the data
  const isActive = student.active === true;

  return (
    <>
      <motion.tr 
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        className={`border-t border-gray-100 transition-colors group cursor-default ${
          isActive ? "hover:bg-blue-50/40" : "bg-gray-50/50 opacity-70"
        }`}
      >
        {/* Status Indicator & Name */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${
              isActive 
              ? "bg-emerald-100 text-emerald-600 group-hover:bg-blue-100 group-hover:text-blue-600" 
              : "bg-gray-200 text-gray-400"
            }`}>
              {isActive ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
            </div>
            <div className="flex flex-col">
              <span className={`font-bold ${isActive ? "text-gray-800" : "text-gray-400 line-through"}`}>
                {student.extraDataUser.full_name}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? "text-emerald-500" : "text-gray-400"}`}>
                {isActive ? "Active Member" : "Deactivated"}
              </span>
            </div>
          </div>
        </td>

        {/* Phone Number */}
        <td className="px-6 py-4">
          <div className={`flex items-center gap-2 ${isActive ? "text-gray-600" : "text-gray-400"}`}>
            <Phone size={14} className={isActive ? "text-emerald-500" : "text-gray-300"} />
            <span className="text-sm font-medium tabular-nums">
              {student.extraDataUser.phone}
            </span>
          </div>
        </td>

        {/* Grade/Stage */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
              isActive 
              ? "bg-blue-50 text-blue-700 border-blue-100" 
              : "bg-gray-100 text-gray-400 border-gray-200"
            }`}>
              <GraduationCap size={14} />
              {student.extraDataAccess.stage}
            </span>
          </div>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 text-right">
          <button
            onClick={() => setOpenModal(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
              isActive 
              ? "bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-md active:scale-95" 
              : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <UserCog size={16} />
            {isActive ? "Profile / Edit" : "Manage Access"}
          </button>
        </td>
      </motion.tr>

      {/* Modal */}
      {openModal && (
        <EditStudent
          setOpenModal={setOpenModal}
          dataStudent={student.extraDataAccess}
          // Pass status to modal if needed to reactivate
          isActive={isActive} 
        />
      )}
    </>
  );
};

export default AllStudent;