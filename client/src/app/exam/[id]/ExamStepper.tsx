"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  total: number;
  current: number;
  answers: Record<number, string>;
}

const ExamStepper = ({ total, current, answers }: StepperProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar max-w-[70%]">
      {Array.from({ length: total }).map((_, idx) => {
        const isSelected = current === idx;
        const hasAnswer = answers[idx] !== undefined;

        return (
          <div key={idx} className="flex items-center shrink-0">
            <motion.div
              animate={{
                scale: isSelected ? 1.1 : 1,
                backgroundColor: isSelected ? "#000" : hasAnswer ? "#10b981" : "#fff",
                borderColor: isSelected ? "#000" : hasAnswer ? "#10b981" : "#e2e8f0",
                color: isSelected || hasAnswer ? "#fff" : "#94a3b8",
              }}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors shadow-sm`}
            >
              {hasAnswer && !isSelected ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                idx + 1
              )}
            </motion.div>

            {idx !== total - 1 && (
              <div className="w-4 h-[2px] bg-slate-100 mx-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: hasAnswer ? "100%" : 0 }}
                  className="h-full bg-emerald-400"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExamStepper;