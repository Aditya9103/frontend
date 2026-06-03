import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Camera, User, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../../shared/layouts/HomeLayout";
import { getUserData, updateProfile } from "../../auth/redux/AuthSlice";

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

        const res = await dispatch(updateProfile([data.userId, formData]));
        await dispatch(getUserData());

        if (res?.payload?.success) {
            navigate("/user/profile");
        }
    }

    return (
        <HomeLayout>
            <div className="min-h-screen py-24 px-4 flex items-center justify-center bg-gray-900 transition-colors duration-500">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <form
                        onSubmit={onFormSubmit}
                        className="bg-gray-800/50 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-700/50 space-y-8"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <button 
                                type="button"
                                onClick={() => navigate(-1)} 
                                className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-2xl font-bold tracking-wide text-yellow-500">Edit Profile</h1>
                        </div>

                        {/* Avatar Upload Section */}
                        <div className="flex flex-col items-center gap-4">
                            <label className="relative cursor-pointer group" htmlFor="image_uploads">
                                <div className="w-32 h-32 rounded-full border-4 border-gray-600 p-1 bg-gray-800 shadow-xl overflow-hidden transition-all group-hover:border-yellow-500">
                                    <img 
                                        className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-110"
                                        src={data.previewImage}
                                        alt="Avatar Preview"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-500 text-gray-900 rounded-full flex items-center justify-center border-4 border-gray-800 shadow-lg transition-transform group-hover:scale-110">
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
                            <p className="text-xs text-gray-400">Click to change avatar</p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="fullName" className="text-sm font-semibold text-gray-200">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                                    <input 
                                        required
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        placeholder="Enter your full name"
                                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-sm font-semibold text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-gray-500"
                                        value={data.fullName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 transition-all ease-in-out duration-300 rounded-lg py-3 font-bold text-lg text-gray-900 shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-4"
                        >
                            <Save size={18} /> Save Changes
                        </button>

                        <Link to="/user/profile" className="block text-center text-sm font-semibold text-gray-400 hover:text-yellow-500 transition-colors">
                            Cancel and Return
                        </Link>
                    </form>
                </motion.div>
            </div>
        </HomeLayout>
    );
}

export default EditProfile;