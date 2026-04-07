"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit3, 
  Layout, 
  Layers, 
  GraduationCap, 
  Loader2, 
  X,
  PlusCircle
} from "lucide-react";
import AllLessonsDash from "./allLessons";
import EditChapterName from "../modal/chapter/editChapterName";
import LessonsFetch from "./lessonsFetch";
import AddLessonButton from "../modal/chapter/addLessonButton";

const ChapterDash = () => {
  const [dataChapter, setDataChapter] = useState([]);
  const [openModelEditChapter, setOpenModelEditChapter] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStage, setNewStage] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [loading, setLoading] = useState(false);
  const [editChapterId, setEditChapterId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [openModalAddChapter, setOpenModalAddChapter] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const [grade, setGrade] = useState("");

  const availableGrades = process.env.grade ? process.env.grade.split(",") : [];

  const fetchAllChapters = async () => {
    try {
      const res = await axios.get(`${process.env.local}/chapters/teacher/${process.env.teacherId}`);
      setDataChapter(res.data.data);
    } catch  {
    }
  };

  useEffect(() => { fetchAllChapters(); }, []);

  const handleAddChapter = async () => {
    if (!chapterName || !grade) return alert("Please fill all fields");
    setLoading(true);
    try {
      await axios.post(`${process.env.local}/chapters`, {
        name: chapterName, stage: grade, teacher_id: process.env.teacherId,
      });
      setOpenModalAddChapter(false);
      setChapterName(""); setGrade("");
      await fetchAllChapters();
    } catch  {  } 
    finally { setLoading(false); }
  };

  const handleSubmitEditChapter = async () => {
    setLoading(true);
    try {
      await axios.patch(`${process.env.local}/chapters`, {
        name: newName, stage: newStage, id: editChapterId,
      });
      await fetchAllChapters();
      setOpenModelEditChapter(false);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-2 h-screen max-h-[900px]">
      {/* Sidebar: Chapters List */}
      <div className="w-full lg:w-[400px] flex flex-col bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-5 bg-white border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Layers size={20} />
            </div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">Chapters</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpenModalAddChapter(true)}
            className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors"
          >
            <PlusCircle size={28} />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          <AnimatePresence>
            {dataChapter
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 leading-tight">{c.name}</span>
                      <span className="text-[10px] font-black text-indigo-500 uppercase mt-1 flex items-center gap-1">
                        <GraduationCap size={12} /> {c.stage}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AddLessonButton 
                        chapterId={c.id} 
                        onLessonAdded={() => setReloadKey(prev => prev + 1)} 
                      />
                      <button 
                        onClick={() => {
                          setOpenModelEditChapter(true);
                          setNewName(c.name);
                          setNewStage(c.stage);
                          setEditChapterId(c.id);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50/30">
                    <AllLessonsDash
                      chapterId={c.id}
                      key={`${c.id}-${reloadKey}`}
                      setLessonId={setLessonId}
                    />
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content: Lesson Preview */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {lessonId ? (
          <LessonsFetch lessonId={lessonId} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4 opacity-50">
            <Layout size={80} strokeWidth={1} />
            <p className="font-bold text-lg text-center px-4">Select a lesson from the sidebar to view details</p>
          </div>
        )}
      </div>

      {/* Add Chapter Modal */}
      <AnimatePresence>
        {openModalAddChapter && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-800 tracking-tighter">New Chapter</h2>
                <button onClick={() => setOpenModalAddChapter(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2">Chapter Title</label>
                  <input
                    onChange={(e) => setChapterName(e.target.value)}
                    value={chapterName}
                    placeholder="e.g. Chemical Bonds"
                    className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-2">Target Grade</label>
                  <div className="relative">
                    <select
                      onChange={(e) => setGrade(e.target.value)}
                      value={grade}
                      className="w-full border border-gray-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 appearance-none font-medium cursor-pointer"
                    >
                      <option disabled value="">Select Grade</option>
                      {availableGrades.map((g, i) => <option key={i} value={g.trim()}>{g.trim()}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Layout size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddChapter}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                Create Chapter
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Chapter Component */}
      {openModelEditChapter && (
        <EditChapterName
          setOpenModelEditChapter={setOpenModelEditChapter}
          dataTeacher={availableGrades} 
          setNewStage={setNewStage}
          newStage={newStage}
          newName={newName}
          setNewName={setNewName}
          loading={loading}
          onSubmitEdit={handleSubmitEditChapter}
        />
      )}
    </div>
  );
};

export default ChapterDash;