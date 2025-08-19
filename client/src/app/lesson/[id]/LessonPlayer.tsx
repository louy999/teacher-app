"use client";
import React from "react";
import ReactPlayer from "react-player";

interface Props {
  videoUrl: string;
}

const LessonPlayer: React.FC<Props> = ({ videoUrl }) => {
  const cleanUrl = videoUrl?.split("&")[0];

  return (
    <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-md">
      <ReactPlayer
        url={cleanUrl}
        width="100%"
        height="100%"
        controls
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default LessonPlayer;
