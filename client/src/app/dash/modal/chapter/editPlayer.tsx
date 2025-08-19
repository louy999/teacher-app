import ReactPlayer from "react-player";
import React, { useState } from "react";
import axios from "axios";

const EditPlayer = ({ lesson, setLesson }) => {
  const [openModal, setOpenModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const handleEditClick = async () => {
    setLoading(true);
    try {
      await axios.patch(`${process.env.local}/lessons`, {
        title: lesson.title,
        chapter_id: lesson.chapter_id,
        video_url: newTitle,
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

  return (
    <>
      <div className={`cursor-pointer w-full h-[70%] mb-4`}>
        <div
          onClick={() => setOpenModal(true)}
          className="text-lg font-semibold mb-2 border rounded-md p-2 bg-slate-300"
        >
          {lesson.video_url}
        </div>
        <ReactPlayer
          url={`${lesson.video_url}`}
          controls
          width="100%"
          height="100%"
        />
      </div>
      {openModal && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="modal-content bg-white p-4 rounded-lg shadow-lg">
            <h2>Edit Lesson Video</h2>
            <input
              type="text"
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new lesson video"
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

export default EditPlayer;
