import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Image as ImageIcon, Send, X, Type, FileText, Tag } from "lucide-react";
import HomeLayout from "../../../shared/layouts/HomeLayout";
import toast from "react-hot-toast";
import blogService from "../../../core/services/blog.service";

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
            await blogService.createBlog(formData); // Send the envelope
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
            <div className="min-h-screen py-24 px-4 flex justify-center bg-gray-900 transition-colors duration-500">
                <div className="w-full max-w-4xl space-y-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 font-bold transition-colors">
                        <ArrowLeft size={18} /> Cancel
                    </button>

                    <div className="bg-gray-800/50 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-700/50">
                        <h1 className="text-3xl font-bold tracking-wide text-gray-100 mb-10 flex items-center gap-4">
                            <span className="w-12 h-12 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl flex items-center justify-center"><Send size={24} /></span>
                            Publish New Insight
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Image Upload */}
                            <div className="relative group">
                                <label htmlFor="thumbnail" className="cursor-pointer block">
                                    {previewImage ? (
                                        <div className="relative h-64 rounded-2xl overflow-hidden border-2 border-gray-600 group-hover:border-yellow-500 transition-colors">
                                            <img src={previewImage} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-gray-100 font-bold uppercase tracking-widest text-xs">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-64 border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-yellow-500 hover:text-yellow-500 transition-colors bg-gray-800/50">
                                            <ImageIcon size={48} />
                                            <span className="font-bold text-sm">Upload Thumbnail Image</span>
                                        </div>
                                    )}
                                </label>
                                <input type="file" id="thumbnail" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                        <Type size={16} className="text-yellow-500" /> Title
                                    </label>
                                    <input name="title" value={blogData.title} onChange={handleInputChange} placeholder="Article Title" className="w-full bg-gray-800/80 border border-gray-700 rounded-lg p-3 font-semibold text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-gray-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                        <Tag size={16} className="text-yellow-500" /> Category
                                    </label>
                                    <select name="category" value={blogData.category} onChange={handleInputChange} className="w-full bg-gray-800/80 border border-gray-700 rounded-lg p-3 font-semibold text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all">
                                        <option value="Technology">Technology</option>
                                        <option value="Roadmap">Roadmap</option>
                                        <option value="Career">Career</option>
                                        <option value="Updates">Updates</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                    <FileText size={16} className="text-yellow-500" /> Excerpt (Short Summary)
                                </label>
                                <textarea name="excerpt" value={blogData.excerpt} onChange={handleInputChange} placeholder="Write a short summary..." className="w-full bg-gray-800/80 border border-gray-700 rounded-lg p-3 font-semibold text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-gray-500 h-24" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                    <FileText size={16} className="text-yellow-500" /> Full Content
                                </label>
                                <textarea name="content" value={blogData.content} onChange={handleInputChange} placeholder="Write the full article content here..." className="w-full bg-gray-800/80 border border-gray-700 rounded-lg p-4 font-semibold text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-gray-500 h-96" />
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
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
