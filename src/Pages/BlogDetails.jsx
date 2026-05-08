import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Clock, Share2, ArrowLeft, MessageSquare } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import axiosInstance from "../Helpers/axiosInstance";
import HomeLayout from "../Layouts/HomeLayout";
import toast from "react-hot-toast";

function BlogDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    // LOGIC: Reading Progress Bar
    // This function measures how far you have scrolled down the article.
    const handleScroll = () => {
        // totalHeight = Entire page length - what you can see right now
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        // progress = (Current position / Total length) * 100 to get a percentage
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress); // Update the green bar at the top
    };

    // We start listening to your mouse scroll as soon as the page loads.
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll); // Cleanup when leaving
    }, []);

    // LOGIC: Fetching the Article
    const fetchBlog = async () => {
        try {
            const res = await axiosInstance.get(`/blogs/${id}`);
            setBlog(res.data.blog); // Load the article data into the page
        } catch (error) {
            toast.error("Failed to load article");
            navigate("/blog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
        window.scrollTo(0, 0); // Always start at the top of the page for a new article
    }, [id]);

    if (loading) return (
        <HomeLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </HomeLayout>
    );

    if (!blog) return null;

    return (
        <HomeLayout>
            {/* Reading Progress Bar */}
            <div className="fixed top-24 left-0 w-full h-1 z-[110] bg-slate-100 dark:bg-slate-900">
                <motion.div 
                    className="h-full bg-emerald-500"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <div className="min-h-screen pt-32 pb-24 px-6 lg:px-20 bg-white dark:bg-slate-950 transition-colors duration-500">
                <article className="max-w-3xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="space-y-8">
                        <button onClick={() => navigate("/blog")} className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-black text-[10px] uppercase tracking-widest transition-all">
                            <ArrowLeft size={16} /> Back to Library
                        </button>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">
                                    {blog.category}
                                </span>
                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <Clock size={14} className="text-emerald-500" />
                                    {blog.readingTime}
                                </div>
                            </div>
                            
                            <h1 className="text-4xl lg:text-7xl font-black font-outfit text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                                {blog.title}
                            </h1>
                            
                            <div className="flex items-center gap-4 pt-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{blog.author}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Featured Image */}
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-500/5 group">
                        <img 
                            src={blog.thumbnail?.secure_url} 
                            alt={blog.title} 
                            className="w-full h-full object-cover max-h-[350px] group-hover:scale-105 transition-transform duration-1000" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-10">
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic border-l-8 border-emerald-500 pl-8 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-r-3xl">
                            {blog.excerpt}
                        </p>
                        
                        <div 
                            className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-[1.8] space-y-8 font-medium font-outfit selection:bg-emerald-500 selection:text-white"
                            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }}
                        />
                    </div>

                    {/* Share & Footer */}
                    <div className="pt-16 mt-16 border-t-2 border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Help others learn by sharing</p>
                            <div className="flex gap-3">
                                <button className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-[1.5rem] text-slate-400 hover:text-emerald-500 hover:scale-110 transition-all border border-slate-100 dark:border-slate-800"><FaFacebook size={20} /></button>
                                <button className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-[1.5rem] text-slate-400 hover:text-emerald-500 hover:scale-110 transition-all border border-slate-100 dark:border-slate-800"><FaTwitter size={20} /></button>
                                <button className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-[1.5rem] text-slate-400 hover:text-emerald-500 hover:scale-110 transition-all border border-slate-100 dark:border-slate-800"><FaLinkedin size={20} /></button>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
                                <MessageSquare size={18} /> Join Discussion
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </HomeLayout>
    );
}

export default BlogDetails;
