"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
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

type StudentData = {
  name?: string;
  access_level?: string;
  profile_pic?: string;
};

type UserData = {
  role?: string;
  full_name?: string;
};

type CommentProps = {
  lessonId: string;
  studentId: string;
};

const Comment = ({ lessonId, studentId }: CommentProps) => {
  const [commentsData, setCommentsData] = useState<CommentData[]>([]);
  const [studentDate, setStudentDate] = useState<StudentData>({});
  const [userData, setUserData] = useState<UserData>({}); // Define the type for userData

  const fetchData = async () => {
    try {
      const commentsRes = await axios.get(
        `${process.env.local}/comments/lesson/${lessonId}/student/${studentId}`
      );
      const studentRes = await axios.get(
        `${process.env.local}/students/${studentId}`
      );
      const userRes = await axios.get(
        `${process.env.local}/users/${studentId}`,
        {
          headers: {
            Authorization: `${getCookie("dataRoleToken")}`,
          },
        }
      );
      setCommentsData(commentsRes.data.data);
      setStudentDate(studentRes.data.data);
      setUserData(userRes.data.data); // Set the userData with the correct structure
    } catch (error) {
      console.error("Error fetching comments or student data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lessonId, studentId]);

  useEffect(() => {
    socket.on("all_com", () => {
      fetchData();
    });

    return () => {
      socket.off("all_com", () => {
        fetchData();
      });
    };
  }, []);

  return (
    <div className="rounded-md py-4">
      <div>
        {commentsData
          .filter((e) => e.shown === false)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .map((comment) => {
            return (
              <div
                key={comment.id}
                className="gap-3 mb-5 border-l-black border-l-3"
              >
                <div className="flex items-start gap-3 p-4">
                  <Image
                    src={`${process.env.img}/image/${
                      studentDate.profile_pic || "default-profile.png"
                    }`}
                    alt="User profile"
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 font-medium">
                          {userData.role || "User"}:
                        </span>
                        <span className="font-semibold capitalize text-gray-900">
                          {userData.full_name || "Unknown"}
                        </span>
                      </div>
                      <time className="text-xs text-gray-500 mt-1 block">
                        {new Date(comment.date).toLocaleString()}
                      </time>
                    </div>
                    <div className="mt-3 bg-white">
                      {comment.file_type === "image" && (
                        <Image
                          src={`${process.env.img}/image/${comment.file_url}`}
                          alt="Comment image"
                          width={400}
                          height={400}
                          className="w-64 h-64 rounded-md object-contain shadow-md"
                        />
                      )}
                      {comment.file_type === "file" && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-700 truncate max-w-xs">
                            {comment.file_url}
                          </span>
                          <Link
                            href={`${process.env.img}/file/${comment.file_url}`}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-md transition"
                          >
                            Download
                          </Link>
                        </div>
                      )}
                      <p className="mt-3 text-gray-800 text-base">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>

                <AllReplay commentId={comment.id} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Comment;
