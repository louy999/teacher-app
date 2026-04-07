/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  UsersRound,
  LayoutGrid
} from "lucide-react";

import AllStudent from "./allStudent";
import AllAssistant from "./allAssistant";
import AllParent from "./allParent";
import AddStudentModal from "../modal/students/addStudent";
import AddParent from "../modal/parents/addParent";
import AddAssistantsModal from "../modal/assistants/addAssistants";
import socket from "../../lib/socket";
const AllUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("user") || "student";

  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [modalAddParent, setModalAddParent] = useState(false);
  const [modalAddAssist, setModalAddAssist] = useState(false);
  
  const [student, setStudent] = useState([]);
  const [fetchParentId, setFetchParentId] = useState([]);
  const [fetchAssistId, setFetchAssistId] = useState([]);
  useEffect(() => {
    if (!search) {
      router.replace("?user=student");
    }
  }, [router, search]);
  //fetch student
  const getStudent = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/m/getAllUserTeacher/${process.env.teacherId}/students`
      );
      setStudent(res.data.data);
    } catch  {
      
    }
  }, []);
  useEffect(() => {
    getStudent();
  }, [getStudent]);

  useEffect(() => {
    socket.on("all_student", getStudent);
    return () => socket.off("all_student", getStudent);
  }, [getStudent]);
  //fetch parent
  const getParent = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/m/getAllUserTeacher/${process.env.teacherId}/parents`
      );
      //filter unique parent_id
      const uniqueParents = res.data.data.filter(
        (parent, index, self) =>
          index === self.findIndex((p) => p.parent_id === parent.parent_id)
      );
      setFetchParentId(uniqueParents);
    } catch  {
    
    }
  }, []);

  useEffect(() => {
    getParent();
  }, [getParent]);

  useEffect(() => {
    socket.on("all_parent", getParent);
    return () => socket.off("all_parent", getParent);
  }, [getParent]);
  //fetch assistant
  const getAssistant = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/m/getAllUserTeacher/${process.env.teacherId}/assistants`
      );

      setFetchAssistId(res.data.data);
    } catch {
     
    }
  }, []);
  useEffect(() => {
    getAssistant();
  }, [getAssistant]);

  useEffect(() => {
    socket.on("all_assist", getAssistant);
    return () => socket.off("all_assist", getAssistant);
  }, [getAssistant]);
const tabs = [
    { id: "student", label: "Students", icon: <Users size={18} /> },
    { id: "parent", label: "Parents", icon: <UserCheck size={18} /> },
    { id: "assistant", label: "Assistants", icon: <ShieldCheck size={18} /> },
  ];
console.log(fetchParentId);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      {/* Header & Tabs */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutGrid className="text-blue-600" /> User Management
            </h1>
            <p className="text-gray-500 text-sm">Manage your academy members and roles</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => router.push(`?user=${tab.id}`)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  search === tab.id 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={search}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Action Bar inside Card */}
            <div className="p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-gray-800 capitalize">{search}s List</h3>
                {search === "student" && (
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-gray-400 italic">Limit:</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${ (student.length / process.env.limitStudent) * 100 >= 80 ? 'bg-red-500' : 'bg-green-500' }`}
                        style={{ width: `${Math.min((student.length / process.env.limitStudent) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{student.length} / {process.env.limitStudent}</span>
                  </div>
                )}
                {search === "parent" && (
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-gray-400 italic">Limit:</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${ (fetchParentId.length / process.env.limitStudent) * 100 >= 80 ? 'bg-red-500' : 'bg-green-500' }`}
                        style={{ width: `${Math.min((fetchParentId.length / process.env.limitStudent) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{fetchParentId.length} / {process.env.limitStudent}</span>
                  </div>
                )}
                {search === "assistant" && (
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-gray-400 italic">Limit:</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${ (fetchAssistId.length / process.env.assist) * 100 >= 80 ? 'bg-red-500' : 'bg-green-500' }`}
                        style={{ width: `${Math.min((fetchAssistId.length / process.env.assist) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{fetchAssistId.length} / {process.env.assist}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (search === "student") setOpenAddStudentModal(true);
                  if (search === "parent") setModalAddParent(true);
                  if (search === "assistant") setModalAddAssist(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-blue-200"
              >
                <UserPlus size={18} />
                Add {search}
              </button>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 text-gray-500 uppercase text-[11px] tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Phone</th>
                    {search === "student" && <th className="px-6 py-4">Grade</th>}
                    {search === "assistant" && <th className="px-6 py-4">Access</th>}
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                  {search === "student" && student.map((s, i) => <AllStudent key={i} student={s} />)}
                  {search === "parent" && fetchParentId.map((p, i) => <AllParent key={i} parentId={p.parent_id} />)}
                  {search === "assistant" && fetchAssistId.map((a, i) => <AllAssistant key={i} assist={a} />)}
                </tbody>
              </table>
              
              {/* Empty State لو مفيش داتا */}
              {((search === "student" && student.length === 0) || 
                (search === "parent" && fetchParentId.length === 0)) && (
                <div className="p-20 text-center flex flex-col items-center opacity-40">
                  <UsersRound size={48} className="mb-2" />
                  <p>No {search}s found</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      {openAddStudentModal && <AddStudentModal modal={setOpenAddStudentModal} />}
      {modalAddParent && <AddParent setModalAddParent={setModalAddParent} />}
      {modalAddAssist && <AddAssistantsModal setModalAddAssist={setModalAddAssist} />}
    </div>
  );
};

export default AllUser;
