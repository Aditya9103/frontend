import { useEffect, useState } from "react";
import { FiBookOpen, FiPlus, FiTrash2, FiVideo } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourseLecture, getCourseLectures } from "../../Redux/Slices/LectureSlice";

function Displaylectures() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { lectures, isLoading, error } = useSelector((state) => state.lecture);
    const { role } = useSelector((state) => state.auth);

    const [currentVideo, setCurrentVideo] = useState(0);
    const activeLecture = lectures?.[currentVideo];

    async function onLectureDelete(courseId, lectureId) {
        await dispatch(deleteCourseLecture({ courseId, lectureId }));
        await dispatch(getCourseLectures(courseId));
    }

    useEffect(() => {
        if (!state) {
            navigate("/courses");
            return;
        }

        dispatch(getCourseLectures(state._id));
    }, [dispatch, navigate, state]);

    useEffect(() => {
        if (currentVideo >= lectures.length) {
            setCurrentVideo(0);
        }
    }, [currentVideo, lectures.length]);

    return (
        <HomeLayout>
            <div className="min-h-[90vh] px-4 py-8 text-white sm:px-8 lg:px-12">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
                    <header className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-2">
                            <p className="flex items-center gap-2 text-sm font-semibold uppercase text-yellow-500">
                                <FiBookOpen />
                                Course Player
                            </p>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {state?.title}
                            </h1>
                            <p className="text-sm text-gray-300">
                                {lectures?.length || 0} lecture{lectures?.length === 1 ? "" : "s"} available
                            </p>
                        </div>

                        {role === "ADMIN" && (
                            <button
                                onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                                className="inline-flex w-fit items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 font-semibold text-gray-950 transition-all duration-300 hover:bg-yellow-400"
                            >
                                <FiPlus />
                                Add Lecture
                            </button>
                        )}
                    </header>

                    {isLoading && (
                        <div className="flex min-h-[50vh] items-center justify-center rounded-lg border border-white/10 bg-gray-900/40 text-gray-200">
                            Loading lectures...
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="rounded-lg border border-red-400/30 bg-red-950/40 p-5 text-red-100">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && lectures?.length > 0 && (
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                            <section className="overflow-hidden rounded-lg border border-white/10 bg-gray-900 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                                <div className="aspect-video bg-black">
                                    <video
                                        key={activeLecture?._id}
                                        src={activeLecture?.lecture?.secure_url}
                                        className="h-full w-full object-contain"
                                        controls
                                        controlsList="nodownload"
                                        disablePictureInPicture
                                    />
                                </div>

                                <div className="space-y-4 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 rounded-md bg-yellow-500/15 p-2 text-yellow-400">
                                            <FiVideo />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase text-yellow-500">
                                                Now Watching
                                            </p>
                                            <h2 className="text-xl font-bold">
                                                {activeLecture?.title}
                                            </h2>
                                            <p className="text-sm leading-6 text-gray-300">
                                                {activeLecture?.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <aside className="rounded-lg border border-white/10 bg-gray-900/80">
                                <div className="border-b border-white/10 p-4">
                                    <p className="text-lg font-bold text-yellow-500">
                                        Lecture List
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Select a lecture to continue watching.
                                    </p>
                                </div>

                                <ul className="max-h-[34rem] overflow-y-auto p-3">
                                    {lectures.map((lecture, idx) => {
                                        const isActive = idx === currentVideo;

                                        return (
                                            <li key={lecture._id}>
                                                <button
                                                    onClick={() => setCurrentVideo(idx)}
                                                    className={`mb-3 w-full rounded-md border p-3 text-left transition-all duration-300 ${
                                                        isActive
                                                            ? "border-yellow-500 bg-yellow-500/10"
                                                            : "border-white/10 bg-gray-800/80 hover:border-yellow-500/60 hover:bg-gray-800"
                                                    }`}
                                                >
                                                    <span className="text-xs font-semibold uppercase text-gray-400">
                                                        Lecture {idx + 1}
                                                    </span>
                                                    <span className="mt-1 block font-semibold text-white">
                                                        {lecture?.title}
                                                    </span>
                                                </button>

                                                {role === "ADMIN" && (
                                                    <button
                                                        onClick={() => onLectureDelete(state?._id, lecture?._id)}
                                                        className="mb-3 inline-flex items-center gap-2 rounded-md border border-red-400/40 px-3 py-2 text-sm font-semibold text-red-200 transition-all duration-300 hover:bg-red-500 hover:text-white"
                                                    >
                                                        <FiTrash2 />
                                                        Delete
                                                    </button>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </aside>
                        </div>
                    )}

                    {!isLoading && !error && (!lectures || lectures.length === 0) && (
                        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-white/20 bg-gray-900/50 p-8 text-center">
                            <FiVideo className="text-4xl text-yellow-500" />
                            <div>
                                <h2 className="text-xl font-bold">No lectures available</h2>
                                <p className="mt-2 text-sm text-gray-300">
                                    This course does not have any lectures yet.
                                </p>
                            </div>
                            {role === "ADMIN" && (
                                <button
                                    onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                                    className="inline-flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 font-semibold text-gray-950 transition-all duration-300 hover:bg-yellow-400"
                                >
                                    <FiPlus />
                                    Add Lecture
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}

export default Displaylectures;
