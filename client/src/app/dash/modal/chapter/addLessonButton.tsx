"use client";
import { IoMdAddCircle } from "react-icons/io";
import React, { useState } from "react";
import axios from "axios";

const AddLessonButton = ({ chapterId, onLessonAdded }) => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState("");

  const addLessonHandel = async () => {
    setLoading(true);
    try {
      let uploadedImageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await axios.post(
          `${process.env.img}/upload/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadedImageUrl = uploadRes.data;
      }

      const res = await axios.post(`${process.env.local}/lessons`, {
        title,
        chapter_id: chapterId,
        video_url: videoUrl,
        image_url: uploadedImageUrl,
        is_active: true,
        is_paid: price > 0 ? true : false,
        price,
      });

      console.log(res.data.data);
      setOpenModal(false);

      if (onLessonAdded) {
        await onLessonAdded();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IoMdAddCircle
        className="cursor-pointer"
        onClick={() => setOpenModal(true)}
      />
      {openModal && (
        <div className="fixed w-screen h-screen z-50 flex justify-center items-center top-0 left-0 bg-black/50 ">
          <div className="bg-white shadow-2xl rounded-md p-2 w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-center">
              Add New Lesson
            </h2>
            <div>
              <div className="mb-2 p-2 relative">
                <label
                  htmlFor="title"
                  className="text-base absolute -top-2 left-4 px-2 bg-white"
                >
                  Enter Your title
                </label>
                <input
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  className="border text-base border-slate-300 p-2 shadow-md rounded-md w-full"
                />
              </div>

              <div className="mb-2 p-2 relative">
                <label
                  htmlFor="video"
                  className="text-base absolute -top-2 left-4 px-2 bg-white"
                >
                  Enter Your video
                </label>
                <input
                  id="video"
                  onChange={(e) => setVideoUrl(e.target.value)}
                  value={videoUrl}
                  type="text"
                  className="border text-base border-slate-300 p-2 shadow-md rounded-md w-full"
                />
              </div>

              <div className="mb-2 p-2 relative">
                <label
                  htmlFor="img"
                  className="text-base absolute -top-2 left-4 px-2 bg-white"
                >
                  Upload Image
                </label>
                <input
                  id="img"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="border text-base border-slate-300 p-2 shadow-md rounded-md w-full"
                />
              </div>

              <div className="mb-2 p-2 relative">
                <label
                  htmlFor="price"
                  className="text-base absolute -top-2 left-4 px-2 bg-white"
                >
                  Enter Your price
                </label>
                <input
                  id="price"
                  onChange={(e) => setPrice(Number(e.target.value))}
                  value={price}
                  type="number"
                  className="border text-base border-slate-300 p-2 shadow-md rounded-md w-full"
                />
              </div>
            </div>

            <div className="flex gap-5 justify-between items-center mt-4">
              <button
                type="submit"
                onClick={addLessonHandel}
                disabled={loading}
                className={`py-2 w-full text-white rounded-md transition duration-200 ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Loading..." : "Save Changes"}
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="py-2 w-full bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddLessonButton;
