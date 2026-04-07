/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Play, CheckCircle, CreditCard, Sparkles, AlertCircle } from "lucide-react";
import { format, isAfter } from "date-fns";

const getYouTubeThumbnail = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
  }
  return null;
};

const SubAndViewLesson = ({ lesson }: { lesson: any }) => {
  // 1. حساب حالة المشاهدة والتقدم
  const userProgressData = lesson.views;
  const isViewed = userProgressData?.progress !== undefined;
  const progress = Number(userProgressData?.progress || 0);

  // 2. حساب حالة الاشتراك (تأكد من تاريخ الانتهاء)
  const hasSubscriptionData = lesson.subscribe && lesson.subscribe.expire;
  const isSubscribed = hasSubscriptionData 
    ? isAfter(new Date(lesson.subscribe.expire), new Date()) 
    : false;

  const youtubeThumbnail = getYouTubeThumbnail(lesson.video_url);
  
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-[320px] group flex-shrink-0"
    >
      <Link
        href={lesson.is_active ? `/lesson/${lesson.id}` : "#"}
        className={`relative flex flex-col h-[420px] rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.2)] ${
          !lesson.is_active ? "cursor-not-allowed" : ""
        }`}
      >
        {/* Thumbnail Wrapper */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
          <Image
            src={youtubeThumbnail || "/placeholder-video.jpg"}
            alt={lesson.title}
            fill
            unoptimized={!!youtubeThumbnail} 
            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
              !lesson.is_active ? "grayscale opacity-50" : ""
            }`}
          />
          
          {/* Badges */}
          <div className="absolute top-5 left-5 flex flex-col gap-2">
            {lesson.is_new && lesson.is_active && (
              <span className="flex items-center gap-1 bg-amber-400 text-white px-3 py-1.5 text-[10px] font-black rounded-full shadow-xl ring-2 ring-white/20">
                <Sparkles size={12} /> NEW
              </span>
            )}
            {/* عرض شارة الاشتراك المنتهي كتحذير */}
            {hasSubscriptionData && !isSubscribed && (
              <span className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 text-[10px] font-black rounded-full shadow-xl ring-2 ring-white/20">
                <AlertCircle size={12} /> EXPIRED
              </span>
            )}
          </div>

          {/* Lock/Play Icon Logic */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!lesson.is_active || (!isSubscribed && lesson.is_paid) ? (
              <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-full border border-white/20 shadow-2xl">
                <Lock className="text-white" size={28} />
              </div>
            ) : (
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="bg-blue-600 text-white p-5 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Play fill="currentColor" size={24} />
              </motion.div>
            )}
          </div>

          {/* Progress Bar */}
          {isViewed && isSubscribed && (
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-200/30 backdrop-blur-sm">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
              />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-6 justify-between bg-white">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg ${isSubscribed ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {isSubscribed ? 'Subscribed' : 'Lesson'}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                {format(new Date(lesson.date), "MMM d, yyyy")}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
              {lesson.title}
            </h3>
          </div>

          {/* Action Button Logic - الأهم هنا */}
          <div className="mt-6">
            {!lesson.is_active ? (
              <div className="flex items-center justify-center w-full py-3.5 bg-slate-100 text-slate-400 rounded-2xl font-bold gap-2 cursor-not-allowed">
                <Lock size={18} />
                <span>Not Available</span>
              </div>
            ) : isSubscribed || !lesson.is_paid ? (
                // إذا كان مشتركاً أو الدرس مجانياً
                isViewed ? (
                  <div className="flex items-center justify-center w-full py-3.5 bg-emerald-50 text-emerald-600 rounded-2xl font-bold gap-2 hover:bg-emerald-500 hover:text-white transition-all duration-300 border border-emerald-100">
                    <CheckCircle size={18} />
                    <span>{progress === 100 ? "Review Lesson" : `Continue ${progress}%`}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    <Play size={18} fill="currentColor" />
                    <span>Start Learning</span>
                  </div>
                )
            ) : (
                // إذا كان الدرس مدفوعاً والاشتراك منتهي أو غير موجود
                <div className="flex flex-col gap-2">
                   <div className="flex items-center justify-center w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold gap-2 hover:bg-slate-800 transition-all shadow-xl">
                    <CreditCard size={18} />
                    <span>Unlock • {lesson.price} EGP</span>
                  </div>
                  {hasSubscriptionData && (
                    <p className="text-[9px] text-center text-red-400 font-bold uppercase tracking-widest">
                       Your plan expired on {format(new Date(lesson.subscribe.expire), "MMM d")}
                    </p>
                  )}
                </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SubAndViewLesson;