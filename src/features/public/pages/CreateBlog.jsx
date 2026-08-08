import { ArrowLeft, FileText, Image as ImageIcon, Send, Tag,Type } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import blogService from "../../../core/services/blog.service";

function CreateBlog() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    const [blogData, setBlogData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Technology",
        author: "Admin",
        thumbnail: null
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!blogData.title || !blogData.content || !blogData.excerpt || !blogData.thumbnail) {
            return toast.error("All fields are required");
        }

        const formData = new FormData();
        formData.append("title", blogData.title);
        formData.append("excerpt", blogData.excerpt);
        formData.append("content", blogData.content);
        formData.append("category", blogData.category);
        formData.append("author", blogData.author);
        formData.append("thumbnail", blogData.thumbnail);

        setLoading(true);
        try {
            await blogService.createBlog(formData);
            toast.success("Article published successfully!");
            navigate("/admin/dashboard");
        } catch (error) {
            toast.error("Failed to publish article");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto w-full py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-2xl p-10 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm relative transition-colors duration-500">
                
                <button type="button" onClick={() => navigate(-1)} className="absolute top-10 left-10 text-xl text-gray-400 hover:text-yellow-500 transition-colors">
                    <ArrowLeft />
                </button>

                <div className="text-center mb-2">
                    <div className="flex justify-center mb-4">
                        <span className="w-12 h-12 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl flex items-center justify-center">
                            <Send size={24} />
                        </span>
                    </div>
                    <h1 className="text-3xl font-black font-outfit text-gray-900 dark:text-gray-100">
                        Publish New Insight
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Write and share a new blog post</p>
                </div>

                <div className="space-y-8">
                    {/* Image Upload */}
                    <div className="relative group">
                        <label htmlFor="thumbnail" className="cursor-pointer block">
                            {previewImage ? (
                                <div className="relative h-64 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm group-hover:border-yellow-500 transition-colors">
                                    <img src={previewImage} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-white font-bold uppercase tracking-widest text-xs">Change Image</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-yellow-500 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 hover:text-yellow-600 dark:hover:text-yellow-500 transition-all">
                                    <ImageIcon size={48} />
                                    <span className="font-bold text-sm">Upload Thumbnail Image</span>
                                </div>
                            )}
                        </label>
                        <input type="file" id="thumbnail" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Type size={16} className="text-yellow-500" /> Title
                            </label>
                            <input name="title" value={blogData.title} onChange={handleInputChange} placeholder="Article Title" className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Tag size={16} className="text-yellow-500" /> Category
                            </label>
                            <select name="category" value={blogData.category} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all text-gray-900 dark:text-gray-100">
                                <option value="Technology">Technology</option>
                                <option value="Roadmap">Roadmap</option>
                                <option value="Career">Career</option>
                                <option value="Updates">Updates</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <FileText size={16} className="text-yellow-500" /> Excerpt (Short Summary)
                        </label>
                        <textarea name="excerpt" value={blogData.excerpt} onChange={handleInputChange} placeholder="Write a short summary..." className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100 h-24 resize-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <FileText size={16} className="text-yellow-500" /> Full Content
                        </label>
                        <textarea name="content" value={blogData.content} onChange={handleInputChange} placeholder="Write the full article content here..." className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100 h-96" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 rounded-xl py-4 font-bold text-lg text-gray-900 shadow-sm disabled:opacity-50">
                        {loading ? "Publishing..." : "Publish Article"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateBlog;
