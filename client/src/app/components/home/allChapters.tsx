/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import axios from "axios";
import { headers } from "next/headers";
import AllLessons from "./allLessons";

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
      <div className="max-w-7xl mx-auto p-6 space-y-10">
        <h1 className="text-3xl font-bold mb-6">Course Chapters</h1>
        <p className="text-gray-500 mb-10">
          Explore the chapters and lessons available in this course.
        </p>

        {allChaptersFromStage.data.chapters.map(
          (chapter: any, index: number) => {
            return (
              <section key={index} className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold italic text-red-600 mb-6 capitalize">
                  {chapter.name}
                </h2>
                <AllLessons allData={chapter.lessons} />
              </section>
            );
          }
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Error: Please contact your teacher.</div>;
  }
};

export default AllChapters;
