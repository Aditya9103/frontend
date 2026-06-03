import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import blogService from "../../../core/services/blog.service";
import HomeLayout from "../../../shared/layouts/HomeLayout";
import toast from "react-hot-toast";

function Blog() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, role } = useSelector((state) => state.auth);

    const fetchBlogs = async () => {
        try {
            const res = await blogService.getBlogs();
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
            <div className="min-h-screen py-24 px-4 lg:px-20 bg-gray-900 transition-colors duration-500">
                <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-100">
                            Learnify <span className="text-yellow-500">Insights</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-medium max-w-2xl italic">
                            Expert articles, industry updates, and learning guides to keep you ahead.
                        </p>
                    </div>

                    {isLoggedIn && role === "ADMIN" && (
                        <Link to="/blog/create">
                            <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all hover:-translate-y-1">
                                <Plus size={20} /> Publish Article
                            </button>
                        </Link>
                    )}
                </header>

                <main className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-[500px] bg-gray-800/50 animate-pulse rounded-[2.5rem] border border-gray-700/50"></div>
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
                                    className="bg-gray-800/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-gray-700/50 group hover:shadow-2xl hover:shadow-yellow-500/10 hover:border-yellow-500/30 transition-all duration-500 cursor-pointer flex flex-col"
                                >
                                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                                        <img src={post.thumbnail?.secure_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-gray-900/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-yellow-500 border border-yellow-500/20 shadow-lg">
                                            {post.category}
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-6 text-gray-400 text-sm font-semibold mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-yellow-500" />
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-yellow-500" />
                                                    {post.author}
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-bold text-gray-100 leading-tight group-hover:text-yellow-500 transition-colors mb-4 line-clamp-2">
                                                {post.title}
                                            </h2>

                                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 italic">
                                                {post.excerpt}
                                            </p>
                                        </div>

                                        <button className="flex items-center gap-2 text-yellow-500 font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all pt-4 mt-auto border-t border-gray-700/50">
                                            Read Article <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 italic text-gray-400 font-semibold bg-gray-800/50 rounded-3xl border border-gray-700/50 backdrop-blur-md">No insights published yet.</div>
                    )}
                </main>
            </div>
        </HomeLayout>
    );
}

export default Blog;
