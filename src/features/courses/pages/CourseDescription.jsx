import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../../shared/layouts/HomeLayout";

function CourseDescription() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const { role, data } = useSelector((state) => state.auth);
    //
    return (
        <HomeLayout>
            <div className="min-h-screen bg-gray-900 pt-20 pb-10 px-4 flex flex-col items-center justify-center text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 w-full max-w-5xl bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 transition-all duration-300">
                    <div className="space-y-6 flex flex-col items-center md:items-start">
                        <img
                            className="w-full h-64 object-cover rounded-xl shadow-lg border border-gray-600"
                            alt="thumbnail"
                            src={state?.thumbnail?.secure_url}
                        />

                        <div className="space-y-4 w-full bg-gray-800/80 p-6 rounded-xl border border-gray-700">
                            <div className="flex flex-col gap-3 text-lg">
                                <p className="font-semibold flex justify-between">
                                    <span className="text-gray-400">Total lectures:</span>
                                    <span className="text-yellow-500 font-bold">{state?.numberOfLectures}</span>
                                </p>
                                <div className="h-px bg-gray-700 w-full"></div>
                                <p className="font-semibold flex justify-between">
                                    <span className="text-gray-400">Instructor:</span>
                                    <span className="text-yellow-500 font-bold">{state?.createdBy}</span>
                                </p>
                            </div>

                            <div className="pt-4 space-y-3">
                                {role === "ADMIN" || data?.subscription?.status === "active" ? (
                                    <button onClick={() => navigate("/course/displaylectures", { state: { ...state } })} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-xl rounded-lg font-bold px-5 py-3 w-full hover:from-yellow-400 hover:to-yellow-500 shadow-lg text-gray-900 transition-all ease-in-out duration-300">
                                        Watch Lectures
                                    </button>
                                ) : (
                                    <button onClick={() => navigate("/checkout")} className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-xl rounded-lg font-bold px-5 py-3 w-full hover:from-yellow-400 hover:to-yellow-500 shadow-lg text-gray-900 transition-all ease-in-out duration-300">
                                        Subscribe Now
                                    </button>
                                )}
                                
                                {role === "ADMIN" && (
                                    <button onClick={() => navigate(`/course/manage/${state?._id}`, { state: { ...state } })} className="bg-gradient-to-r from-blue-500 to-blue-600 text-xl rounded-lg font-bold px-5 py-3 w-full hover:from-blue-400 hover:to-blue-500 shadow-lg text-white transition-all ease-in-out duration-300">
                                        Manage Curriculum (Tasks)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 text-lg flex flex-col justify-center">
                        <h1 className="text-4xl font-extrabold text-yellow-500 tracking-wide mb-2">
                            {state?.title}
                        </h1>

                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-gray-300 border-b border-gray-700 pb-2">About this course</h2>
                            <p className="text-gray-400 leading-relaxed pt-2">{state?.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default CourseDescription;