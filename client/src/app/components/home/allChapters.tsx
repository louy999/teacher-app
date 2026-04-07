/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios from "axios";
import { headers } from "next/headers";
import AllLessons from "./allLessons";
import Image from "next/image";
import rocketIcon from "../../images/rocket.png";
import bookIcon from "../../images/book.png";
import { ChapterMotion } from "./ChapterMotion"; 
import { GraduationCap, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

const AllChapters = async () => {
  try {
    const headersList = await headers();
    const decodedToken = headersList.get("user-token");

    if (!decodedToken) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
           <p className="text-lg font-medium">Please login to access your course.</p>
        </div>
      );
    }

    const parsedToken = JSON.parse(decodedToken);
    const res = await axios.get(
      `${process.env.local}/m/chapterLesson/teacher/${process.env.teacherId}/stage/${parsedToken.stage}/student/${parsedToken.id}`,
    );
    const chapters = res.data.chapters || [];
console.log(chapters)
    if (!chapters.length) {
      return (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 m-6">
          <GraduationCap className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium">No chapters available for your stage yet.</p>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* ===== Hero Header ===== */}
        <header className="mb-16 space-y-6 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-widest uppercase mb-4 animate-pulse">
            <Sparkles size={14} />
            Your Learning Journey
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Course <span className="text-indigo-600">Chapters</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-xl flex items-center gap-2">
                Structured path to master your curriculum
                <Image src={rocketIcon} alt="rocket" width={24} height={24} className="animate-bounce" />
              </p>
            </div>

            <div className="hidden lg:block">
               <Image src={bookIcon} alt="books" width={80} height={80} className="drop-shadow-2xl opacity-80" />
            </div>
          </div>
          
          {/* خلفية جمالية خفيفة */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-100 rounded-full blur-[80px] -z-10 opacity-50" />
        </header>

        {/* ===== Timeline Container ===== */}
        <div className="relative">
          {chapters
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((chapter: any, index: number) => (
              <ChapterMotion key={chapter.id || index} index={index}>
                <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:translate-x-2">
                  
                  {/* Chapter Title Section */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="space-y-1">
                      <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">
                        Chapter {index + 1}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-800 capitalize leading-tight">
                        {chapter.name}
                      </h2>
                    </div>
                    
                    <div className="px-4 py-2 bg-slate-50 rounded-2xl text-slate-400 text-sm font-medium border border-slate-100">
                      {chapter.lessons?.length || 0} Lessons
                    </div>
                  </div>

                  {/* Lessons Grid/Carousel */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <AllLessons allData={chapter.lessons} />
                  </div>
                </div>
              </ChapterMotion>
            ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
      redirect("/profile");
    return (
      <div className="m-8 p-8 bg-red-50 rounded-3xl border border-red-100 text-center">
        <p className="text-red-600 font-bold">Something went wrong while loading your course.</p>
        <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }
};

export default AllChapters;