"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiImageOn } from "react-icons/ci";
import Image from "next/image";
import { jwtVerify } from "jose";
import { getCookie } from "cookies-next/client";
import socket from "../../lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Paperclip, Loader2 } from "lucide-react";

interface AddCommentProps {
  lessonId: string;
  studentId: string;
}

const AddComment: React.FC<AddCommentProps> = ({ lessonId, studentId }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [textInput, setTextInput] = useState("");
  const [errText, setErrText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const userDe = getCookie("UserDe");
  const dataRoleToken = getCookie("dataRoleToken");

  useEffect(() => {
    const validationUserToken = async () => {
      try {
        if (!dataRoleToken || !userDe) return;
        const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
        
        const userToken: any = await jwtVerify(dataRoleToken as string, secret);
        const StudentToken: any = await jwtVerify(userDe as string, secret);

        setNameUser(userToken.payload.user.full_name || "Student");
        setImageSrc(StudentToken.payload.roleData.profile_pic);
      } catch (error) { console.error("Token Validation Error", error); }
    };
    validationUserToken();
  }, [dataRoleToken, userDe]);

  const handelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(selectedFile.type.startsWith("image/") ? URL.createObjectURL(selectedFile) : null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const addCommentHandel = async () => {
    if (!textInput.trim()) {
      setErrText(true);
      setTimeout(() => setErrText(false), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      let finalFileUrl = "";
      let finalFileType = "";

      if (file) {
        const formData = new FormData();
        const isImage = file.type.startsWith("image/");
        
        // ربط الـ Field Name بما يتوقعه السيرفر (images للصور و file للملفات)
        if (isImage) {
          formData.append("images", file);
        } else {
          formData.append("file", file);
        }

        const uploadEndpoint = isImage ? "/upload/images" : "/upload/file";
        const uploadRes = await axios.post(`${process.env.img}${uploadEndpoint}`, formData);

        // استخراج الرابط من Cloudinary بناءً على استجابة السيرفر
        finalFileUrl = isImage ? uploadRes.data.urls[0] : uploadRes.data.url;
        finalFileType = isImage ? "image" : "file";
      }

      // إرسال التعليق النهائي لقاعدة البيانات
      await axios.post(`${process.env.local}/comments`, {
        text: textInput,
        user_id: studentId,
        lesson_id: lessonId,
        file_url: finalFileUrl,
        file_type: finalFileType,
        shown: false,
      });

      socket.emit("add_comment");
      setTextInput("");
      removeFile();
    } catch (error) {
      console.error("Submission Failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-[2rem] p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-50">
          <Image
            fill
            src={imageSrc }
            alt="profile"
            className="object-cover"
          />
        </div>
        <span className="text-sm font-bold text-slate-700 capitalize">{nameUser}</span>
      </div>

      <div className="relative">
        {/* File Preview */}
        <AnimatePresence>
          {file && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-3 relative inline-block"
            >
              {previewUrl ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-sm">
                  <Image fill src={previewUrl} alt="preview" className="object-cover" />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Paperclip size={16} className="text-indigo-500" />
                  <span className="text-xs font-medium text-slate-600 truncate max-w-[150px]">{file.name}</span>
                </div>
              )}
              <button 
                onClick={removeFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <div className={`flex items-end gap-2 p-2 bg-slate-50 rounded-[1.5rem] border transition-all ${errText ? 'border-red-400 shake' : 'border-transparent focus-within:border-indigo-200 focus-within:bg-white'}`}>
          <textarea
            rows={1}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent border-none focus:ring-0 p-3 text-sm text-slate-700 placeholder:text-slate-400 resize-none max-h-32"
          />
          
          <div className="flex items-center gap-1 pb-1 pr-1">
            <input
              id="file-comment-upload"
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handelFile}
            />
            <label 
              htmlFor="file-comment-upload"
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full cursor-pointer transition-all"
            >
              <CiImageOn size={24} />
            </label>

            <motion.button
              whileTap={{ scale: 0.9 }}
              disabled={isSubmitting || !textInput.trim()}
              onClick={(e) => { e.preventDefault(); addCommentHandel(); }}
              className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </motion.button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </motion.div>
  );
};

export default AddComment;