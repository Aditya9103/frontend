import { BookOpen, User as UserIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function CourseCard({ data }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate("/course/description/", {state: {...data}})} 
            className="w-full sm:w-[22rem] h-[450px] bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl cursor-pointer group overflow-hidden hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/10 flex flex-col"
        >
            <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={data?.thumbnail?.secure_url}
                    alt="course thumbnail"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-gray-900 text-[10px] font-bold uppercase rounded-full shadow-lg tracking-wide">
                    {data?.category}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-3">
                    <h2 className="text-xl font-bold tracking-wide text-gray-100 group-hover:text-yellow-500 transition-colors line-clamp-2 leading-tight">
                        {data?.title}
                    </h2>
                    
                    <p className="text-gray-400 text-sm line-clamp-2 italic leading-relaxed">
                        {data?.description}
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-700/50 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                            <BookOpen size={16} className="text-yellow-500" />
                            <span className="font-semibold">{data?.numberOfLectures || 0} Lectures</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <UserIcon size={16} className="text-yellow-500" />
                            <span className="font-semibold truncate max-w-[100px]">{data?.createdBy}</span>
                        </div>
                    </div>

                    <button className="w-full py-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold text-xs uppercase tracking-widest rounded-xl group-hover:bg-gradient-to-r group-hover:from-yellow-500 group-hover:to-yellow-600 group-hover:text-gray-900 transition-all duration-300">
                        View Details
                    </button>
                </div>
            </div>
        </div>

    );
}

export default CourseCard;