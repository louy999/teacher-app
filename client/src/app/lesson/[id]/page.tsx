/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios from "axios";
import { headers } from "next/headers";
import LessonPlayer from "./LessonPlayer";
import { redirect } from "next/navigation";
import Files from "./files";
import Comment from "./comment";
import AllComments from "./allComments";
import ExamPage from "./examPage";
import { IoHome } from "react-icons/io5";
import Link from "next/link";
import AddComment from "./addComment";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

interface Lesson {
  id: string;
  date: string;
  title: string;
  chapter_id: string;
  video_url: string;
  image_url: string;
  is_active: boolean;
  is_paid: boolean;
  price: string;
}
const LessonPage = async ({ params }: { params: Promise<Params> }) => {
  const { id: lessonId } = await params;
  const cookieStore = await cookies();

  const headersList = await headers();
  const userAgent = headersList.get("decoded-token");
  const dataUser = cookieStore.get("UserDe");

  if (!userAgent || !dataUser) {
    console.error("Decoded token not found");
    redirect("/login");
  }

  const decodedToken = await jwtVerify(
    dataUser.value,
    new TextEncoder().encode(process.env.TOKEN_SECRET)
  );
  const studentData: any = decodedToken.payload.student;

  let studentId = "";
  try {
    const parsedUserAgent = JSON.parse(userAgent);
    studentId = parsedUserAgent?.user?.id || "";
  } catch {
    console.error("Failed to parse decoded-token");
    redirect("/login");
  }

  if (!studentId) {
    console.error("Student ID not found in decoded token");
    redirect("/login");
  }

  let lesson: Lesson | null = null;

  try {
    const res = await axios.get(`${process.env.local}/lessons/${lessonId}`);
    lesson = res.data.data;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return <div className="text-red-500 p-4">Failed to load lesson data.</div>;
  }

  if (!lesson) {
    return <div className="text-gray-500 p-4">Lesson not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className=" w-fit rounded-full flex items-center gap-2">
        <Link
          href="/"
          className="text-gray-600 duration-200 hover:text-gray-800 flex items-center gap-2"
        >
          <IoHome />
          <div>/</div>
          <div>chapter</div>
          <div>/</div>
        </Link>
        <div>{lesson.title}</div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
      <LessonPlayer
        videoUrl={lesson.video_url}
        lessonId={lesson.id}
        studentId={studentId}
      />
      <Files lessonId={lesson.id} />
      <ExamPage lessonId={lesson.id} studentId={studentId} />
      <div className="bg-amber-100/50 p-2 rounded-md">
        <AddComment lessonId={lesson.id} studentId={studentId} />
        <Comment lessonId={lesson.id} studentId={studentId} />
        <AllComments lessonId={lesson.id} />
      </div>
    </div>
  );
};

export default LessonPage;
