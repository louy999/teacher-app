/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Trash2, 
  ExternalLink, 
  FileCode, 
  Image as ImageIcon,
  Loader2,
  X,
  UploadCloud,
  File
} from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.local}/files/lesson/${lessonId}`);
      setFiles(res.data.data);
    } catch (error) {
      console.error("Error fetching lesson files:", error);
    }
  }, [lessonId]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const handleUpload = async () => {
    if (!fileUrl || !titleFiles) {
      alert("Please enter a title and select a file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("images", fileUrl); // اعتماداً على الـ Backend الجديد الخاص بك
    formData.append("title", titleFiles);
    formData.append("file_type", fileType);
    formData.append("lesson_id", lessonId);

    try {
      // الرفع إلى Cloudinary أو السيرفر الخاص بك
      const uploadRes = await axios.post(
        `${process.env.img}/upload/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const finalUrl = uploadRes.data.urls ? uploadRes.data.urls[0] : uploadRes.data;

      // حفظ البيانات في قاعدة البيانات
      await axios.post(`${process.env.local}/files`, {
        title: titleFiles,
        file_url: finalUrl,
        file_type: fileType,
        lesson_id: lessonId,
      });

      await fetchFiles();
      setModal(false);
      setTitleFiles("");
      setFileUrl(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if(!confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`${process.env.local}/files/${fileId}`);
      setFiles(prev => prev.filter((f) => f.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // أيقونة ديناميكية حسب نوع الملف
  const getFileIcon = (url: string) => {
    if (url.includes(".pdf")) return <FileText className="text-red-500" />;
    if (url.match(/\.(jpg|jpeg|png|gif)$/i)) return <ImageIcon className="text-blue-500" />;
    return <File className="text-indigo-500" />;
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
            <FileCode size={20} />
          </div>
          <h2 className="text-lg font-black text-gray-800 tracking-tight">Resources</h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} /> Add Material
        </motion.button>
      </div>

      {/* Files List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {files.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-10 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200"
            >
              <FileText className="mx-auto text-gray-300 mb-2" size={40} strokeWidth={1} />
              <p className="text-sm text-gray-400 font-medium">No materials uploaded yet</p>
            </motion.div>
          ) : (
            files.map((file, i) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-indigo-50 transition-colors">
                    {getFileIcon(file.file_url)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 capitalize line-clamp-1">{file.title}</h3>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                      {file.file_url.split('.').pop() || 'File'} Resource
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a 
                    href={file.file_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={() => handleDelete(file.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-gray-800 tracking-tight">Upload Resource</h2>
                <button onClick={() => setModal(false)} className="text-gray-400 hover:text-red-500"><X /></button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Resource Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Chapter 1 Summary"
                    value={titleFiles}
                    onChange={(e) => setTitleFiles(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-2">File Attachment</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {fileUrl ? (
                        <p className="text-xs text-indigo-600 font-bold">{fileUrl.name}</p>
                      ) : (
                        <>
                          <UploadCloud className="text-gray-300 mb-2" size={30} />
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Click to select file</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileUrl(file);
                          setFileType(file.type.startsWith("image/") ? "image" : "file");
                        }
                      }}
                    />
                  </label>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={loading || !fileUrl || !titleFiles}
                  className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Start Upload"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditFilesLesson;