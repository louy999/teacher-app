"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import AssistDet from "./assistDet";

interface ReplayData {
  id: string;
  text: string;
  date: string;
  file_url: string;
  file_type: string;
  assistant_id: string;
}

interface AllReplayProps {
  commentId: string;
}

const AllReplay: React.FC<AllReplayProps> = ({ commentId }) => {
  const [replayData, setReplayData] = useState<ReplayData[]>([]);

  useEffect(() => {
    const fetchReplay = async () => {
      try {
        const res = await axios.get(
          `${process.env.local}/replay/comment/${commentId}`
        );

        setReplayData(res.data.data);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };
    fetchReplay();
  }, [commentId]);

  if (replayData.length === 0) {
    return null;
  }

  return (
    <div className="ml-10 mt-2 space-y-2">
      <div className=" bg-white border p-2  rounded-md shadow-sm">
        {replayData.map((replay) => (
          <div key={replay.id} className="gap-3 p-4 bg-white  ">
            <div className="flex items-start gap-3 p-4">
              <div className="flex-1">
                <p>
                  <AssistDet assistantId={replay.assistant_id} />
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(replay.date).toLocaleString()}
                  </p>
                </p>
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
                  ) : (
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
                  )}
                  <p className="text-sm text-gray-800">{replay.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllReplay;
