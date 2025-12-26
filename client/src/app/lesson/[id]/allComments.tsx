"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import AllReplay from "./allReplay";
import Link from "next/link";
import socket from "../../lib/socket";

type CommentData = {
  id: string;
  text: string;
  date: string;
  file_url: string;
  file_type: string;
  shown: boolean;
};

type CommentProps = {
  lessonId: string;
};

const AllComments = ({ lessonId }: CommentProps) => {
  const [commentsData, setCommentsData] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const commentsRes = await axios.get(
        `${process.env.local}/comments/lesson/${lessonId}`
      );
      setCommentsData(commentsRes.data.data);
    } catch (error) {
      console.error("Error fetching comments or student data:", error);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  socket.on("all_comment", () => {
    fetchData();
  });
  if (loading) {
    return (
      <div className="mt-4 px-4">
        <p className="text-sm text-gray-500">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-blue-100 p-3 rounded-3xl ">
      <h2 className="text-xl font-semibold mb-5 text-gray-700">
        public comments
      </h2>

      <div className="">
        {commentsData
          .filter((comment) => comment.shown)
          .map((comment) => (
            <div
              key={comment.id}
              className="gap-3 mb-5  border-l-2 bg-slate-200/80 border-l-black pb-2 pr-2"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="flex-1">
                  <p className="flex gap-2 my-2">
                    <Image
                      src={`${process.env.img}/image/blank-profile-.png`}
                      className="rounded-md"
                      alt="Student profile"
                      width={40}
                      height={40}
                    />
                    <div>
                      <span className="font-semibold text-sm">Student</span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.date).toLocaleString()}
                      </p>
                    </div>
                  </p>
                  <div className="bg-white p-2 rounded-md mt-2">
                    {comment.file_type === "image" ? (
                      <Image
                        src={`${process.env.img}/image/${comment.file_url}`}
                        alt="Uploaded image"
                        width={400}
                        height={400}
                        className="rounded-md w-44 h-44 object-cover mb-2"
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 240px"
                        loading="lazy"
                      />
                    ) : comment.file_type === "image" ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-gray-600">
                          {comment.file_url}
                        </p>
                        <Link
                          href={`${process.env.img}/file/${comment.file_url}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition"
                        >
                          Download File
                        </Link>
                      </div>
                    ):""}
                    <p className="mt-3 text-gray-800 text-base whitespace-pre-line">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>

              <AllReplay commentId={comment.id} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllComments;
