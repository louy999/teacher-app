/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from 'next/image';
import { Calendar, CreditCard, CheckCircle, AlertCircle, PlayCircle } from "lucide-react";
import Link from "next/link";

import purchasedCoursesIcon from '../../images/book.png';

const PaidLessons = ({ roleDet }: any) => {
    const subscriptions = roleDet?.allLessonInSubscribe || [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1 // ظهور العناصر تتابعياً
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                        <Image src={purchasedCoursesIcon} alt="Courses" width={24} height={24} className="invert brightness-0" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">My Courses</h2>
                        <p className="text-slate-500 text-sm font-medium">Manage your active learning subscriptions</p>
                    </div>
                </div>
                <div className="hidden md:block bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600">
                    Total: {subscriptions.length} Lessons
                </div>
            </div>

            {/* Subscriptions Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1  gap-6"
            >
                {subscriptions.map((sub: any, index: number) => {
                    const dateExpire = new Date(sub.expire);
                    const isActive = dateExpire > new Date();
                    
                    const formattedDateExpire = isNaN(dateExpire.getTime())
                        ? "N/A"
                        : format(dateExpire, "MMM dd, yyyy");

                    return (
                        <motion.div
                            key={sub.id || index}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                        >
                            {/* Status Badge */}
                            <div className="absolute top-6 right-6">
                                {isActive ? (
                                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                                        <CheckCircle size={12} /> Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
                                        <AlertCircle size={12} /> Expired
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col h-full">
                                {/* Lesson Info */}
                                <div className="mb-6">
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">Lesson Access</span>
                                    <h3 className="text-xl font-black text-slate-800 mt-3 group-hover:text-blue-600 transition-colors">
                                        {sub.lesson?.title || "Untitled Lesson"}
                                    </h3>
                                </div>

                                {/* Details Row */}
                                <div className="space-y-3 mb-8 flex-grow">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="p-2 bg-slate-50 rounded-lg"><Calendar size={16} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Valid Until</p>
                                            <p className="text-sm font-bold text-slate-700">{formattedDateExpire}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="p-2 bg-slate-50 rounded-lg"><CreditCard size={16} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Paid Amount</p>
                                            <p className="text-sm font-bold text-slate-700">{sub.price} EGP</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link href={isActive ? `/lesson/${sub.lesson_id}` : "#"}>
                                    <motion.button
                                        disabled={!isActive}
                                        whileTap={{ scale: 0.95 }}
                                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all shadow-lg ${
                                            isActive 
                                            ? "bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200" 
                                            : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                                        }`}
                                    >
                                        {isActive ? (
                                            <>
                                                <PlayCircle size={18} /> WATCH NOW
                                            </>
                                        ) : (
                                            "RENEW ACCESS"
                                        )}
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Empty State */}
            {subscriptions.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">No courses purchased yet.</p>
                </div>
            )}
        </div>
    );
};

export default PaidLessons;