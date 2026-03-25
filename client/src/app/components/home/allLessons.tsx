"use client";
import React from "react";
import SubAndViewLesson from "./subAndViewLesson";
import { motion } from "framer-motion";

interface AllLessonsProps {
  allData: any[]; // يفضل تعريف الـ Interface الخاص بك هنا
}

const AllLessons: React.FC<AllLessonsProps> = ({ allData }) => {
  // ترتيب البيانات
  const sortedLessons = [...allData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="w-full py-6">
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 } // ظهور الدروس واحد تلو الآخر
          }
        }}
        className="flex gap-6 overflow-x-auto pb-8 pt-2 px-2 no-scrollbar"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {sortedLessons.map((lesson) => (
          <motion.div 
            key={lesson.id} 
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            style={{ scrollSnapAlign: "start" }}
          >
            <SubAndViewLesson lesson={lesson} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AllLessons;