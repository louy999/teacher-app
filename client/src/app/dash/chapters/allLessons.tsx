import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const AllLessonsDash = ({ chapterId, setLessonId }) => {
  const [allData, setAllData] = useState([]);

  const addLessonsFetch = async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/lessons/chapter/${chapterId}`
      );
      setAllData(res.data.data);
    } catch (error) {
      console.log("Error fetching lessons:", error);
    }
  };
  useEffect(() => {
    addLessonsFetch();
  }, []);
  const handleDeleteLesson = async (lessonId) => {
    try {
      const res = await axios.delete(
        `${process.env.local}/lessons/${lessonId}`
      );
      console.log(res.data.data);
      addLessonsFetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {allData
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((l, i) => (
          <div
            className="pl-2 hover:pl-4 flex justify-between gap-4 items-center duration-300 my-2 cursor-pointer "
            key={i}
            onClick={() => setLessonId(l.id)}
          >
            {l.title}
            <div className="flex items-center gap-3 text-2xl">
              <MdDeleteForever
                className="cursor-pointer"
                onClick={() => handleDeleteLesson(l.id)}
              />
              <FaArrowRight />
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllLessonsDash;
