import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CornerDownRight, CheckCircle } from "lucide-react";

const AllReplay: React.FC<AllReplayProps> = ({ replies }) => {



  if (replies.length === 0) return null;

  return (
    <div className="mt-4 space-y-3 relative">
      <div className="absolute left-[-20px] top-0 bottom-0 w-px bg-slate-100" />
      
      <AnimatePresence>
        {replies.map((replay) => (
          <motion.div
            key={replay.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 items-start"
          >
            <CornerDownRight className="text-slate-300 mt-2 shrink-0" size={16} />
            
            <div className="flex-1 bg-indigo-50/50 border border-indigo-100 p-4 rounded-3xl relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="relative h-6 w-6 rounded-full overflow-hidden">
                   <Image 
                    src={`${replay.extraData?.profile_pic }`}
                    alt="Admin" fill className="object-cover"
                   />
                </div>
                <span className="font-black text-xs text-indigo-700 flex items-center gap-1">
                  {replay.user.full_name}
                  <CheckCircle size={10} className="fill-indigo-600 text-white" />
                </span>
                <span className="text-[10px] text-indigo-400 font-medium">
                  • {new Date(replay.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {replay.text}
              </p>

              {replay.file_url && (
                <div className="mt-3">
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
export default AllReplay