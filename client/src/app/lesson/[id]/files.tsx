"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, FileArchive, FileCode } from "lucide-react";

type FileData = {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
};

const Files = ({ files }: { files: FileData }) => {
  

 
  const getFileStyle = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return { icon: <FileText size={20} />, color: "text-red-500", bg: "bg-red-50" };
    if (ext === "zip" || ext === "rar") return { icon: <FileArchive size={20} />, color: "text-amber-500", bg: "bg-amber-50" };
    return { icon: <FileCode size={20} />, color: "text-indigo-500", bg: "bg-indigo-50" };
  };



  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">
          Lesson <span className="text-indigo-600">Materials</span>
        </h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full uppercase">
          {files.length} Files
        </span>
      </div>

      <AnimatePresence>
        {files.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem]"
          >
            <p className="text-sm text-slate-400 font-medium">No resources attached to this lesson.</p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 gap-4"
          >
            {files.map((file) => {
              const downloadLink = `${file.file_type}/${file.file_url}`;
              const style = getFileStyle(file.file_url);
              const ext = file.file_url.split(".").pop();

              return (
                <motion.a
                  key={file.id}
                  href={downloadLink}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ x: 5, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${style.bg} ${style.color}`}>
                      {style.icon}
                    </div>
                    <div>
                      <h3 className="text-slate-700 font-bold capitalize group-hover:text-indigo-600 transition-colors">
                        {file.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                         {ext} File
                      </p>
                    </div>
                  </div>

                  <div className="p-2 text-slate-300 group-hover:text-indigo-500 transition-colors">
                    <Download size={20} />
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Files;