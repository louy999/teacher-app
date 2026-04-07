import React, { useState } from "react";
import axios from "axios";
import socket from "../../../lib/socket";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { motion, AnimatePresence } from "framer-motion"; // تحسين الحركات
import { User, Lock, GraduationCap, X, Loader2 } from "lucide-react"; // أيقونات احترافية

const AddStudentModal = ({ modal }) => {
  const [err, setErr] = useState("");
  const [full_name, setFull_name] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async () => {
    if (!full_name || !password || !phone || !stage) {
      setErr("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.local}/st/teacher/${process.env.teacherId}`
      );

      if (process.env.limitStudent <= res.data.data.length) {
        setErr("Limit reached for students");
      } else {
        await axios.post(`${process.env.local}/m/addUser`, {
          full_name,
          password,
          phone,
          role: "students",
          teacher_id: process.env.teacherId,
          stage,
        });
        modal(false);
        socket.emit("add_student");
      }
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
      setTimeout(() => setErr(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex justify-center items-center h-screen w-screen bg-black/60 backdrop-blur-sm z-50 p-4">
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl text-black w-full max-w-[450px] overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
            <button 
              onClick={() => modal(false)}
              className="absolute right-4 top-4 hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold">Add New Student</h2>
            <p className="text-blue-100 text-sm mt-1">Register a new student to your class</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Input Group: Full Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User size={16} className="text-blue-500" /> Full Name
              </label>
              <input
                type="text"
                onChange={(e) => setFull_name(e.target.value)}
                value={full_name}
                placeholder="Enter student name"
                className="border border-gray-200 w-full p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {/* Input Group: Phone */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <PhoneInput
                country={"eg"}
                value={phone}
                onChange={(value) => setPhone(value)}
                inputStyle={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb"
                }}
              />
            </div>

            {/* Input Group: Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock size={16} className="text-blue-500" /> Password
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="••••••••"
                className="border border-gray-200 w-full p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Input Group: Stage */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <GraduationCap size={16} className="text-blue-500" /> Student Stage
              </label>
              <select
                className="border border-gray-200 w-full p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                onChange={(e) => setStage(e.target.value)}
                value={stage}
              >
                <option value="" disabled>Choose Grade Level</option>
                {process.env.grade?.split(',').map((grade, index) => (
                  <option key={index} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {err && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center text-sm font-medium text-red-500 bg-red-50 py-2 rounded-md"
              >
                {err}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => modal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleAddStudent}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Student"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddStudentModal;