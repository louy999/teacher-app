"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

interface Props {
  videoUrl: string;
  lessonId: number;
  studentId: number;
}

const LessonPlayer: React.FC<Props> = ({ videoUrl, lessonId, studentId }) => {
  const cleanUrl = videoUrl?.split("&")[0];
  const playerRef = useRef<ReactPlayer>(null);

  const [startSeconds, setStartSeconds] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const [videoDuration, setVideoDuration] = useState(0);
  const [lastRecordedProgress, setLastRecordedProgress] = useState(0);
  const RECORDING_INTERVAL = 60 * 3;

  useEffect(() => {
    const fetchLastTime = async () => {
      try {
        const response = await axios.get(
          `${process.env.local}/views/lesson/${lessonId}/student/${studentId}`
        );
        const viewData = response.data.data;

        if (viewData?.current_time) {
          setStartSeconds(viewData.current_time);
          setLastRecordedProgress(viewData.current_time);
        }

        setIsReady(true);
      } catch (error) {
        console.error("Error fetching last time:", error);
        setIsReady(true);
      }
    };

    fetchLastTime();
  }, [lessonId, studentId]);

  const recordProgress = async (currentSeconds: number) => {
    const progressPercentage =
      videoDuration > 0
        ? Math.min(100, Math.floor((currentSeconds / videoDuration) * 100))
        : 0;

    if (progressPercentage === 0) return;

    try {
      const checkResponse = await axios.get(
        `${process.env.local}/views/lesson/${lessonId}/student/${studentId}`
      );
      const viewData = checkResponse.data.data;

      let res;
      if (viewData?.id) {
        res = await axios.patch(`${process.env.local}/views`, {
          id: viewData.id,
          progress: progressPercentage,
          current_time: currentSeconds,
        });
      } else {
        res = await axios.post(`${process.env.local}/views`, {
          lesson_id: lessonId,
          student_id: studentId,
          progress: progressPercentage,
          current_time: currentSeconds,
        });
      }

      console.log("Progress recorded:", res.data.data);
      setLastRecordedProgress(currentSeconds);
    } catch (error) {
      console.error("Error recording progress:", error);
    }
  };

  const handleProgress = (state: {
    playedSeconds: number;
    played: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    const currentSeconds = Math.floor(state.playedSeconds);
    const timeSinceLastRecord = currentSeconds - lastRecordedProgress;

    if (timeSinceLastRecord >= RECORDING_INTERVAL) {
      recordProgress(currentSeconds);
    }
  };

  const handleDuration = (duration: number) => {
    setVideoDuration(duration);
  };

  const handleEnded = () => {
    recordProgress(videoDuration);
    console.log("Video ended. 100% progress recorded.");
  };

  if (!isReady) {
    return (
      <div className="p-8 text-center text-gray-500">loading lesson...</div>
    );
  }

  return (
    <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-md">
      <ReactPlayer
        ref={playerRef}
        url={cleanUrl}
        width="100%"
        height="100%"
        controls
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        config={{
          youtube: {
            playerVars: {
              start: startSeconds,
            },
          },
        }}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default LessonPlayer;
