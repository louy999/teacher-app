/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SkeletonLesson from "../modal/chapter/skeletonLesson";
import EditNameLesson from "../modal/chapter/editNameLesson";
import EditPlayer from "../modal/chapter/editPlayer";
import EditFilesLesson from "../modal/chapter/editFilesLesson";
import ExamsDash from "./examsDash";

const LessonsFetch = ({ lessonId }): any => {
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    if (!lessonId) return;
    const fetchLessonDetails = async () => {
      try {
        const res = await axios.get(`${process.env.local}/lessons/${lessonId}`);
        setLesson(res.data.data);
      } catch (error) {
        console.error("Error fetching lesson details:", error);
      }
    };
    fetchLessonDetails();
  }, [lessonId]);

  if (!lesson) return <SkeletonLesson />;

  return (
    <div className="aspect-video w-full">
      <EditNameLesson lesson={lesson} setLesson={setLesson} />
      <EditPlayer lesson={lesson} setLesson={setLesson} />
      <EditFilesLesson lessonId={lesson.id} />
      <ExamsDash lessonId={lesson.id} />
    </div>
  );
};

export default LessonsFetch;
