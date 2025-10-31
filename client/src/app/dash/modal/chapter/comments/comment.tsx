import React from "react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
// import AllReplay from "../../../../lesson/[id]/allReplay";
import ReplayDash from "./replayDash";
import socket from "../../../../lib/socket";

const CommentAllDash = ({ lessonId }) => {
  const [allComments, setAllComments] = useState([]);
  const [openReplayId, setOpenReplayId] = useState<number | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/m/getComments/lesson/${lessonId}`
      );
      setAllComments(res.data.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, lessonId]);
  socket.on("all_comment", () => {
    fetchComments();
  });
  const EditShowComment = async (text, file_url, file_type, shown, id) => {
    try {
      await axios.patch(`${process.env.local}/comments`, {
        text,
        file_url,
        file_type,
        shown: !shown,
        id,
      });
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-md py-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">All Comments</h2>
      </div>

      <div className="bg-slate-200 p-2 rounded-md">
        {allComments
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .map((c, i) => (
            <div
              key={i}
              className="gap-3 mb-5 rounded-r-md bg-white border-l-black border-l-3"
            >
              <div className="flex items-start gap-3 p-4">
                <Image
                  src={`${process.env.img}/image/${
                    c.extraData.profile_pic || "default-profile.png"
                  }`}
                  alt="User profile"
                  width={48}
                  height={48}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 font-medium">
                          {c.user.role || "User"}:
                        </span>
                        <span className="font-semibold capitalize text-gray-900">
                          {c.user.full_name || "Unknown"}
                        </span>
                      </div>
                      <time className="text-xs text-gray-500 mt-1 block">
                        {new Date(c.date).toLocaleString()}
                      </time>
                    </div>

                    <div className="flex items-center">
                      <div
                        className="tooltip"
                        data-tip={c.shown ? "Seen by lesson owner" : "Not seen"}
                      >
                        <button
                          onClick={() =>
                            EditShowComment(
                              c.text,
                              c.file_url,
                              c.file_type,
                              c.shown,
                              c.id
                            )
                          }
                          className={`w-14 h-6 flex items-center rounded-full py-4 p-1 hover:opacity-50 duration-300 transition-colors cursor-pointer  ${
                            c.shown ? "bg-green-500" : "bg-gray-400"
                          }`}
                        >
                          <div
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                              c.shown ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 bg-white">
                    {c.file_type === "image" && (
                      <Image
                        src={`${process.env.img}/image/${c.file_url}`}
                        alt="Comment image"
                        width={400}
                        height={400}
                        className="w-64 h-64 rounded-md object-contain shadow-md"
                      />
                    )}
                    {c.file_type === "file" && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 truncate max-w-xs">
                          {c.file_url}
                        </span>
                        <Link
                          href={`${process.env.img}/file/${c.file_url}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-md transition"
                        >
                          Download
                        </Link>
                      </div>
                    )}
                    <p className="mt-3 text-gray-800 text-base whitespace-pre-line">
                      {c.text}
                    </p>
                  </div>

                  <div
                    className="flex justify-end w-full cursor-pointer"
                    onClick={() =>
                      setOpenReplayId(openReplayId === c.id ? null : c.id)
                    }
                  >
                    <div className="bg-amber-600 p-2 px-4 rounded-md text-white">
                      Replay
                    </div>
                  </div>
                </div>
              </div>

              {openReplayId === c.id && <ReplayDash commentId={c.id} />}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentAllDash;
