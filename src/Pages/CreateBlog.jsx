import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Image as ImageIcon, Send, X, Type, FileText, Tag } from "lucide-react";
import HomeLayout from "../Layouts/HomeLayout";
import toast from "react-hot-toast";
import axiosInstance from "../Helpers/axiosInstance";

function CreateBlog() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    
    // This is our 'Storage Box' for all the information about the new article.
    const [blogData, setBlogData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Technology",
        author: "Admin",
        thumbnail: null
    });

    // When you type in a box, this code updates our 'Storage Box' with your text.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData({ ...blogData, [name]: value });
    };

    // LOGIC: Image Preview
    // This code reads the image you picked from your computer and shows you a 'preview' 
    // instantly before you even hit save.
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBlogData({ ...blogData, thumbnail: file });
            const reader = new FileReader(); // This is a digital reader
            reader.readAsDataURL(file); // Turn the image into a temporary link
            reader.onloadend = () => setPreviewImage(reader.result); // Show it on screen
        }
    };

    // LOGIC: Publishing the Article
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop the page from refreshing
        if (!blogData.title || !blogData.content || !blogData.excerpt || !blogData.thumbnail) {
            return toast.error("All fields are required");
        }

        // We use 'FormData' because we are sending both Text and an Image file.
        // It's like putting everything into a single envelope for the mailman (the server).
        const formData = new FormData();
        formData.append("title", blogData.title);
        formData.append("excerpt", blogData.excerpt);
        formData.append("content", blogData.content);
        formData.append("category", blogData.category);
        formData.append("author", blogData.author);
        formData.append("thumbnail", blogData.thumbnail);

        setLoading(true); // Show a 'Publishing...' spinner
        try {
            await axiosInstance.post("/blogs", formData); // Send the envelope
            toast.success("Article published successfully!");
            navigate("/blog"); // Go back to the blog list
        } catch (error) {
            toast.error("Failed to publish article");
        } finally {
            setLoading(false);
        }
    };

    return (
        <HomeLayout>
            <div className="min-h-screen pt-24 pb-12 px-6 lg:px-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <div className="max-w-4xl mx-auto space-y-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-bold transition-colors">
                        <ArrowLeft size={18} /> Cancel
                    </button>

                    <div className="glass-card p-10 rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl">
                        <h1 className="text-3xl font-black font-outfit text-slate-900 dark:text-white mb-10 flex items-center gap-4">
                            <span className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center"><Send size={24} /></span>
                            Publish New Insight
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Image Upload */}
                            <div className="relative group">
                                <label htmlFor="thumbnail" className="cursor-pointer block">
                                    {previewImage ? (
                                        <div className="relative h-64 rounded-3xl overflow-hidden border-4 border-emerald-500/20">
                                            <img src={previewImage} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-white font-black uppercase tracking-widest text-xs">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-64 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-emerald-500 transition-colors">
                                            <ImageIcon size={48} />
                                            <span className="font-bold text-sm">Upload Thumbnail Image</span>
                                        </div>
                                    )}
                                </label>
                                <input type="file" id="thumbnail" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Type size={14} /> Title
                                    </label>
                                    <input name="title" value={blogData.title} onChange={handleInputChange} placeholder="Article Title" className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Tag size={14} /> Category
                                    </label>
                                    <select name="category" value={blogData.category} onChange={handleInputChange} className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500">
                                        <option value="Technology">Technology</option>
                                        <option value="Roadmap">Roadmap</option>
                                        <option value="Career">Career</option>
                                        <option value="Updates">Updates</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} /> Excerpt (Short Summary)
                                </label>
                                <textarea name="excerpt" value={blogData.excerpt} onChange={handleInputChange} placeholder="Write a short summary..." className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 h-24" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} /> Full Content
                                </label>
                                <textarea name="content" value={blogData.content} onChange={handleInputChange} placeholder="Write the full article content here..." className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-6 font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 h-96" />
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all disabled:opacity-50">
                                {loading ? "Publishing..." : "Publish Article"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default CreateBlog;
