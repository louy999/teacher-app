"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import AllLessonsDash from "./allLessons";
import { IoMdAddCircle } from "react-icons/io";
import EditChapterName from "../modal/chapter/editChapterName";
import LessonsFetch from "./lessonsFetch";
import AddLessonButton from "../modal/chapter/addLessonButton";

const ChapterDash = () => {
  const [dataChapter, setDataChapter] = useState([]);
  const [openModelEditChapter, setOpenModelEditChapter] = useState(false);
  const [newName, setNewName] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [loading, setLoading] = useState(false);
  const [editChapterId, setEditChapterId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [openModalAddChapter, setOpenModalAddChapter] = useState(false);
  const [dataTeacher, setDataTeacher] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [grade, setGrade] = useState("");

  const fetchAllChapters = async () => {
    try {
      const res = await axios.get(
        `${process.env.local}/chapters/teacher/${process.env.teacherId}`
      );
      setDataChapter(res.data.data);
    } catch (error) {
      console.log("Error fetching chapters:", error);
    }
  };

  useEffect(() => {
    fetchAllChapters();
  }, []);

  const handleSubmitEditChapter = async () => {
    setLoading(true);
    try {
      await axios.patch(`${process.env.local}/chapters`, {
        name: newName,
        id: editChapterId,
      });
      await fetchAllChapters();
      setOpenModelEditChapter(false);
    } catch (error) {
      console.error("Failed to update chapter name:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddChapter = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.local}/chapters`, {
        name: chapterName,
        stage: grade,
        teacher_id: process.env.teacherId,
      });
      setOpenModalAddChapter(false);
      setChapterName("");
      setGrade("");
      await fetchAllChapters();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="p-4 bg-black/10 rounded-lg shadow-lg md:min-w-3/12 md:w-fit mx-auto md:mx-px w-11/12">
          <div className="text-2xl font-semibold mb-4 flex justify-between items-center">
            <div>Chapters</div>
            <IoMdAddCircle
              className="cursor-pointer"
              onClick={async () => {
                setLoading(true);
                try {
                  const teacher = await axios.get(
                    `${process.env.local}/teacher/${process.env.teacherId}`
                  );
                  setDataTeacher(teacher.data.data.grade_levels);
                  setOpenModalAddChapter(true);
                  setLoading(false);
                } catch (error) {
                  console.log(error);
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>
          {dataChapter
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((c, i) => (
              <div key={i} className="w-full">
                <div className="flex text-xl gap-4 justify-between items-center mt-3 p-2 bg-white rounded-lg hover:bg-gray-100 capitalize duration-300">
                  <div>
                    <span>{c.name}</span>{" "}
                    <span className="text-sm text-slate-600">{c.stage}</span>
                  </div>
                  <div className="flex items-center gap-3 text-2xl ">
                    <AddLessonButton
                      chapterId={c.id}
                      onLessonAdded={() => setReloadKey((prev) => prev + 1)}
                    />
                    <FiEdit
                      onClick={() => {
                        setOpenModelEditChapter(true);
                        setNewName(c.name);
                        setEditChapterId(c.id);
                      }}
                      className="cursor-pointer hover:text-2xl duration-300"
                    />
                  </div>
                </div>

                <AllLessonsDash
                  chapterId={c.id}
                  key={`${c.id}-${reloadKey}`}
                  setLessonId={setLessonId}
                />
              </div>
            ))}
        </div>
        <LessonsFetch lessonId={lessonId} />
      </div>
      {openModelEditChapter && (
        <EditChapterName
          setOpenModelEditChapter={setOpenModelEditChapter}
          newName={newName}
          setNewName={setNewName}
          loading={loading}
          onSubmitEdit={handleSubmitEditChapter}
        />
      )}
      {openModalAddChapter && (
        <div className="bg-black/50 fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-4">
            <h2>Add New Chapter</h2>
            <div className="relative my-4">
              <label
                htmlFor="chapter"
                className="absolute -top-2 px-2 left-2 bg-white  text-sm text-gray-600 font-semibold"
              >
                Chapter Name
              </label>
              <input
                onChange={(e) => setChapterName(e.target.value)}
                value={chapterName}
                name="chapter"
                id="chapter"
                type="text"
                className="border border-slate-300 rounded-md p-2 w-full"
              />
              <select
                name="chapter"
                id="chapter"
                onChange={(e) => setGrade(e.target.value)}
                value={grade}
                placeholder="Select Grade"
                className="border border-slate-300 rounded-md p-2 w-full mt-2"
              >
                <option disabled value="">
                  chose grade
                </option>
                {dataTeacher.map((grade, index) => (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between gap-2">
              {loading ? (
                <button className="bg-blue-400 hover:bg-blue-500 duration-300 cursor-pointer w-full text-white px-4 py-2 rounded-md">
                  loading...
                </button>
              ) : (
                <button
                  onClick={handleAddChapter}
                  className="bg-blue-500 duration-300 cursor-pointer w-full text-white px-4 py-2 rounded-md"
                >
                  Add
                </button>
              )}
              <button
                onClick={() => setOpenModalAddChapter(false)}
                className="bg-red-400 cursor-pointer hover:bg-red-500 duration-300 w-full text-white px-4 py-2 rounded-md"
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

export default ChapterDash;
