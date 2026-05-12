import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Camera, User, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getUserData, updateProfile } from "../../Redux/Slices/AuthSlice";

function EditProfile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state?.auth?.data);
    
    const [data, setData] = useState({
        previewImage: userData?.avatar?.secure_url || "",
        fullName: userData?.fullName || "",
        avatar: undefined,
        userId: userData?._id
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if(uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setData({
                    ...data,
                    previewImage: this.result,
                    avatar: uploadedImage
                })
            })
        }
    }

    function handleInputChange(e) {
        const {name, value} = e.target;
        setData({
            ...data,
            [name]: value
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if(!data.fullName) {
            toast.error("Full name is mandatory");
            return;
        }
        if(data.fullName.length < 5) {
            toast.error("Name must be at least 5 characters");
            return;
        }

        const formData = new FormData();
        formData.append("fullName", data.fullName);
        if (data.avatar) {
            formData.append("avatar", data.avatar);
        }

        toast.loading("Updating your profile...");
        const res = await dispatch(updateProfile([data.userId, formData]));
        await dispatch(getUserData());

        if (res?.payload?.success) {
            toast.success("Profile updated successfully!");
            navigate("/user/profile");
        }
    }

    return (
        <HomeLayout>
            <div className="min-h-screen py-32 px-6 flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <form
                        onSubmit={onFormSubmit}
                        className="glass-card bg-white dark:bg-slate-900/50 p-10 rounded-[3rem] shadow-2xl shadow-emerald-500/5 border border-white dark:border-slate-800 space-y-8"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <button 
                                type="button"
                                onClick={() => navigate(-1)} 
                                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-2xl font-black font-outfit text-slate-900 dark:text-white">Edit Profile</h1>
                        </div>

                        {/* Avatar Upload Section */}
                        <div className="flex flex-col items-center gap-4">
                            <label className="relative cursor-pointer group" htmlFor="image_uploads">
                                <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 p-1 bg-gradient-to-br from-emerald-400 to-teal-600 shadow-xl overflow-hidden">
                                    <img 
                                        className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-900 transition-transform group-hover:scale-110"
                                        src={data.previewImage}
                                        alt="Avatar Preview"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg">
                                    <Camera size={16} />
                                </div>
                            </label>
                            <input 
                                onChange={handleImageUpload}
                                className="hidden"
                                type="file"
                                id="image_uploads"
                                name="image_uploads"
                                accept=".jpg, .png, .svg, .jpeg"
                            />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to change avatar</p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input 
                                        required
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        placeholder="Enter your full name"
                                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        value={data.fullName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Save Changes
                        </button>

                        <Link to="/user/profile" className="block text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors">
                            Cancel and Return
                        </Link>
                    </form>
                </motion.div>
            </div>
        </HomeLayout>
    );
}

export default EditProfile;