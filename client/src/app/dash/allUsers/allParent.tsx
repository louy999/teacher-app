/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getCookie } from "cookies-next/client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  UserCircle, 
  Phone, 
  Users, 
  UserPlus, 
  Settings2,
  ExternalLink 
} from "lucide-react";

import StudentsLink from "../modal/parents/studentsLink";
import AddStudentParentDash from "../modal/parents/addStudentParentDash";

const AllParent = ({ parentId }: any) => {
  const [dataUser, setDataUser] = useState<any>({});
  const [dataStudentID, setDataStudentID] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [OpenModalStudent, setOpenModalStudent] = useState(false);

  const fetchLinkedStudents = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/ps/parent/${parentId}/teacher/${process.env.teacherId}`
      );
      setDataStudentID(res.data.data);
    } catch (error) {
      console.error("Error fetching linked students:", error);
    }
  }, [parentId]);

  const getParent = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.local}/users/${parentId}`, {
        headers: {
          Authorization: `${getCookie("dataRoleToken")}`,
        },
      });
      setDataUser(res.data.data);
    } catch  {
    }
  }, [parentId]);

  useEffect(() => {
    getParent();
    fetchLinkedStudents();
  }, [fetchLinkedStudents, getParent, parentId]);

  return (
    <>
      {/* Table Row */}
      <tr className="border-t border-gray-100 hover:bg-blue-50/30 transition-colors group">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
              <UserCircle size={20} />
            </div>
            <span className="font-medium text-gray-800">{dataUser.full_name || "Loading..."}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
          <Phone size={14} className="text-emerald-500" />
          {dataUser.phone}
        </td>
        <td className="px-6 py-4 text-right">
          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm"
          >
            <Settings2 size={16} /> Edit
          </button>
        </td>
      </tr>

      {/* Parent Details Modal */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 flex justify-center items-center z-[110] p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#f8fafc] w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                      <Users size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-gray-800">Parent Profile</h3>
                     <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Management Console</p>
                   </div>
                </div>
                <button 
                  onClick={() => setOpenModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {/* Parent Info Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Parent Name</label>
                      <p className="text-gray-700 font-bold flex items-center gap-2">
                        <UserCircle size={18} className="text-blue-500" /> {dataUser.full_name}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase">Contact Number</label>
                      <p className="text-gray-700 font-bold flex items-center gap-2">
                        <Phone size={18} className="text-emerald-500" /> {dataUser.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Linked Students Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                      <ExternalLink size={18} className="text-blue-600" /> Linked Students
                    </h4>
                    <button
                      onClick={() => setOpenModalStudent(true)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <UserPlus size={16} /> Add Student
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {dataStudentID.length > 0 ? (
                      dataStudentID.map((student: any, index: number) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={index}
                        >
                          <StudentsLink studentId={student.student_id} />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center p-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 italic text-sm">
                        No students linked to this parent yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Student Parent Modal */}
      {OpenModalStudent && (
        <AddStudentParentDash
          setOpenModalStudent={setOpenModalStudent}
          dataUser={dataUser}
        />
      )}
    </>
  );
};

export default AllParent;