/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  X, 
  Loader2, 
  UserCircle2, 
  AlertCircle,
  Link as LinkIcon
} from "lucide-react";
import MapInfoStudent from "./mapInfoStudent";

const AddStudentParentDash = ({ setOpenModalStudent, dataUser }: any) => {
  const [saving, setSaving] = useState(false);
  const [allDataStudentId, setAllDataStudentId] = useState([]);
  const [idSTudent, setIdSTudent] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const allStudentTeacher = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/st/teacher/${process.env.teacherId}`
        );
        setAllDataStudentId(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    allStudentTeacher();
  }, []);

  const addStudent = async () => {
    if (!idSTudent) {
      setErr("Please select a student first");
      return;
    }

    setSaving(true);
    setErr("");
    try {
      const res = await axios.get(
        `${process.env.local}/ps/parent/${dataUser.id}/teacher/${process.env.teacherId}/student/${idSTudent}`
      );
      
      if (res.data.data.length) {
        setErr("This student is already linked to this parent.");
      } else {
        const res = await axios.post(`${process.env.local}/ps`, {
          teacher_id: process.env.teacherId,
          parent_id: dataUser.id,
          student_id: idSTudent,
        });
        setOpenModalStudent(false);
        console.log(res.data);
        
      }
    } catch (error) {
      console.error(error);
      setErr("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex justify-center items-center w-screen h-screen bg-black/70 backdrop-blur-md z-[150] p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Header Section */}
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                <LinkIcon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                  Link Student
                </h2>
                <p className="text-xs text-gray-500 font-medium">To: {dataUser.full_name}</p>
              </div>
            </div>
            <button 
              onClick={() => setOpenModalStudent(false)}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6 text-center">
            {/* Context Icon */}
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 border-4 border-white shadow-sm">
              <UserCircle2 size={32} />
            </div>

            {/* Selection Area */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                Choose Student
              </label>
              <select
                onChange={(e) => setIdSTudent(e.target.value)}
                value={idSTudent}
                className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-semibold text-gray-700 shadow-sm appearance-none"
              >
                <option value="">Select student from list...</option>
                {allDataStudentId.map((id, i) => (
                  <MapInfoStudent id={id} key={i} />
                ))}
              </select>
            </div>

            {/* Error Message */}
            {err && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100"
              >
                <AlertCircle size={16} />
                {err}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                disabled={saving || !idSTudent}
                onClick={addStudent}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Linking...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Link Student
                  </>
                )}
              </button>
              <button
                className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
                onClick={() => setOpenModalStudent(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddStudentParentDash;