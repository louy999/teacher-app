/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface Props {
  videoUrl: string;
  lessonId: string;
  studentId: string;
  lesson: any; // فيه views + باقي الداتا
}

const LessonPlayer: React.FC<Props> = ({
  videoUrl,
  lessonId,
  studentId,
  lesson,
}) => {
  const playerRef = useRef<ReactPlayer>(null);

  // refs لتجنب re-render
  const lastSavedTimeRef = useRef<number>(0);
  const isSavingRef = useRef<boolean>(false);
  const recordIdRef = useRef<string | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [hasSeeked, setHasSeeked] = useState(false);
  const [duration, setDuration] = useState(0);

  const cleanUrl = React.useMemo(() => videoUrl?.split("&")[0], [videoUrl]);

  // ✅ init من lesson.views بدل API
  useEffect(() => {
    if (lesson?.views) {
      lastSavedTimeRef.current = lesson.views.current_time || 0;
      recordIdRef.current = lesson.views.id || null;
    }
    setIsReady(true);
  }, [lesson]);

  // ✅ save progress (بدون أي GET)
  const saveProgress = useCallback(
    async (currentTime: number, videoDuration: number) => {
      if (isSavingRef.current || videoDuration <= 0) return;

      isSavingRef.current = true;

      const progressPercent = Math.min(
        100,
        Math.floor((currentTime / videoDuration) * 100)
      );

      try {
        if (!recordIdRef.current) {
          // create
          const res = await axios.post(`${process.env.local}/views`, {
            lesson_id: lessonId,
            student_id: studentId,
            progress: progressPercent,
            current_time: Math.floor(currentTime),
          });

          recordIdRef.current = res.data.data?.id || res.data.id;
        } else {
          // update
          await axios.patch(`${process.env.local}/views`, {
            id: recordIdRef.current,
            progress: progressPercent,
          });
        }

        lastSavedTimeRef.current = currentTime;
      } catch (error) {
        console.error("❌ Save Progress Error:", error);
     
      } finally {
        isSavingRef.current = false;
      }
    },
    [lessonId, studentId]
  );

  const handleOnReady = () => {
    if (!hasSeeked && lastSavedTimeRef.current > 0) {
      playerRef.current?.seekTo(lastSavedTimeRef.current, "seconds");
      setHasSeeked(true);
    }
  };

  const handleProgress = (state: { playedSeconds: number }) => {
    const currentTime = Math.floor(state.playedSeconds);

    if (currentTime - lastSavedTimeRef.current >= 180) {
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
    <div className="relative w-full pb-[56.25%] rounded-[2rem] overflow-hidden shadow-2xl bg-black">
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
          youtube: { playerVars: { rel: 0, modestbranding: 1 } },
        }}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default LessonPlayer;