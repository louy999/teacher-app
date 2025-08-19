"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface LessonNameProps {
  lessonId: string;
}

const LessonName: React.FC<LessonNameProps> = ({ lessonId }) => {
  const [lessonName, setLessonName] = useState("");

  useEffect(() => {
    const fetchLessonName = async () => {
      try {
        const getNameLesson = await axios.get(
          `${process.env.local}/lessons/${lessonId}`
        );
        setLessonName(getNameLesson.data.data.title);
      } catch (error) {
        console.error("Error fetching lesson name:", error);
      }
    };

    fetchLessonName();
  }, [lessonId]);

  return <>{lessonName || "Loading..."}</>;
};

export default LessonName;
