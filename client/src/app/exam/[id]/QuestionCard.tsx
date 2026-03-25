/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { motion } from "framer-motion";

const QuestionCard = ({ question, index, selectedAnswer, onSelect, isTimeUp }: any) => {
  return (
    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-500 mb-2 block">
        Question #{index + 1}
      </span>
      
      {question.file_url && (
        <div className="relative w-full h-64 mb-6 rounded-[2rem] overflow-hidden border border-slate-100">
          <Image 
            src={`${process.env.img}/image/${question.file_url}`} 
            alt="Question" fill className="object-cover" 
          />
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug mb-8">
        {question.question}
      </h2>

      <div className="grid gap-4">
        {question.answers.map((ans: string, i: number) => (
          <motion.button
            key={i}
            whileHover={!isTimeUp ? { x: 10 } : {}}
            whileTap={!isTimeUp ? { scale: 0.98 } : {}}
            onClick={() => onSelect(ans)}
            disabled={isTimeUp}
            className={`flex items-center p-5 rounded-2xl border-2 transition-all text-left font-bold text-sm md:text-base
              ${selectedAnswer === ans 
                ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100" 
                : "border-slate-50 bg-slate-50/50 text-slate-600 hover:border-slate-200"
              } ${isTimeUp ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 border-2 
              ${selectedAnswer === ans ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-slate-200 text-slate-400"}`}>
              {String.fromCharCode(65 + i)}
            </span>
            {ans}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
export default QuestionCard;