"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Play, CheckCircle, CreditCard, Sparkles } from "lucide-react";
import { format } from "date-fns";

// دالة لاستخراج صورة اليوتيوب بجودة عالية
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
  // بما أن views مصفوفة، نتحقق من وجود أول عنصر
  const userProgressData = lesson.views && lesson.views.length > 0 ? lesson.views[0] : null;
  const isViewed = !!userProgressData;
  const progress = Number(userProgressData?.progress || 0);

  // جلب صورة يوتيوب أو استخدام الصورة الاحتياطية
  const youtubeThumbnail = getYouTubeThumbnail(lesson.video_url);
  const fallbackImage = `${process.env.img}/image/${lesson.image_url}`;

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
            src={youtubeThumbnail || fallbackImage}
            alt={lesson.title}
            fill
            unoptimized={!!youtubeThumbnail} // يوتيوب يفضل استخدامه بدون تحسين Next الداخلي أحياناً
            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
              !lesson.is_active ? "grayscale opacity-50" : ""
            }`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-5 left-5 flex gap-2">
            {lesson.is_new && lesson.is_active && (
              <span className="flex items-center gap-1 bg-amber-400 text-white px-3 py-1.5 text-[10px] font-black rounded-full shadow-xl ring-2 ring-white/20">
                <Sparkles size={12} /> NEW
              </span>
            )}
            {!lesson.is_paid && (
              <span className="bg-emerald-500 text-white px-3 py-1.5 text-[10px] font-black rounded-full shadow-xl ring-2 ring-white/20">
                FREE
              </span>
            )}
          </div>

          {/* Lock/Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!lesson.is_active ? (
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

          {/* Progress Bar Container */}
          {isViewed && (
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
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] bg-blue-50 px-2.5 py-1 rounded-lg">
                Lesson
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                {format(new Date(lesson.date), "MMM d, yyyy")}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
              {lesson.title}
            </h3>
          </div>

          {/* Button Logic */}
          <div className="mt-6">
            {lesson.is_active ? (
              isViewed ? (
                <div className="flex items-center justify-center w-full py-3.5 bg-emerald-50 text-emerald-600 rounded-2xl font-bold gap-2 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 border border-emerald-100">
                  <CheckCircle size={18} />
                  <span>{progress === 100 ? "Completed" : `Continue ${progress}%`}</span>
                </div>
              ) : lesson.is_paid ? (
                <div className="flex items-center justify-center w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold gap-2 hover:bg-slate-800 transition-all shadow-xl">
                  <CreditCard size={18} />
                  <span>Unlock • {lesson.price} EGP</span>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  <Play size={18} fill="currentColor" />
                  <span>Start Learning</span>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center w-full py-3.5 bg-slate-100 text-slate-400 rounded-2xl font-bold gap-2 cursor-not-allowed">
                <Lock size={18} />
                <span>Not Available</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SubAndViewLesson;