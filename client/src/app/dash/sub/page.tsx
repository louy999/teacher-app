"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import LessonsSubscribe from "./lessonsSubscribe";
import TeacherSubscribe from "./teacherSubscribe";
import socket from "../../lib/socket";
import { useCallback } from "react";

const SubscribeDash = () => {
  const searchParams = useSearchParams();
  const [dataSubTeacher, setDataSubTeacher] = useState([]);
  const [dataSubLessons, setDataSubLessons] = useState([]);
  const search = searchParams.get("user");
  const fetchData = useCallback(async () => {
    try {
      if (search === "teacher") {
        const res = await axios.get(
          `${process.env.local}/m/transTeacher/teacher/${process.env.teacherId}`
        );
        setDataSubTeacher(res.data.data);
      } else if (search === "lesson") {
        const res = await axios.get(
          `${process.env.local}/m/subscribeLesson/teacher/${process.env.teacherId}`
        );
        setDataSubLessons(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [search]);
  useEffect(() => {
    fetchData();
  }, [fetchData, search]);
  socket.on("all_teacher", () => {
    fetchData();
  });
  return (
    <div>
      {search === "lesson" ? (
        <LessonsSubscribe dataSubLessons={dataSubLessons} />
      ) : search === "teacher" ? (
        <TeacherSubscribe dataSubTeacher={dataSubTeacher} />
      ) : (
        ""
      )}
    </div>
  );
};

export default SubscribeDash;
