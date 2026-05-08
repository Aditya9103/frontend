import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../Helpers/axiosInstance";
import HomeLayout from "../Layouts/HomeLayout";
import toast from "react-hot-toast";

function Blog() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, role } = useSelector((state) => state.auth);

    const fetchBlogs = async () => {
        try {
            const res = await axiosInstance.get("/blogs");
            setBlogs(res.data.blogs);
        } catch (error) {
            toast.error("Failed to load articles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <HomeLayout>
            <div className="min-h-screen pt-24 pb-12 px-6 lg:px-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-6xl font-black font-outfit text-slate-900 dark:text-white">
                            Learnify <span className="text-gradient">Insights</span>
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl italic">
                            Expert articles, industry updates, and learning guides to keep you ahead.
                        </p>
                    </div>

                    {isLoggedIn && role === "ADMIN" && (
                        <Link to="/blog/create">
                            <button className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
                                <Plus size={20} /> Publish Article
                            </button>
                        </Link>
                    )}
                </header>

                <main className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-[500px] bg-slate-200 dark:bg-slate-900 animate-pulse rounded-[2.5rem]"></div>
                            ))}
                        </div>
                    ) : blogs.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {blogs.map((post, index) => (
                                <motion.article 
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => navigate(`/blog/${post._id}`)}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 group hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img src={post.thumbnail?.secure_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">
                                            {post.category}
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <div className="flex items-center gap-6 text-slate-400 text-xs font-bold">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-emerald-500" />
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-emerald-500" />
                                                {post.author}
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-emerald-500 transition-colors">
                                            {post.title}
                                        </h2>

                                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 italic">
                                            {post.excerpt}
                                        </p>

                                        <button className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all pt-2">
                                            Read Article <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 italic text-slate-400 font-bold">No insights published yet.</div>
                    )}
                </main>
            </div>
        </HomeLayout>
    );
}

export default Blog;
