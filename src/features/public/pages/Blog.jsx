import { motion } from "framer-motion";
import { ArrowRight, Calendar, Filter, Plus, Tag, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import blogService from "../../../core/services/blog.service";
import HomeLayout from "../../../shared/layouts/HomeLayout";

function Blog() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const { isLoggedIn, role } = useSelector((state) => state.auth);

    // Phase 9: navigate by slug (SEO), fall back to _id for legacy
    const goToBlog = (post) => navigate(`/blog/${post.slug || post._id}`);

    const fetchBlogs = async () => {
        try {
            const res = await blogService.getBlogs();
            setBlogs(res.data.blogs || []);
        } catch {
            toast.error("Failed to load articles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    // Derive unique categories
    const categories = useMemo(() => {
        const cats = [...new Set(blogs.map((b) => b.category).filter(Boolean))];
        return ['All', ...cats];
    }, [blogs]);

    const filtered = useMemo(() =>
        activeCategory === 'All'
            ? blogs
            : blogs.filter((b) => b.category === activeCategory)
    , [blogs, activeCategory]);

    return (
        <HomeLayout>
            <div className="min-h-screen py-24 px-4 lg:px-20 bg-gray-900 transition-colors duration-500">
                <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
                    <div className="space-y-3">
                        <h1 className="text-4xl lg:text-6xl font-black font-outfit tracking-tight text-gray-100">
                            Learnify <span className="text-yellow-500">Insights</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl italic">
                            Expert articles, industry updates, and learning guides to keep you ahead.
                        </p>
                    </div>
                    {isLoggedIn && role === 'ADMIN' && (
                        <Link to="/blog/create" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all hover:-translate-y-1">
                            <Plus size={20} /> Publish Article
                        </Link>
                    )}
                </header>

                {/* Category filter tabs — Phase 9 */}
                <div className="max-w-7xl mx-auto mb-10 flex flex-wrap items-center gap-2">
                    <Filter size={14} className="text-gray-500" />
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                activeCategory === cat
                                    ? 'bg-yellow-500 text-black border-yellow-400'
                                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-yellow-500/40 hover:text-yellow-400'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <main className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-[500px] bg-gray-800/50 animate-pulse rounded-[2.5rem] border border-gray-700/50" />
                            ))}
                        </div>
                    ) : filtered.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {filtered.map((post, index) => (
                                <motion.article
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.07 }}
                                    onClick={() => goToBlog(post)}
                                    className="bg-gray-800/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-gray-700/50 group hover:shadow-2xl hover:shadow-yellow-500/10 hover:border-yellow-500/30 transition-all duration-500 cursor-pointer flex flex-col"
                                >
                                    <div className="relative h-56 overflow-hidden flex-shrink-0">
                                        <img src={post.thumbnail?.secure_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4 flex items-center gap-2">
                                            <span className="px-3 py-1 bg-gray-900/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-yellow-500 border border-yellow-500/20">
                                                {post.category}
                                            </span>
                                            {/* Draft badge — visible to admins */}
                                            {post.status === 'draft' && role === 'ADMIN' && (
                                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-black uppercase">Draft</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-7 space-y-4 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-gray-400 text-xs font-semibold">
                                            <span className="flex items-center gap-1.5"><Calendar size={13} className="text-yellow-500" />{new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1.5"><User size={13} className="text-yellow-500" />{post.author}</span>
                                        </div>

                                        <h2 className="text-xl font-black font-outfit text-gray-100 leading-tight group-hover:text-yellow-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>

                                        {/* Tags — Phase 9 */}
                                        {post.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 text-gray-500 rounded-full text-[10px] font-bold border border-white/10">
                                                        <Tag size={9} /> {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <button className="flex items-center gap-2 text-yellow-500 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all pt-3 mt-auto border-t border-gray-700/50">
                                            Read Article <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 italic text-gray-400 font-semibold bg-gray-800/50 rounded-3xl border border-gray-700/50">
                            No {activeCategory === 'All' ? '' : activeCategory} articles published yet.
                        </div>
                    )}
                </main>
            </div>
        </HomeLayout>
    );
}

export default Blog;
