import { BookOpen, User as UserIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function CourseCard({ data }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate("/course/description/", {state: {...data}})} 
            className="text-white dark:text-white w-full sm:w-[22rem] h-[450px] glass-card rounded-3xl cursor-pointer group overflow-hidden hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10"
        >
            <div className="relative h-48 overflow-hidden">
                <img 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={data?.thumbnail?.secure_url}
                    alt="course thumbnail"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                    {data?.category}
                </div>
            </div>

            <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold font-outfit text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2 leading-tight">
                    {data?.title}
                </h2>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 italic leading-relaxed">
                    {data?.description}
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <BookOpen size={16} className="text-emerald-500" />
                            <span className="font-bold">{data?.numberOfLectures || 0} Lectures</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <UserIcon size={16} className="text-blue-500 dark:text-blue-400" />
                            <span className="font-bold truncate max-w-[100px]">{data?.createdBy}</span>
                        </div>
                    </div>

                    <button className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        View Details
                    </button>
                </div>
            </div>
        </div>

    );
}

export default CourseCard;