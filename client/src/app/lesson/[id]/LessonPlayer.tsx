"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { Loader2 } from "lucide-react"; // أيقونة تحميل أرقى

interface Props {
  videoUrl: string;
  lessonId: string; // تم تغييرها لـ string لتناسب الـ UUID في قاعدة بياناتك
  studentId: string;
}

const LessonPlayer: React.FC<Props> = ({ videoUrl, lessonId, studentId }) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasSeeked, setHasSeeked] = useState(false);
  const [duration, setDuration] = useState(0);
  const [lastSavedTime, setLastSavedTime] = useState(0);

  // 1. استخراج الـ URL النظيف
  const cleanUrl = React.useMemo(() => videoUrl?.split("&")[0], [videoUrl]);

  // 2. دالة الحفظ (تم تحسينها لتقليل طلبات الـ GET الزائدة)
  const saveProgress = useCallback(async (currentTime: number, videoDuration: number) => {
    if (videoDuration <= 0) return;

    const progressPercent = Math.min(100, Math.floor((currentTime / videoDuration) * 100));
    
    try {
      // نصيحة: يفضل أن يكون للسيرفر Endpoint واحد للـ Upsert (Update or Create) 
      // لتجنب عمل طلبين (GET ثم POST)
      await axios.post(`${process.env.local}/views`, {
        lesson_id: lessonId,
        student_id: studentId,
        progress: progressPercent,
        current_time: Math.floor(currentTime),
      });
      
      setLastSavedTime(currentTime);
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  }, [lessonId, studentId]);

  // 3. جلب آخر نقطة توقف عند البداية
  useEffect(() => {
    const initPlayer = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.local}/views/lesson/${lessonId}/student/${studentId}`
        );
        if (data.data?.current_time) {
          setLastSavedTime(data.data.current_time);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsReady(true);
      }
    };
    initPlayer();
  }, [lessonId, studentId]);

  // 4. معالجة القفز لآخر وقت (Seek) عند جاهزية الفيديو
  const handleOnReady = () => {
    if (!hasSeeked && lastSavedTime > 0) {
      playerRef.current?.seekTo(lastSavedTime, "seconds");
      setHasSeeked(true);
    }
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    const currentTime = Math.floor(state.playedSeconds);
    // حفظ كل دقيقة (60 ثانية) بدلاً من 3 دقائق لضمان عدم ضياع التقدم
    if (currentTime - lastSavedTime >= 60) {
      saveProgress(currentTime, duration);
    }
  };

  if (!isReady) {
    return (
      <div className="relative w-full pb-[56.25%] bg-slate-900 rounded-[2rem] flex items-center justify-center">
        <Loader2 className="text-indigo-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="relative w-full pb-[56.25%] rounded-[2rem] overflow-hidden shadow-2xl bg-black group">
      <ReactPlayer
        ref={playerRef}
        url={cleanUrl}
        width="100%"
        height="100%"
        controls
        onReady={handleOnReady}
        onProgress={handleProgress}
        onDuration={(d) => setDuration(d)}
        onEnded={() => saveProgress(duration, duration)}
        config={{
          youtube: {
            playerVars: {
              rel: 0, // منع اقتراح فيديوهات أخرى
              modestbranding: 1,
            },
          },
        }}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      
      {/* طبقة حماية بسيطة لمنع التحميل (اختياري) */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-[2rem]" />
    </div>
  );
};

export default LessonPlayer;