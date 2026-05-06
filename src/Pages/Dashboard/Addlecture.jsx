import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { addCourseLecture } from "../../Redux/Slices/LectureSlice";

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
            <div className="flex min-h-[90vh] flex-col items-center justify-center px-4 py-10 text-white">
                <div className="w-full max-w-xl rounded-lg border border-white/10 bg-gray-900/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                    <header className="relative mb-6 flex items-center justify-center">
                        <button 
                            className="absolute left-0 rounded-md border border-white/10 p-2 text-xl text-yellow-500 transition-all duration-300 hover:bg-white/10"
                            onClick={() => navigate(-1)}
                        >
                            <AiOutlineArrowLeft />
                        </button>
                        <h1 className="text-xl font-semibold text-yellow-500">
                            Add Lecture
                        </h1>
                    </header>
                    <form 
                        onSubmit={onFormSubmit} className="flex flex-col gap-5"
                    >
                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-200">Lecture Title</span>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter lecture title"
                                onChange={handleInputChange}
                                className="rounded-md border border-white/10 bg-gray-950 px-3 py-2 outline-none transition-all duration-300 focus:border-yellow-500"
                                value={userInput.title}
                            />
                        </label>

                        <label className="flex flex-col gap-2">
                            <span className="text-sm font-semibold text-gray-200">Lecture Description</span>
                            <textarea
                                name="description"
                                placeholder="Enter a short lecture description"
                                onChange={handleInputChange}
                                className="h-36 resize-none rounded-md border border-white/10 bg-gray-950 px-3 py-2 outline-none transition-all duration-300 focus:border-yellow-500"
                                value={userInput.description}
                            />
                        </label>

                        {userInput.videoSrc ? (
                            <video 
                                muted
                                src={userInput.videoSrc}
                                controls 
                                controlsList="nodownload nofullscreen"
                                disablePictureInPicture
                                className="aspect-video w-full rounded-lg bg-black object-contain"
                            />
                        ) : (
                            <div className="rounded-lg border border-dashed border-white/20 bg-gray-950">
                                <label className="flex h-52 cursor-pointer flex-col items-center justify-center gap-3 text-center" htmlFor="lecture">
                                    <FiUploadCloud className="text-4xl text-yellow-500" />
                                    <span className="font-semibold">Upload lecture video</span>
                                    <span className="text-sm text-gray-400">MP4 or supported video file</span>
                                </label>
                                <input type="file" className="hidden" id="lecture" name="lecture" onChange={handleVideo} accept="video/mp4 video/x-mp4 video/*" />
                            </div>
                        )}
                        <button type="submit" className="rounded-md bg-yellow-500 py-3 text-lg font-semibold text-gray-950 transition-all duration-300 hover:bg-yellow-400">
                            Add Lecture
                        </button>
                    </form>
                </div>
            </div>  
        </HomeLayout>
    )
}

export default AddLecture;
