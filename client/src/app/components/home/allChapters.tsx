/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios from "axios";
import { headers } from "next/headers";
import AllLessons from "./allLessons";
import Image from 'next/image';
import rocketIcon from "../../images/rocket.png"
import bookIcon from "../../images/book.png"

const AllChapters = async () => {
  try {
    const headersList = await headers();
    const decodedToken = headersList.get("user-token");

    if (!decodedToken) {
      return <div className="text-gray-500">No decoded token found.</div>;
    }

    const parsedToken = JSON.parse(decodedToken);

    const allChaptersFromStage = await axios.get(
      `${process.env.local}/m/chapterLesson/teacher/${process.env.teacherId}/stage/${parsedToken.stage}/student/${parsedToken.id}`
    );

    if (!allChaptersFromStage.data.chapters.length) {
      return <div className="text-gray-500">No chapters available.</div>;
    }

    return (
      <div className="max-w-full mx-auto px-6 py-8 space-y-12">

  {/* ===== Header ===== */}
  <div className="space-y-3">
    <h1 className="text-base md:text-4xl font-extrabold flex items-center gap-3 text-gray-800">
      <span className="p-2 rounded-xl bg-indigo-100 hidden md:block">
        <Image
          src={bookIcon}
          alt="course chapters"
          width={32}
          height={32}
        />
      </span>
      <span className="text-nowrap truncate">Course Chapters</span>

      <span className="ml-2 truncate text-sm font-medium px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
        Learn & Progress
      </span>
    </h1>

    <p className="text-gray-500 flex items-start gap-2 text-sm md:text-base">
      Explore lessons, track your progress, and keep learning
      <Image
        src={rocketIcon}
        alt="keep learning"
        width={20}
        height={20}
      />
    </p>
  </div>

  {/* ===== Chapters ===== */}
  {allChaptersFromStage.data.chapters
    .sort((a: any, b: any) => new Date(a.date) - new Date(b.date))
    .map((chapter: any, index: number) => (
      <section
        key={index}
        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
      >
        {/* Chapter Title */}
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-bold text-indigo-600 capitalize flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            {chapter.name}
          </h2>

          <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-indigo-200 to-transparent rounded-full" />
        </div>

        <AllLessons allData={chapter.lessons} />
      </section>
    ))}
</div>

    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error: Please contact your teacher.</div>;
  }
};

export default AllChapters;
