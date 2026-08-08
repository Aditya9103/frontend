import { motion } from 'framer-motion';
import { BookOpen, User as UserIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function CourseCard({ data }) {
    const navigate = useNavigate();

    return (
        <motion.div
            onClick={() => navigate("/course/description/", {state: {...data}})} 
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full h-[450px] bg-gray-800/40 backdrop-blur-2xl border border-gray-700/50 rounded-[2rem] cursor-pointer group overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10 flex flex-col will-change-transform relative"
        >
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

            <div className="relative h-48 overflow-hidden flex-shrink-0 p-3">
                <img 
                    className="h-full w-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
                    src={data?.thumbnail?.secure_url}
                    alt="course thumbnail"
                />
                <div className="absolute top-6 right-6 px-3 py-1.5 bg-yellow-500/90 backdrop-blur-md text-gray-900 text-[10px] font-extrabold uppercase rounded-full shadow-lg tracking-wider">
                    {data?.category}
                </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex flex-col flex-1 justify-between gap-4 z-10">
                <div className="space-y-3">
                    <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug">
                        {data?.title}
                    </h2>
                    
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                        {data?.description}
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-700/50 space-y-5">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-300 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700/50">
                            <BookOpen size={14} className="text-yellow-500" />
                            <span className="font-semibold text-xs">{data?.numberOfLectures || 0} Lectures</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700/50">
                            <UserIcon size={14} className="text-yellow-500" />
                            <span className="font-semibold text-xs truncate max-w-[80px]">{data?.createdBy}</span>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-white/5 border border-white/10 text-yellow-500 font-bold text-xs uppercase tracking-widest rounded-xl group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-yellow-600 group-hover:text-gray-900 group-hover:border-transparent transition-all duration-300">
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default CourseCard;