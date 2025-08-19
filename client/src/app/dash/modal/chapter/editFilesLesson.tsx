"use client";
import { GoFile } from "react-icons/go";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";

type FileData = {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
};

const EditFilesLesson = ({ lessonId }: { lessonId: string }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [modal, setModal] = useState(false);
  const [titleFiles, setTitleFiles] = useState("");
  const [fileUrl, setFileUrl] = useState<File | null>(null);
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    fetchFiles();
  }, [lessonId]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/files/lesson/${lessonId}`
      );
      setFiles(res.data.data);
    } catch (error) {
      console.error("Error fetching lesson files:", error);
    }
  };

  const handleUpload = async () => {
    if (!fileUrl) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append(`${fileType}`, fileUrl);
    formData.append("title", titleFiles);
    formData.append("file_type", fileType);
    formData.append("lesson_id", lessonId);
    console.log(fileUrl);
    console.log(titleFiles);
    console.log(fileType);
    console.log(lessonId);
    try {
      const addFilesUrl = await axios.post(
        `${process.env.img}/upload/${fileType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const res = await axios.post(`${process.env.local}/files`, {
        title: titleFiles,
        file_url: addFilesUrl.data,
        file_type: fileType,
        lesson_id: lessonId,
      });
      console.log(res.data.data);

      await fetchFiles();

      setModal(false);
      setTitleFiles("");
      setFileUrl(null);
      setFileType("");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const handleDelete = async (fileId: string) => {
    try {
      await axios.delete(`${process.env.local}/files/${fileId}`);
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  return (
    <>
      <div className="mt-22 rounded-md">
        <div
          onClick={() => setModal(true)}
          className="flex w-fit items-center gap-4 hover:text-3xl duration-300 hover:opacity-50 cursor-pointer"
        >
          <h2 className="text-xl font-bold text-gray-700">Lesson Material</h2>
          <IoMdAddCircle className="text-2xl" />
        </div>

        {files.length === 0 ? (
          <p className="text-sm text-gray-500">
            No files available for this lesson.
          </p>
        ) : (
          <ul className="space-y-3 mt-4">
            {files.map((file) => {
              const downloadLink = `${process.env.img}/${file.file_type}/${file.file_url}`;
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 hover:p-3 hover:mb-3 duration-300 rounded-md transition-all"
                >
                  <Link
                    href={downloadLink}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center  gap-3 cursor-pointer hover:bg-slate-100 hover:p-3 hover:mb-3 duration-300 rounded-md transition-all"
                  >
                    {" "}
                    <div className="flex items-center justify-center bg-[#F0F2F5] rounded-md p-3">
                      <GoFile className="text-xl" />
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
                  <MdDeleteForever
                    onClick={() => handleDelete(file.id)}
                    className="text-3xl text-red-400 hover:text-4xl hover:opacity-55 duration-300"
                  />
                </div>
              );
            })}
          </ul>
        )}
      </div>

      {modal && (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white rounded-md shadow-md p-6 w-[400px] space-y-4">
            <h2 className="text-xl font-bold">Upload File</h2>

            <input
              type="text"
              placeholder="Enter title"
              value={titleFiles}
              onChange={(e) => setTitleFiles(e.target.value)}
              className="border p-2 w-full rounded-md"
            />

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileUrl(file);
                  const isImage = file.type.startsWith("image/");
                  setFileType(isImage ? "image" : "file");
                }
              }}
              className="border p-2 w-full rounded-md"
            />

            <div className="flex justify-between gap-4">
              <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
              >
                Upload
              </button>
              <button
                onClick={() => setModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditFilesLesson;
