"use client";
import { GoFile } from "react-icons/go";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type FileData = {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
};

const Files = ({ lessonId }: { lessonId: string }) => {
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    const getFilesApi = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/files/lesson/${lessonId}`
        );
        setFiles(res.data.data);
      } catch (error) {
        console.error("Error fetching lesson files:", error);
      }
    };

    getFilesApi();
  }, [lessonId]);

  return (
    <div className="my-6   rounded-md ">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Lesson Martial</h2>
      {files.length === 0 ? (
        <p className="text-sm text-gray-500">
          No files available for this lesson.
        </p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => {
            const downloadLink = `${process.env.img}/${file.file_type}/${file.file_url}`;

            return (
              <Link
                href={downloadLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                key={file.id}
                className=" flex items-center gap-3  cursor-pointer hover:bg-slate-100 hover:p-3 hover:mb-3 duration-300 rounded-md transition-all"
              >
                <div className="flex items-center justify-center bg-[#F0F2F5] rounded-md p-3">
                  <GoFile className="text-xl " />
                </div>
                <div>
                  <div className="text-gray-800 font-semibold text-lg capitalize">
                    {file.title}
                  </div>
                  <div className="text-sm text-gray-400">
                    {file.file_url.split(".")[1]}
                  </div>
                </div>
              </Link>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Files;
