"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, Loader2, Sparkles } from "lucide-react";
import socket from "../../lib/socket";

import LessonsSubscribe from "./lessonsSubscribe";
import TeacherSubscribe from "./teacherSubscribe";

const SubscribeDash = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("user") || "lesson"; 

  const [dataSubTeacher, setDataSubTeacher] = useState([]);
  const [dataSubLessons, setDataSubLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (search === "teacher") {
        const res = await axios.get(
          `${process.env.local}/m/transTeacher/teacher/${process.env.teacherId}`
        );
        setDataSubTeacher(res.data.data);
      } else if (search === "lesson") {
        const res = await axios.get(
          `${process.env.local}/m/subscribeLesson/teacher/${process.env.teacherId}`
        );
        setDataSubLessons(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();

    socket.on("all_teacher", fetchData);

    return () => {
      socket.off("all_teacher", fetchData);
    };
  }, [fetchData]);

  const handleTabChange = (type: string) => {
    router.push(`/dash/sub?user=${type}`, { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Sparkles className="text-amber-400" size={28} />
            Subscriptions Management
          </h1>
          <p className="text-gray-400 font-medium mt-1">Manage and track all student payment requests</p>
        </div>

        {/* Custom Modern Tabs */}
        <div className="bg-gray-100/80 p-1.5 rounded-[1.5rem] flex items-center gap-1 border border-gray-200 w-fit">
          <button
            onClick={() => handleTabChange("lesson")}
            className={`relative px-6 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
              search === "lesson" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <BookOpen size={18} />
            Lessons
            {search === "lesson" && (
              <motion.div
                layoutId="sub-active-tab"
                className="absolute inset-0 bg-white shadow-sm rounded-2xl -z-10 border border-gray-100"
              />
            )}
          </button>

          <button
            onClick={() => handleTabChange("teacher")}
            className={`relative px-6 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
              search === "teacher" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Users size={18} />
            Teachers
            {search === "teacher" && (
              <motion.div
                layoutId="sub-active-tab"
                className="absolute inset-0 bg-white shadow-sm rounded-2xl -z-10 border border-gray-100"
              />
            )}
          </button>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Content Area */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-4"
            >
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <p className="font-bold text-xs uppercase tracking-widest">Syncing Data...</p>
            </motion.div>
          ) : (
            <motion.div
              key={search}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {search === "lesson" ? (
                <LessonsSubscribe dataSubLessons={dataSubLessons} />
              ) : (
                <TeacherSubscribe dataSubTeacher={dataSubTeacher} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SubscribeDash;