import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import { FaPoundSign } from "react-icons/fa";

const EditNameLesson = ({ lesson, setLesson }) => {
  const [openModal, setOpenModal] = useState(false);
  const [newTitle, setNewTitle] = useState(lesson.title || "");
  const [loading, setLoading] = useState(false);
  const [priceUpdate, setPriceUpdate] = useState(lesson.price);
  const [openModalEditPrice, setOpenModalEditPrice] = useState(false);

  const handleEditClick = async () => {
    setLoading(true);
    try {
      await axios.patch(`${process.env.local}/lessons`, {
        title: newTitle,
        chapter_id: lesson.chapter_id,
        video_url: lesson.video_url,
        image_url: lesson.image_url,
        is_active: lesson.is_active,
        is_paid: lesson.is_paid,
        price: lesson.price,
        id: lesson.id,
      });

      const update = await axios.get(
        `${process.env.local}/lessons/${lesson.id}`
      );

      setLesson(update.data.data);

      setOpenModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditActive = async (activeSta) => {
    setLoading(true);
    try {
      await axios.patch(`${process.env.local}/lessons`, {
        title: lesson.title,
        chapter_id: lesson.chapter_id,
        video_url: lesson.video_url,
        image_url: lesson.image_url,
        is_active: activeSta,
        is_paid: lesson.is_paid,
        price: lesson.price,
        id: lesson.id,
      });

      const update = await axios.get(
        `${process.env.local}/lessons/${lesson.id}`
      );

      setLesson(update.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditPrice = async (price) => {
    setLoading(true);
    try {
      await axios.patch(`${process.env.local}/lessons`, {
        title: lesson.title,
        chapter_id: lesson.chapter_id,
        video_url: lesson.video_url,
        image_url: lesson.image_url,
        is_active: lesson.is_active,
        is_paid: price > 0 ? true : false,
        price: price,
        id: lesson.id,
      });

      const update = await axios.get(
        `${process.env.local}/lessons/${lesson.id}`
      );
      setLesson(update.data.data);
      setOpenModalEditPrice(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex  w-fit h-16 py-2 mb-3  gap-4">
        <div
          onClick={() => setOpenModal(true)}
          className="flex gap-4 items-center h-full border bg-slate-300 p-2 rounded-md mb-3  cursor-pointer hover:opacity-80 duration-300 w-fit"
        >
          <div>{lesson.title}</div>
          <CiEdit />
        </div>
        <div
          onClick={() => setOpenModalEditPrice(true)}
          className="flex gap-4 items-center h-full border bg-slate-300 p-2 rounded-md mb-3  cursor-pointer hover:opacity-80 duration-300 w-fit"
        >
          <div className="flex items-center gap-1">
            {lesson.price}
            <FaPoundSign />
          </div>
          <CiEdit />
        </div>
        <div className="flex items-center gap-3">
          <div>Active:</div>
          <div className="h-full w-full relative">
            <div
              className={`flex items-center cursor-pointer hover:opacity-70 duration-300 ${
                lesson.is_active ? "justify-start" : "justify-end"
              } duration-300 h-full bg-slate-300 px-2 w-20  rounded-2xl   `}
              onClick={() => {
                handleEditActive(!lesson.is_active);
              }}
            >
              <div
                className={`rounded-full ${
                  lesson.is_active ? "bg-blue-400" : "bg-black"
                } w-7 h-7`}
              ></div>
            </div>
            {loading && (
              <div className="absolute top-0 rounded-2xl text-center flex items-center justify-center z-30 w-full h-full bg-black/80">
                Loading...
              </div>
            )}
          </div>
        </div>
      </div>
      {openModalEditPrice && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="modal-content bg-white p-4 rounded-lg shadow-lg">
            <h2>Edit Lesson Price</h2>
            <input
              type="text"
              onChange={(e) => setPriceUpdate(e.target.value)}
              placeholder="Enter new lesson price"
              value={priceUpdate}
              className={`border rounded-md p-2 w-full`}
            />
            <div className="flex justify-between items-center mt-4 gap-4">
              {loading ? (
                <button className="py-2 cursor-pointer w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                  Loading...
                </button>
              ) : (
                <button
                  className="py-2 cursor-pointer w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                  onClick={() => handleEditPrice(priceUpdate)}
                >
                  Save
                </button>
              )}
              <button
                className="py-2 cursor-pointer w-full bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                onClick={() => setOpenModalEditPrice(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {openModal && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="modal-content bg-white p-4 rounded-lg shadow-lg">
            <h2>Edit Lesson Name</h2>
            <input
              type="text"
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new lesson name"
              value={newTitle}
              className={`border rounded-md p-2 w-full`}
            />
            <div className="flex justify-between items-center mt-4 gap-4">
              {loading ? (
                <button className="py-2 cursor-pointer w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                  Loading...
                </button>
              ) : (
                <button
                  className="py-2 cursor-pointer w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                  onClick={handleEditClick}
                >
                  Save
                </button>
              )}
              <button
                className="py-2 cursor-pointer w-full bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                onClick={() => setOpenModal(false)}
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

export default EditNameLesson;
