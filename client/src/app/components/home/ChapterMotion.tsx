"use client";
import { motion } from "framer-motion";

export const ChapterMotion = ({ children, index }: { children: React.ReactNode, index: number }) => (
  <motion.section
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative pl-8 md:pl-12 border-l-2 border-slate-100 last:border-l-transparent pb-12 group"
  >
    {/* نقطة الربط على الخط الزمني */}
    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
    {children}
  </motion.section>
);