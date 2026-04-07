/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { use } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  LockKeyhole, 
  Home, 
  ChevronLeft, 
  MessageCircle, 
  AlertCircle 
} from "lucide-react";

const GoHomeButton = () => {
  const router = useRouter();
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push("/")}
      className="mt-8 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all"
    >
      <Home size={18} />
      Return to Dashboard
    </motion.button>
  );
};

interface Params {
  id: string;
}

const NotSubscription = ({ params }: { params: Promise<Params> }) => {
  // استخدام React.use() لفك البروميس في مكونات الخادم/العميل
  const resolvedParams = use(params);
  const [lessonTitle, setLessonTitle] = React.useState("");

  React.useEffect(() => {
    const fetchTitle = async () => {
      try {
        const res = await axios.get(`${process.env.local}/lessons/${resolvedParams.id}`);
        setLessonTitle(res.data.data.title);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTitle();
  }, [resolvedParams.id]);

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white border border-gray-100 p-10 rounded-[3rem] shadow-2xl shadow-gray-100 text-center flex flex-col items-center"
      >
        {/* Animated Icon Container */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 10 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", ease: "easeInOut" }}
          className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-8"
        >
          <LockKeyhole size={48} strokeWidth={1.5} />
        </motion.div>

        {/* Text Content */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-red-400 font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <AlertCircle size={12} /> Access Denied
          </motion.div>
          
          <h2 className="text-2xl font-black text-gray-800 leading-tight">
            Subscription Required
          </h2>
          
          <div className="bg-gray-50 px-4 py-2 rounded-xl inline-block border border-gray-100">
            <p className="text-sm font-bold text-gray-500 italic">
               &quot;{lessonTitle || "Loading lesson details..."}&quot;
            </p>
          </div>

          <p className="text-gray-400 text-sm font-medium leading-relaxed pt-2">
            It looks like you haven&apos;t joined this lesson yet. 
            Please reach out to your teacher to get full access.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center w-full">
          <GoHomeButton />
          
          <motion.button 
            whileHover={{ y: -2 }}
            className="mt-4 flex items-center gap-2 text-gray-400 font-bold text-xs hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={14} />
            Contact Support
          </motion.button>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -z-10 w-64 h-64 bg-blue-50/50 blur-[100px] rounded-full" />
      </motion.div>
    </div>
  );
};

export default NotSubscription;