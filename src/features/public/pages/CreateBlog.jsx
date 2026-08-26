/**
 * CreateBlog.jsx — Phase 9
 *
 * Additions:
 *   - status toggle: 'draft' | 'published'
 *   - tags input (comma-separated, chip display)
 *   - metaTitle + metaDescription SEO fields
 *   - author field editable (not hardcoded)
 */
import { ArrowLeft, Eye, FileText, Image as ImageIcon, Radio, Send, Tag, Type, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import blogService from "../../../core/services/blog.service";
import HomeLayout from "../../../shared/layouts/HomeLayout";

const INPUT_CLASS = "w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100";

function CreateBlog() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    // Phase 9: extended blogData
    const [blogData, setBlogData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Technology",
        author: "Admin",
        thumbnail: null,
        status: "draft",        // Phase 9
        metaTitle: "",           // Phase 9
        metaDescription: "",     // Phase 9
    });

    // Phase 9: tags as array, edited via text input
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData({ ...blogData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBlogData({ ...blogData, thumbnail: file });
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => setPreviewImage(reader.result);
        }
    };

    const addTag = () => {
        const t = tagInput.trim().toLowerCase();
        if (t && !tags.includes(t)) setTags([...tags, t]);
        setTagInput("");
    };

    const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

    const handleSubmit = async (e, overrideStatus) => {
        if (e) e.preventDefault();
        if (!blogData.title || !blogData.content || !blogData.excerpt || !blogData.thumbnail) {
            return toast.error("Title, excerpt, content and thumbnail are required");
        }

        const status = overrideStatus || blogData.status;
        const formData = new FormData();
        formData.append("title", blogData.title);
        formData.append("excerpt", blogData.excerpt);
        formData.append("content", blogData.content);
        formData.append("category", blogData.category);
        formData.append("author", blogData.author);
        formData.append("thumbnail", blogData.thumbnail);
        formData.append("status", status);
        formData.append("metaTitle", blogData.metaTitle || blogData.title);
        formData.append("metaDescription", blogData.metaDescription || blogData.excerpt);
        tags.forEach((t) => formData.append("tags[]", t));

        setLoading(true);
        try {
            await blogService.createBlog(formData);
            toast.success(status === 'published' ? "Article published!" : "Draft saved!");
            navigate("/admin/dashboard");
        } catch {
            toast.error("Failed to save article");
        } finally {
            setLoading(false);
        }
    };

    return (
        <HomeLayout>
            <div className="max-w-4xl mx-auto w-full py-8 px-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-2xl p-8 md:p-10 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm relative transition-colors duration-500">

                    <button type="button" onClick={() => navigate(-1)} className="absolute top-8 left-8 text-gray-400 hover:text-yellow-500 transition-colors">
                        <ArrowLeft size={20} />
                    </button>

                    <div className="text-center mb-2">
                        <div className="flex justify-center mb-4">
                            <span className="w-12 h-12 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl flex items-center justify-center">
                                <Send size={24} />
                            </span>
                        </div>
                        <h1 className="text-3xl font-black font-outfit text-gray-900 dark:text-gray-100">Create New Insight</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Write, draft, or publish a new blog post</p>
                    </div>

                    {/* Phase 9: Status toggle */}
                    <div className="flex items-center justify-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        {[
                            { value: 'draft',     icon: <Radio size={14} />,  label: 'Save as Draft' },
                            { value: 'published', icon: <Eye size={14} />,    label: 'Publish Now' },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setBlogData({ ...blogData, status: opt.value })}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    blogData.status === opt.value
                                        ? opt.value === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                {opt.icon} {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {/* Thumbnail */}
                        <div className="relative group">
                            <label htmlFor="thumbnail" className="cursor-pointer block">
                                {previewImage ? (
                                    <div className="relative h-56 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group-hover:border-yellow-500 transition-colors">
                                        <img src={previewImage} className="w-full h-full object-cover" alt="Thumbnail preview" />
                                        <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-white font-bold uppercase tracking-widest text-xs">Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 hover:text-yellow-600 dark:hover:text-yellow-500 transition-all">
                                        <ImageIcon size={40} />
                                        <span className="font-bold text-sm">Upload Thumbnail</span>
                                    </div>
                                )}
                            </label>
                            <input type="file" id="thumbnail" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>

                        {/* Title + Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Type size={15} className="text-yellow-500" /> Title *
                                </label>
                                <input name="title" value={blogData.title} onChange={handleInputChange} placeholder="Article Title" className={INPUT_CLASS} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Tag size={15} className="text-yellow-500" /> Category
                                </label>
                                <select name="category" value={blogData.category} onChange={handleInputChange} className={INPUT_CLASS}>
                                    {['Technology', 'Roadmap', 'Career', 'Updates', 'Design', 'Business', 'AI & ML'].map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Author */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Author</label>
                            <input name="author" value={blogData.author} onChange={handleInputChange} placeholder="Author name" className={INPUT_CLASS} />
                        </div>

                        {/* Tags — Phase 9 */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Tag size={15} className="text-yellow-500" /> Tags
                            </label>
                            <div className="flex gap-2">
                                <input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    placeholder="Add a tag (press Enter)"
                                    className={`${INPUT_CLASS} flex-1`}
                                />
                                <button type="button" onClick={addTag} className="px-4 py-2 bg-yellow-500 text-black rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all">Add</button>
                            </div>
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {tags.map((tag) => (
                                        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full text-xs font-bold border border-yellow-500/20">
                                            #{tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors"><X size={11} /></button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FileText size={15} className="text-yellow-500" /> Excerpt *
                            </label>
                            <textarea name="excerpt" value={blogData.excerpt} onChange={handleInputChange} placeholder="Short summary shown in article cards..." className={`${INPUT_CLASS} h-24 resize-none`} />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <FileText size={15} className="text-yellow-500" /> Full Content *
                            </label>
                            <textarea name="content" value={blogData.content} onChange={handleInputChange} placeholder="Write the full article content here..." className={`${INPUT_CLASS} h-72 resize-y`} />
                        </div>

                        {/* SEO Fields — Phase 9 */}
                        <details className="group">
                            <summary className="text-sm font-bold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-yellow-500 transition-colors list-none flex items-center gap-2">
                                <span className="text-yellow-500">⚡</span> SEO Settings (optional)
                            </summary>
                            <div className="mt-4 space-y-4 pl-4 border-l-2 border-yellow-500/20">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meta Title</label>
                                    <input name="metaTitle" value={blogData.metaTitle} onChange={handleInputChange} placeholder={blogData.title || "SEO page title"} className={INPUT_CLASS} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meta Description</label>
                                    <textarea name="metaDescription" value={blogData.metaDescription} onChange={handleInputChange} placeholder={blogData.excerpt || "SEO page description (150–160 chars)"} className={`${INPUT_CLASS} h-20 resize-none`} />
                                </div>
                            </div>
                        </details>

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => handleSubmit(null, 'draft')}
                                disabled={loading}
                                className="flex-1 py-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Radio size={15} /> Save Draft
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Send size={15} /> {loading ? "Saving…" : "Publish Article"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </HomeLayout>
    );
}

export default CreateBlog;
