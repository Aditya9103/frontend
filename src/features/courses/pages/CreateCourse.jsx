import { useRef, useState } from "react";
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
        previewImage: "",
        completionThreshold: 80, // Phase 5: % needed for certificate
        isFree: false,           // Phase 5: free preview mode
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if(uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setUserInput((prev) => ({
                    ...prev,
                    previewImage: this.result,
                    thumbnail: uploadedImage
                }));
            });
        }
    }

    function handleUserInput(e) {
        const {name, value} = e.target;
        setUserInput((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        // 1. Double-tap / multi-click concurrency guard
        if (isSubmittingRef.current || isSubmitting) {
            return;
        }

        // 2. Specific, actionable client-side validations
        if (!userInput.thumbnail) {
            toast.error("Please upload a course thumbnail image");
            return;
        }

        const trimmedTitle = userInput.title?.trim() || "";
        if (!trimmedTitle) {
            toast.error("Course title is required");
            return;
        }
        if (trimmedTitle.length < 8) {
            toast.error("Course title must be at least 8 characters long");
            return;
        }
        if (trimmedTitle.length > 60) {
            toast.error("Course title cannot exceed 60 characters");
            return;
        }

        const trimmedCreatedBy = userInput.createdBy?.trim() || "";
        if (!trimmedCreatedBy) {
            toast.error("Course instructor name is required");
            return;
        }

        const trimmedCategory = userInput.category?.trim() || "";
        if (!trimmedCategory) {
            toast.error("Course category is required");
            return;
        }

        const trimmedDescription = userInput.description?.trim() || "";
        if (!trimmedDescription) {
            toast.error("Course description is required");
            return;
        }
        if (trimmedDescription.length < 20) {
            toast.error("Course description must be at least 20 characters long");
            return;
        }

        try {
            isSubmittingRef.current = true;
            setIsSubmitting(true);

            const response = await dispatch(createNewCourse({
                ...userInput,
                title: trimmedTitle,
                createdBy: trimmedCreatedBy,
                category: trimmedCategory,
                description: trimmedDescription,
            }));

            if (createNewCourse.fulfilled.match(response) || response?.payload?.success || response?.payload?.course) {
                setUserInput({
                    title: "",
                    category: "",
                    createdBy: "",
                    description: "",
                    thumbnail: null,
                    previewImage: "",
                    completionThreshold: 80,
                    isFree: false,
                });
                navigate("/admin/dashboard");
            }
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
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
                                        <p className="text-xs text-gray-400 mt-2">JPG, JPEG, PNG (Required)</p>
                                    </div>
                                )}
                            </label>
                            <input 
                                className="hidden"
                                type="file"
                                id="image_uploads"
                                accept=".jpg, .jpeg, .png"
                                name="image_uploads"
                                disabled={isSubmitting}
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="title">
                                    Course Title
                                </label>
                                <span className="text-xs text-gray-400">
                                    {userInput.title.trim().length}/60 chars (min 8)
                                </span>
                            </div>
                            <input
                                required
                                type="text"
                                name="title"
                                id="title"
                                disabled={isSubmitting}
                                placeholder="Enter course title (min 8 characters)"
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                disabled={isSubmitting}
                                placeholder="Enter instructor name"
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                disabled={isSubmitting}
                                placeholder="e.g., Programming, Design, Business"
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                value={userInput.category}
                                onChange={handleUserInput}
                            />
                        </div>

                        <div className="flex flex-col gap-2 h-full">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="description">
                                    Course Description
                                </label>
                                <span className="text-xs text-gray-400">
                                    {userInput.description.trim().length} chars (min 20)
                                </span>
                            </div>
                            <textarea
                                required
                                name="description"
                                id="description"
                                disabled={isSubmitting}
                                placeholder="Describe the course curriculum, target audience, and key outcomes (min 20 characters)..."
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100 flex-1 resize-none min-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                                value={userInput.description}
                                onChange={handleUserInput}
                            />
                        </div>
                    </div>
                </main>

                {/* Phase 5: Completion threshold + free toggle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            Completion Threshold for Certificate
                            <span className="ml-2 text-yellow-500 font-black">{userInput.completionThreshold}%</span>
                        </label>
                        <input
                            type="range" min="50" max="100" step="5"
                            name="completionThreshold"
                            disabled={isSubmitting}
                            value={userInput.completionThreshold}
                            onChange={handleUserInput}
                            className="accent-yellow-500 disabled:opacity-50"
                        />
                        <p className="text-xs text-gray-400">Learners must complete {userInput.completionThreshold}% of lectures to receive a certificate.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Free Preview Mode</label>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setUserInput((prev) => ({ ...prev, isFree: !prev.isFree }))}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-bold transition-all w-fit ${
                                userInput.isFree
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
                            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className={`w-10 h-5 rounded-full transition-all relative ${userInput.isFree ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${userInput.isFree ? 'left-5' : 'left-0.5'}`} />
                            </div>
                            {userInput.isFree ? 'Free for Everyone' : 'Paid Enrollment'}
                        </button>
                        <p className="text-xs text-gray-400">Free courses are accessible without subscription.</p>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`mt-4 w-full rounded-xl py-4 font-bold text-lg shadow-sm transition-all duration-300 ${
                        isSubmitting 
                            ? "bg-yellow-500/60 text-gray-800 cursor-not-allowed" 
                            : "bg-yellow-500 hover:bg-yellow-600 text-gray-900 cursor-pointer shadow-yellow-500/20 active:scale-[0.99]"
                    }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Course...
                        </span>
                    ) : (
                        "Create Course"
                    )}
                </button>
            </form>
        </div>
    );
}

export default CreateCourse;