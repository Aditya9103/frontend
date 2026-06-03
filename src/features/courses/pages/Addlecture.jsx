import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../../shared/layouts/HomeLayout";
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
        <HomeLayout>
            <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-16 text-white">
                <div className="w-full max-w-xl bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-700/50 transition-all duration-300">
                    <header className="relative mb-6 flex items-center justify-center">
                        <button 
                            className="absolute left-0 rounded-full border border-gray-600 p-2 text-xl text-yellow-500 transition-all duration-300 hover:bg-yellow-500/10 hover:border-yellow-500"
                            onClick={() => navigate(-1)}
                        >
                            <AiOutlineArrowLeft />
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold tracking-wide text-yellow-500">
                                Add Lecture
                            </h1>
                            <p className="text-gray-300 text-sm mt-1">Add new content to your course</p>
                        </div>
                    </header>
                    <form 
                        onSubmit={onFormSubmit} className="flex flex-col gap-5"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-200" htmlFor="title">Lecture Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter lecture title"
                                onChange={handleInputChange}
                                className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500"
                                value={userInput.title}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-200" htmlFor="description">Lecture Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Enter a short lecture description"
                                onChange={handleInputChange}
                                className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500 h-32 resize-none"
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
                                className="aspect-video w-full rounded-lg bg-black object-contain border border-gray-600 shadow-md"
                            />
                        ) : (
                            <div className="rounded-lg border border-dashed border-gray-500 bg-gray-800/50 hover:bg-gray-800 hover:border-yellow-500 transition-all group">
                                <label className="flex h-44 cursor-pointer flex-col items-center justify-center gap-3 text-center" htmlFor="lecture">
                                    <FiUploadCloud className="text-4xl text-gray-400 group-hover:text-yellow-500 transition-all" />
                                    <span className="font-semibold text-gray-300 group-hover:text-yellow-500">Upload lecture video</span>
                                    <span className="text-sm text-gray-500">MP4 or supported video file</span>
                                </label>
                                <input type="file" className="hidden" id="lecture" name="lecture" onChange={handleVideo} accept="video/mp4 video/x-mp4 video/*" />
                            </div>
                        )}
                        <button type="submit" className="mt-2 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 transition-all ease-in-out duration-300 rounded-lg py-3 font-bold text-lg text-gray-900 shadow-lg cursor-pointer">
                            Add Lecture
                        </button>
                    </form>
                </div>
            </div>  
        </HomeLayout>
    )
}

export default AddLecture;
