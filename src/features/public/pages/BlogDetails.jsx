import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MessageSquare,Share2, User } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFacebook, FaLinkedin,FaTwitter } from "react-icons/fa";
import { useNavigate,useParams } from "react-router-dom";

import blogService from "../../../core/services/blog.service";
import HomeLayout from "../../../shared/layouts/HomeLayout";

function BlogDetails() {
    const { id: slugOrId } = useParams(); // Phase 9: accepts slug OR _id
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
            const res = await blogService.getBlogDetails(slugOrId);
            const data = res.data.blog;
            setBlog(data);
            // Phase 9: native SEO — update document title + meta description
            if (data) {
                document.title = `${data.metaTitle || data.title} — Learnify Insights`;
                let metaDesc = document.querySelector('meta[name="description"]');
                if (!metaDesc) {
                    metaDesc = document.createElement('meta');
                    metaDesc.name = 'description';
                    document.head.appendChild(metaDesc);
                }
                metaDesc.content = data.metaDescription || data.excerpt || '';
            }
        } catch {
            toast.error("Failed to load article");
            navigate("/blog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlog();
        window.scrollTo(0, 0);
        // Reset title on unmount
        return () => { document.title = 'Learnify'; };
    }, [slugOrId]);

    if (loading) return (
        <HomeLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </HomeLayout>
    );

    if (!blog) return null;

    return (
        <HomeLayout>
            {/* Reading Progress Bar */}
            <div className="fixed top-24 left-0 w-full h-1 z-[110] bg-gray-800">
                <motion.div 
                    className="h-full bg-yellow-500"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <div className="min-h-screen pt-32 pb-24 px-6 lg:px-20 bg-gray-900 transition-colors duration-500">
                <article className="max-w-3xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="space-y-8 bg-gray-800/50 backdrop-blur-md p-10 rounded-[2.5rem] border border-gray-700/50 shadow-2xl">
                        <button onClick={() => navigate("/blog")} className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 font-bold text-xs uppercase tracking-widest transition-all">
                            <ArrowLeft size={16} /> Back to Library
                        </button>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase tracking-widest rounded-lg border border-yellow-500/20">
                                    {blog.category}
                                </span>
                                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    <Clock size={16} className="text-yellow-500" />
                                    {blog.readingTime}
                                </div>
                            </div>
                            
                            <h1 className="text-4xl lg:text-6xl font-bold text-gray-100 leading-[1.1] tracking-tight">
                                {blog.title}
                            </h1>
                            
                            <div className="flex items-center gap-4 pt-4">
                                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20 shadow-lg">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-200">{blog.author}</p>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Featured Image */}
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-gray-700/50 group">
                        <img 
                            src={blog.thumbnail?.secure_url} 
                            alt={blog.title} 
                            className="w-full h-full object-cover max-h-[400px] group-hover:scale-105 transition-transform duration-1000" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-10 bg-gray-800/50 backdrop-blur-md p-10 rounded-[2.5rem] border border-gray-700/50 shadow-2xl">
                        <p className="text-xl font-medium text-gray-300 leading-relaxed italic border-l-4 border-yellow-500 pl-6 py-2 bg-gray-900/50 rounded-r-2xl">
                            {blog.excerpt}
                        </p>
                        
                        <div 
                            className="text-lg text-gray-300 leading-loose space-y-8 font-medium selection:bg-yellow-500 selection:text-gray-900"
                            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }}
                        />
                    </div>

                    {/* Share & Footer */}
                    <div className="p-10 bg-gray-800/50 backdrop-blur-md rounded-[2.5rem] border border-gray-700/50 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Help others learn by sharing</p>
                            <div className="flex gap-3">
                                <button className="p-4 bg-gray-900 rounded-2xl text-gray-400 hover:text-yellow-500 hover:scale-110 transition-all border border-gray-700 hover:border-yellow-500"><FaFacebook size={20} /></button>
                                <button className="p-4 bg-gray-900 rounded-2xl text-gray-400 hover:text-yellow-500 hover:scale-110 transition-all border border-gray-700 hover:border-yellow-500"><FaTwitter size={20} /></button>
                                <button className="p-4 bg-gray-900 rounded-2xl text-gray-400 hover:text-yellow-500 hover:scale-110 transition-all border border-gray-700 hover:border-yellow-500"><FaLinkedin size={20} /></button>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all hover:scale-105">
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
