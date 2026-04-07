/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, UploadCloud, X, RefreshCw } from "lucide-react";

const ExamImage = ({
  currentQuestion,
  setEditImage,
}: {
  currentQuestion: any;
  setEditImage: (file: File | null) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setEditImage(null);
    setPreview(null);
  };

  const currentImageUrl = currentQuestion?.file_url 
    ? `${process.env.img}/image/${currentQuestion.file_url}` 
    : null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md relative group">
        <AnimatePresence mode="wait">
          {(preview || currentImageUrl) ? (
            <motion.div
              key="image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative aspect-video w-full rounded-[2rem] overflow-hidden border-4 border-white shadow-xl"
            >
              <Image
                src={preview || currentImageUrl || ""}
                alt="Question Content"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <label className="p-3 bg-white/90 backdrop-blur-md rounded-2xl cursor-pointer hover:bg-white text-blue-600 transition-all shadow-lg">
                  <RefreshCw size={20} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
                <button 
                  onClick={removeImage}
                  className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-red-500 hover:bg-white transition-all shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.label
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 text-gray-300">
                <UploadCloud size={32} strokeWidth={1.5} />
              </div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Click to upload illustration</p>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </motion.label>
          )}
        </AnimatePresence>
      </div>
      
      {/* File Type Badge (Optional) */}
      {(preview || currentImageUrl) && (
        <div className="mt-4 px-3 py-1 bg-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">
          {preview ? "New Upload" : "Current Resource"}
        </div>
      )}
    </div>
  );
};

export default ExamImage;