import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../../shared/layouts/HomeLayout";
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
            navigate("/courses");
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center min-h-screen bg-gray-900 pt-16 pb-10 px-4">
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-2xl p-8 text-white w-full max-w-3xl bg-gray-800/50 backdrop-blur-md shadow-2xl border border-gray-700/50 relative transition-all duration-300"
                >
                    
                    <Link to="/courses" className="absolute top-8 left-8 text-2xl text-yellow-500 hover:text-yellow-400 cursor-pointer transition-all">
                        <AiOutlineArrowLeft />
                    </Link>

                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold tracking-wide text-yellow-500">
                            Create New Course
                        </h1>
                        <p className="text-gray-300 text-sm mt-2">Fill in the details to add a new course</p>
                    </div>

                    <main className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        <div className="flex flex-col gap-6">
                            <div>
                                <label htmlFor="image_uploads" className="cursor-pointer group">
                                    {userInput.previewImage ? (
                                        <img 
                                            className="w-full h-44 object-cover rounded-lg border border-gray-600 shadow-md group-hover:border-yellow-500 transition-all"
                                            src={userInput.previewImage}
                                            alt="Course Preview"
                                        />
                                    ): (
                                        <div className="w-full h-44 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-500 bg-gray-800/50 group-hover:border-yellow-500 group-hover:bg-gray-800 transition-all">
                                            <h1 className="font-semibold text-gray-400 group-hover:text-yellow-500">Upload course thumbnail</h1>
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
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-200" htmlFor="title">
                                    Course Title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500"
                                    value={userInput.title}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-200" htmlFor="createdBy">
                                    Course Instructor
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter instructor name"
                                    className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500"
                                    value={userInput.createdBy}
                                    onChange={handleUserInput}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-200" htmlFor="category">
                                    Course Category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="e.g., Programming, Design"
                                    className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500"
                                    value={userInput.category}
                                    onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-200" htmlFor="description">
                                    Course Description
                                </label>
                                <textarea
                                    required
                                    name="description"
                                    id="description"
                                    placeholder="Describe the course..."
                                    className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500 h-28 resize-none"
                                    value={userInput.description}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>
                    </main>

                    <button type="submit" className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 transition-all ease-in-out duration-300 rounded-lg py-3 font-bold text-lg text-gray-900 shadow-lg cursor-pointer">
                        Create Course
                    </button>
                </form>
            </div>
        </HomeLayout>
    )
}

export default CreateCourse;