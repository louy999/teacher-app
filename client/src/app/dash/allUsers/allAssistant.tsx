/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Phone, User } from "lucide-react";
import EditAssistantModal from "../modal/assistants/editAssistantModal";

const AllAssistant = ({ assist }: any) => {
  const [openModalEditAssistant, setOpenModalEditAssistant] = useState(false);

  return (
    <>
      <motion.tr 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
        className="group border-b border-slate-50 transition-colors duration-200"
      >
        {/* Full Name with Icon */}
        <td className="h-[72px] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <User size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 font-bold text-sm tracking-tight leading-none mb-1">
                {assist.extraDataUser.full_name}
              </span>
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                ID: {assist.extraDataUser.id?.split('-')[0] || "N/A"}
              </span>
            </div>
          </div>
        </td>

        {/* Phone with Masked Style */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm tabular-nums">
            <Phone size={14} className="text-slate-300" />
            {assist.extraDataUser.phone}
          </div>
        </td>

        {/* Access Badges - تحويل النص لـ Badges */}
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1.5 max-w-[300px]">
            {assist.extraDataAccess.access?.map((item: string, idx: number) => (
              <span 
                key={idx}
                className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-slate-200/50"
              >
                {item}
              </span>
            ))}
            {(!assist.extraDataAccess.access || assist.extraDataAccess.access.length === 0) && (
              <span className="text-slate-300 text-xs italic font-medium italic">No Access</span>
            )}
          </div>
        </td>

        {/* Action Button */}
        <td className="px-6 py-4 text-right">
          <button
            onClick={() => setOpenModalEditAssistant(true)}
            className="inline-flex items-center gap-2 bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 border border-indigo-100 hover:border-indigo-600 shadow-sm hover:shadow-indigo-100 active:scale-95"
          >
            <Edit3 size={14} />
            Edit
          </button>
        </td>
      </motion.tr>

      {/* Modal - Unchanged Logic */}
      {openModalEditAssistant && (
        <EditAssistantModal
          assist={assist}
          dataUser={assist.extraDataUser}
          setOpenModalEditAssistant={setOpenModalEditAssistant}
        />
      )}
    </>
  );
};

export default AllAssistant;