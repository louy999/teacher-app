"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import AllReplay from "./allReplay";
import Link from "next/link";

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

  useEffect(() => {
    const fetchData = async () => {
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
    };

    fetchData();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="mt-4 px-4">
        <p className="text-sm text-gray-500">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 ">
      <h2 className="text-xl font-semibold mb-5 text-gray-700">
        public comments
      </h2>

      <div className="">
        {commentsData
          .filter((comment) => comment.shown)
          .map((comment) => (
            <div key={comment.id} className="gap-3 mb-5  border-l-2 ">
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
                    ) : (
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
                    )}
                    <p className="text-base text-gray-800 mt-2">
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
