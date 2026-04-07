/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // تحريكات
import { UserPlus, Phone, Lock, Users, X, Loader2, UserCheck } from "lucide-react"; // أيقونات
import socket from "../../../lib/socket";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import MapInfoStudent from "./mapInfoStudent";

const AddParent = ({ setModalAddParent }: any) => {
  const [err, setErr] = useState("");
  const [full_name, setFull_name] = useState("");
  const [password, setPassword] = useState("");
  const [allDataStudentId, setAllDataStudentId] = useState([]);
  const [idSTudent, setIdSTudent] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddParent = async () => {
    if (!full_name || !phone || !password || !idSTudent) {
      setErr("Please fill all fields and select a student");
      return;
    }
    
    setLoading(true);
    try {
      // 1. إضافة ولي الأمر
      const addUser = await axios.post(`${process.env.local}/m/addUser`, {
        full_name,
        password,
        phone,
        role: "parents",
      });

      const parentId = addUser.data.data.user.id;

      // 2. التحقق من وجود علاقة سابقة
      const res = await axios.get(
        `${process.env.local}/ps/parent/${parentId}/teacher/${process.env.teacherId}/student/${idSTudent}`
      );

      if (res.data.data.length) {
        setErr("This student is already linked to this parent.");
      } else {
        // 3. ربط ولي الأمر بالطالب
        await axios.post(`${process.env.local}/ps`, {
          teacher_id: process.env.teacherId,
          parent_id: parentId,
          student_id: idSTudent,
        });
        
        setModalAddParent(false);
        socket.emit("add_parent");
      }
    } catch (error: any) {
      setErr(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex justify-center items-center h-screen w-screen bg-black/60 backdrop-blur-sm z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl text-black w-full max-w-[450px] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white relative">
            <button 
              onClick={() => setModalAddParent(false)}
              className="absolute right-4 top-4 hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <UserPlus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Add New Parent</h2>
                <p className="text-blue-100 text-xs">Register parent and link to student</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Parent Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-1">
                <UserCheck size={14} /> Full Name
              </label>
              <input
                type="text"
                placeholder="Enter parent's full name"
                onChange={(e) => setFull_name(e.target.value)}
                value={full_name}
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-1">
                <Phone size={14} /> Phone Number
              </label>
              <PhoneInput
                country={"eg"}
                value={phone}
                onChange={(value) => setPhone(value)}
                inputStyle={{
                  width: "100%",
                  height: "46px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px"
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-1">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                placeholder="Set account password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            {/* Link Student Selection */}
            <div className="space-y-1 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1 ml-1 mt-2">
                <Users size={14} /> Link to Student
              </label>
              <select
                onChange={(e) => setIdSTudent(e.target.value)}
                value={idSTudent}
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm font-medium"
              >
                <option value="">Select the student...</option>
                {allDataStudentId.map((id, i) => (
                  <MapInfoStudent id={id} key={i} />
                ))}
              </select>
            </div>

            {/* Error Message */}
            {err && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 text-red-600 text-[12px] p-3 rounded-xl font-medium border border-red-100 text-center"
              >
                {err}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setModalAddParent(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleAddParent}
                className="flex-[1.5] py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Create Parent"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddParent;