import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../../shared/layouts/HomeLayout";
import CourseHeroBanner from "../components/CourseHeroBanner";
import CourseInfoSidebar from "../components/CourseInfoSidebar";

function CourseDescription() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { role, data } = useSelector((state) => state.auth);
    const isSubscribed = data?.subscription?.status === "active";

    return (
        <HomeLayout>
            <div className="min-h-screen bg-gray-900 pt-28 pb-24 px-4 lg:px-8 relative overflow-hidden">
                {/* Ambient Background */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 relative z-10">
                    <CourseHeroBanner state={state} />
                    <CourseInfoSidebar 
                        state={state} 
                        role={role} 
                        isSubscribed={isSubscribed} 
                        navigate={navigate} 
                    />
                </div>
            </div>
        </HomeLayout>
    );
}

export default CourseDescription;