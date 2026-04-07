/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import axios from "axios";
import socket from "../../lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  DollarSign, 
  Activity, 
  User, 
  ChevronRight, 
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const TeacherSubscribe = ({ dataSubTeacher }: any) => {
  const [expireDateModal, setExpireDateModal] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  
  const [newPrice, setNewPrice] = useState("");
  const [newExpire, setNewExpire] = useState("");
  const [newActive, setNewActive] = useState<any>(null);

  const updatedTeacherSub = async (price: any, active: any, expire_date: any) => {
    try {
      await axios.patch(`${process.env.local}/teacherSub/`, {
        id: dataSubTeacher.teacherSub.id,
        price,
        active,
        expire_date,
      });
      setExpireDateModal(false);
      setPriceModal(false);
      setActiveModal(false);
      socket.emit("update_teacher");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const teacherSub = dataSubTeacher?.teacherSub;

  return (
    <div className="space-y-8 p-2">
      {/* Top Stats Cards */}
      {teacherSub && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {/* Price Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => {
              setNewPrice(teacherSub.price);
              setPriceModal(true);
            }}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Subscription Price</p>
                <h4 className="text-2xl font-black text-gray-800">{teacherSub.price} <span className="text-sm">L.E</span></h4>
              </div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <DollarSign size={20} />
              </div>
            </div>
          </motion.div>

          {/* Status Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => {
              setNewActive(teacherSub.active);
              setActiveModal(true);
            }}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Account Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${teacherSub.active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  <h4 className="text-xl font-black text-gray-800">{teacherSub.active ? 'Active' : 'Inactive'}</h4>
                </div>
              </div>
              <div className={`p-3 rounded-2xl transition-colors ${teacherSub.active ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500' : 'bg-red-50 text-red-500 group-hover:bg-red-500'} group-hover:text-white`}>
                <Activity size={20} />
              </div>
            </div>
          </motion.div>

          {/* Expire Date Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => {
              setNewExpire(teacherSub.expire_date?.slice(0, 10));
              setExpireDateModal(true);
            }}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Expiration Date</p>
                <h4 className="text-lg font-black text-gray-800">
                  {teacherSub.expire_date ? format(parseISO(teacherSub.expire_date), "MMM dd, yyyy") : "Not Set"}
                </h4>
              </div>
              <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Calendar size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="px-4">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
             <h3 className="text-xl font-black text-gray-800">Students Subscriptions</h3>
             <span className="bg-gray-100 px-4 py-1 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {dataSubTeacher.trans?.length || 0} Total Records
             </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Amount Paid</th>
                  <th className="px-8 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Transaction Date</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dataSubTeacher.trans?.map((item: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                          <User size={18} />
                        </div>
                        <span className="font-bold text-gray-700">{item.student.full_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-black text-gray-800">{item.price} <small className="text-gray-400">L.E</small></span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <Calendar size={14} />
                        {format(parseISO(item.date), "MMM dd, yyyy")}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Modals Render Function --- */}
      <AnimatePresence>
        {(expireDateModal || priceModal || activeModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setExpireDateModal(false); setPriceModal(false); setActiveModal(false); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              {/* Modal Content */}
              {priceModal && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-gray-800">Update Price</h3>
                    <button onClick={() => setPriceModal(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">New Subscription Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        type="number" 
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => updatedTeacherSub(newPrice, teacherSub.active, teacherSub.expire_date)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {expireDateModal && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-gray-800">Update Expiry</h3>
                    <button onClick={() => setExpireDateModal(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Choose New Date</label>
                    <input 
                      type="date" 
                      value={newExpire}
                      onChange={(e) => setNewExpire(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                  <button 
                    onClick={() => updatedTeacherSub(teacherSub.price, teacherSub.active, newExpire)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    Set Expiration
                  </button>
                </div>
              )}

              {activeModal && (
                <div className="space-y-8 text-center">
                  <div className="space-y-2">
                    <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${newActive ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                       {newActive ? <CheckCircle2 size={40}/> : <AlertCircle size={40}/>}
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">Account Visibility</h3>
                    <p className="text-gray-400 text-sm font-medium px-4">Change the teacher subscription status visibility for students.</p>
                  </div>

                  <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    <button 
                      onClick={() => setNewActive(true)}
                      className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${newActive ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                    >Active</button>
                    <button 
                      onClick={() => setNewActive(false)}
                      className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${!newActive ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
                    >Inactive</button>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setActiveModal(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl">Cancel</button>
                    <button 
                      onClick={() => updatedTeacherSub(teacherSub.price, newActive, teacherSub.expire_date)}
                      className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100"
                    >Update</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherSubscribe;