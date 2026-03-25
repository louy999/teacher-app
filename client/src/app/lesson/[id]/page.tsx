/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios from "axios";
import { headers, cookies } from "next/headers";
import LessonPlayer from "./LessonPlayer";
import { redirect } from "next/navigation";
import Files from "./files";
import CommentsContainer from "./commentsContainer";
import ExamPage from "./examPage";
import { IoHome, IoChevronForward } from "react-icons/io5"; 
import Link from "next/link";
import AddComment from "./addComment";
import { jwtVerify } from "jose";
import { BookOpen, MessageSquare, ShieldCheck } from "lucide-react";

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

const LessonPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: lessonId } = await params;
  const cookieStore = await cookies();
  const headersList = await headers();

  const userAgent = headersList.get("decoded-token");
  const dataUser = cookieStore.get("UserDe");

  if (!userAgent || !dataUser) redirect("/login");

  const decodedToken = await jwtVerify(
    dataUser.value,
    new TextEncoder().encode(process.env.TOKEN_SECRET),
  );

  const studentData: any = decodedToken.payload.roleData;

  // Fetch Lesson Data
  let lesson: Lesson | null = null;
  try {
    const res = await axios.get(
      `${process.env.local}/m/allLesson/lesson/${lessonId}/student/${studentData.id}`,
    );
    lesson = res.data.data;
    console.log(res.data.data);
  } catch (error) {
    console.log(error);

    return (
      <div className="text-center py-20 text-red-500">
        Error loading lesson.
      </div>
    );
  }

  if (!lesson) redirect("/");
  if (!lesson.is_active) redirect("/");

  // if subscription
  if (lesson.is_paid) {
    if (lesson.subscribe.length) {
      if (lesson.subscribe[0].expire) {
        const expireDate = new Date(subscription.expire);
        const currentDate = new Date();

        if (expireDate < currentDate) {
          redirect(`/notSubscription/${lessonId}`);
        }
        return null;
      } else {
        redirect("/");
      }
    }
  }
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Header & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <IoHome size={18} />
            </Link>
            <IoChevronForward className="text-slate-300" />
            <Link
              href="/chapters"
              className="text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Chapters
            </Link>
            <IoChevronForward className="text-slate-300" />
            <span className="text-indigo-600 truncate max-w-[200px]">
              {lesson.title}
            </span>
          </nav>

          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-emerald-100">
            <ShieldCheck size={14} />
            Secure Content
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          <div className="order-1 bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-200/20 group relative">
            <LessonPlayer
              videoUrl={lesson.video_url}
              lessonId={lesson.id}
              studentId={studentData.id}
            />
          </div>

          <div className="order-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between gap-4 ">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {lesson.title}
              </h1>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Published On
                </span>
                <span className="text-sm font-bold text-slate-600">
                  {new Date(lesson.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="order-last lg:order-3 space-y-6">
            <section className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  Discussion
                </h2>
              </div>

              <AddComment lessonId={lesson.id} studentId={studentData.id} />

              <div className="mt-10 space-y-12">
                <CommentsContainer
                  lessonId={lesson.id}
                  studentId={studentData.id}
                  showOnlyAdminApproved={false}
                  title="My Questions & Pending"
                />
                <hr className="border-slate-100" />
                <CommentsContainer
                  lessonId={lesson.id}
                  showOnlyAdminApproved={true}
                  title="Public Discussions"
                />
              </div>
            </section>
          </div>
        </div>

        <div className="space-y-6 lg:order-2">
          {/* Exam Section */}
          <section className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen size={24} className="text-indigo-200" />
                <h2 className="text-lg font-bold">Lesson Quiz</h2>
              </div>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Test your understanding and unlock your certificates.
              </p>
              <ExamPage lessonId={lesson.id} exams={lesson.exam} studentId={studentData.id} />
            </div>
            <div className="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-110 transition-transform duration-700">
              <BookOpen size={140} />
            </div>
          </section>

          {/* Files Section */}
          <section className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm">
            <Files files={lesson.file} />
          </section>

          {/* Quick Help Box */}
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
