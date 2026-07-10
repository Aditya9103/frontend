import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addCourseLecture } from "../redux/LectureSlice";

function AddLecture() {

    const courseDetails = useLocation().state;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        id: courseDetails?._id,
        lecture: undefined,
        title: "",
        description: "",
        videoSrc: ""
    });

    function handleInputChange(e) {
        const {name, value} = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    function handleVideo(e) {
        const video = e.target.files[0];

        if (!video) {
            return;
        }

        const source = window.URL.createObjectURL(video);
        setUserInput({
            ...userInput,
            lecture: video,
            videoSrc: source
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if(!userInput.lecture || !userInput.title || !userInput.description) {
            toast.error("All fields are mandatory")
            return;
        }
        const response = await dispatch(addCourseLecture(userInput));
        if(response?.payload?.success) {
            navigate(-1);
            setUserInput({
                id: courseDetails?._id,
                lecture: undefined,
                title: "",
                description: "",
                videoSrc: ""
            })
        }
    }

    useEffect(() => {
        if(!courseDetails) navigate("/courses");
    }, [])

    return (
        <div className="max-w-2xl mx-auto w-full py-8">
            <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                    <header className="relative mb-8 flex items-center justify-center">
                        <button 
                            className="absolute left-0 rounded-full border border-gray-200 dark:border-gray-700 p-2 text-xl text-gray-500 hover:text-yellow-500 hover:border-yellow-500 transition-all duration-300"
                            onClick={() => navigate(-1)}
                        >
                            <AiOutlineArrowLeft />
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl font-black font-outfit text-gray-900 dark:text-gray-100">
                                Add Lecture
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Add new content to your course</p>
                        </div>
                    </header>
                    <form 
                        onSubmit={onFormSubmit} className="flex flex-col gap-6"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="title">Lecture Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter lecture title"
                                onChange={handleInputChange}
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                                value={userInput.title}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="description">Lecture Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Enter a short lecture description"
                                onChange={handleInputChange}
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 dark:text-gray-100 h-32 resize-none"
                                value={userInput.description}
                            />
                        </div>

                        {userInput.videoSrc ? (
                            <video 
                                muted
                                src={userInput.videoSrc}
                                controls 
                                controlsList="nodownload nofullscreen"
                                disablePictureInPicture
                                className="aspect-video w-full rounded-xl bg-black object-contain border border-gray-200 dark:border-gray-700 shadow-sm"
                            />
                        ) : (
                            <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-yellow-500 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-all group">
                                <label className="flex h-44 cursor-pointer flex-col items-center justify-center gap-3 text-center" htmlFor="lecture">
                                    <FiUploadCloud className="text-4xl text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-all" />
                                    <span className="font-semibold text-gray-500 dark:text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-500">Upload lecture video</span>
                                    <span className="text-sm text-gray-400">MP4 or supported video file</span>
                                </label>
                                <input type="file" className="hidden" id="lecture" name="lecture" onChange={handleVideo} accept="video/mp4 video/x-mp4 video/*" />
                            </div>
                        )}
                        <button type="submit" className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 transition-colors duration-300 rounded-xl py-4 font-bold text-lg text-gray-900 shadow-sm cursor-pointer">
                            Add Lecture
                        </button>
                    </form>
                </div>
        </div>
    )
}

export default AddLecture;
