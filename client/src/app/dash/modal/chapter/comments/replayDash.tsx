import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import AddReplay from "./addReplay";
import socket from "../../../../lib/socket";
import { MdOutlineDeleteOutline } from "react-icons/md";

const ReplayDash = ({ commentId }) => {
  const [loading, setLoading] = useState(false);
  const [allDataReplay, setAllDataReplay] = useState([]);
  const deleteRep = async (idRep) => {
    try {
      const res = await axios.delete(`${process.env.local}/replay/${idRep}`);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchReplies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.local}/m/replay/comment/${commentId}`
      );

      setAllDataReplay(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [commentId]);
  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);
  console.log(allDataReplay);
  socket.on("all_replay", () => {
    fetchReplies();
  });
  return (
    <div className="p-4 bg-slate-100 rounded-b-md">
      {loading ? (
        <div>Loading...</div>
      ) : (
        allDataReplay
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((replay, index) => (
            <>
              <div key={index} className="mb-2 p-2 border rounded-md bg-white">
                <div key={replay.id} className="gap-3 p-4 bg-white  ">
                  <div className="flex items-start gap-3 p-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p>
                          <div className="flex gap-2">
                            {replay.extraData.profile_pic && (
                              <Image
                                src={`${process.env.img}/image/${replay.extraData.profile_pic}`}
                                alt="Attached file"
                                width={40}
                                height={40}
                                className="rounded-md object-cover"
                              />
                            )}
                            <p>
                              <span className="text-xs text-slate-500 mr-1">
                                {replay.user.role}:
                              </span>
                              <span className="font-bold capitalize">
                                {replay.user.full_name}
                              </span>
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(replay.date).toLocaleString()}
                          </p>
                        </p>
                        <div className="flex gap-5">
                          <MdOutlineDeleteOutline
                            className="text-3xl text-red-500 hover:text-4xl duration-300 cursor-pointer"
                            onClick={() => {
                              deleteRep(replay.id);
                            }}
                          />
                        </div>
                      </div>
                      <div className=" p-2  rounded-md  mt-2">
                        {replay?.file_type === "image" ? (
                          <Image
                            src={`${process.env.img}/image/${replay.file_url}`}
                            alt="Uploaded image"
                            width={400}
                            height={400}
                            className="rounded-md w-44 h-44 object-cover mb-2"
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 240px"
                            loading="lazy"
                          />
                        ) : replay?.file_type === "file" ? (
                          <div>
                            {replay.file_url}
                            <Link
                              href={`${process.env.img}/file/${replay.file_url}`}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition"
                            >
                              Download
                            </Link>
                          </div>
                        ) : (
                          ""
                        )}
                        <p className="mt-3 text-gray-800 text-base whitespace-pre-line">
                          {replay.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))
      )}
      <AddReplay commentId={commentId} />
    </div>
  );
};

export default ReplayDash;
