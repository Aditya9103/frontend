import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { createNewCourse } from "../redux/CourseSlice";

function CreateCourse() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        title: "",
        category: "",
        createdBy: "",
        description: "",
        thumbnail: null,
        previewImage: ""
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if(uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setUserInput({
                    ...userInput,
                    previewImage: this.result,
                    thumbnail: uploadedImage
                })
            })
        }
    }

    function handleUserInput(e) {
        const {name, value} = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        if(!userInput.title || !userInput.description || !userInput.category || !userInput.thumbnail || !userInput.createdBy) {
            toast.error("All fields are mandatory");
            return;
        }

        const response = await dispatch(createNewCourse(userInput));
        if(response?.payload?.success) {
            setUserInput({
                title: "",
                category: "",
                createdBy: "",
                description: "",
                thumbnail: null,
                previewImage: ""
            });
            navigate("/admin/dashboard");
        }
    }

    return (
        <div className="max-w-4xl mx-auto w-full py-8">
            <form
                onSubmit={onFormSubmit}
                className="flex flex-col gap-8 rounded-2xl p-10 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm relative transition-colors duration-500"
            >
                <Link to="/admin/dashboard" className="absolute top-10 left-10 text-xl text-gray-400 hover:text-yellow-500 transition-colors">
                    <AiOutlineArrowLeft />
                </Link>

                <div className="text-center mb-2">
                    <h1 className="text-3xl font-black font-outfit text-gray-900 dark:text-gray-100">
                        Create New Course
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Fill in the details to add a new course</p>
                </div>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    <div className="flex flex-col gap-6">
                        <div>
                            <label htmlFor="image_uploads" className="cursor-pointer group block">
                                {userInput.previewImage ? (
                                    <img 
                                        className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm group-hover:border-yellow-500 transition-all"
                                        src={userInput.previewImage}
                                        alt="Course Preview"
                                    />
                                ): (
                                    <div className="w-full h-48 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 group-hover:border-yellow-500 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-500/10 transition-all">
                                        <h1 className="font-semibold text-gray-500 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-500">Upload course thumbnail</h1>
                                        <p className="text-xs text-gray-400 mt-2">JPG, JPEG, PNG</p>
                                    </div>
                                )}
                            </label>
                            <input 
                                className="hidden"
                                type="file"
                                id="image_uploads"
                                accept=".jpg, .jpeg, .png"
                                name="image_uploads"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="title">
                                Course Title
                            </label>
                            <input
                                required
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Enter course title"
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                                value={userInput.title}
                                onChange={handleUserInput}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="createdBy">
                                Course Instructor
                            </label>
                            <input
                                required
                                type="text"
                                name="createdBy"
                                id="createdBy"
                                placeholder="Enter instructor name"
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                                value={userInput.createdBy}
                                onChange={handleUserInput}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="category">
                                Course Category
                            </label>
                            <input
                                required
                                type="text"
                                name="category"
                                id="category"
                                placeholder="e.g., Programming, Design"
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                                value={userInput.category}
                                onChange={handleUserInput}
                            />
                        </div>
                        <div className="flex flex-col gap-2 h-full">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="description">
                                Course Description
                            </label>
                            <textarea
                                required
                                name="description"
                                id="description"
                                placeholder="Describe the course..."
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100 flex-1 resize-none min-h-[120px]"
                                value={userInput.description}
                                onChange={handleUserInput}
                            />
                        </div>
                    </div>
                </main>

                <button type="submit" className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 rounded-xl py-4 font-bold text-lg text-gray-900 shadow-sm cursor-pointer">
                    Create Course
                </button>
            </form>
        </div>
    )
}

export default CreateCourse;