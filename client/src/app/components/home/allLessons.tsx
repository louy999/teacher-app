/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo } from "react";
import SubAndViewLesson from "./subAndViewLesson";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOff } from "lucide-react";

interface AllLessonsProps {
  allData: any[];
}

const AllLessons: React.FC<AllLessonsProps> = ({ allData }) => {
  const [showOnlyActive] = useState(true);

  const filteredLessons = useMemo(() => {
    let result = [...allData];

    if (showOnlyActive) {
      result = result.filter((lesson) => lesson.is_active === 1 || lesson.is_active === true);
    }

    return result.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [allData, showOnlyActive]);

  return (
    <div className="w-full py-6 space-y-6">
      {/* Horizontal Scroll Area */}
      <motion.div 
        layout
        className="flex gap-6 overflow-x-auto pb-8 pt-2 px-4 no-scrollbar scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <AnimatePresence mode="popLayout">
          {filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <motion.div 
                key={lesson.id} 
                layout
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ scrollSnapAlign: "start" }}
                className="shrink-0"
              >
                <SubAndViewLesson lesson={lesson} />
              </motion.div>
            ))
          ) : (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-10 flex flex-col items-center justify-center text-gray-400"
            >
                <div className="p-4 bg-gray-50 rounded-full mb-3">
                    <EyeOff size={32} strokeWidth={1.5} />
                </div>
                <p className="text-xs font-bold italic">No active lessons found.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* CSS for no-scrollbar */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AllLessons;