// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { motion } from "framer-motion";
import { ArrowRight, Award, BookOpen, Globe, Laptop, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Autoplay, EffectFade,Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import HomePageImage from "../../../shared/assets/homePageMainImage.png";
import HomeLayout from "../../../shared/layouts/HomeLayout";

function HomePage() {
    const categories = [
        { name: "Web Development", icon: <Laptop className="text-yellow-400" /> },
        { name: "Design", icon: <Globe className="text-blue-400" /> },
        { name: "Business", icon: <Award className="text-amber-400" /> },
        { name: "Photography", icon: <Star className="text-rose-400" /> },
    ];

    const stats = [
        { label: "Students", value: "15K+", icon: <Users size={20} /> },
        { label: "Courses", value: "1.2K+", icon: <BookOpen size={20} /> },
        { label: "Expert Mentors", value: "200+", icon: <Award size={20} /> },
    ];

    return (
        <HomeLayout>
            {/* Hero Slider Section */}
            <div className="relative w-full overflow-hidden bg-gray-900 transition-colors duration-500">
                <Swiper
                    modules={[Autoplay, Pagination, EffectFade]}
                    effect="fade"
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    className="h-full"
                >
                    <SwiperSlide>
                        <div className="pt-20 pb-32 px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-1/2 space-y-8"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-bold uppercase tracking-widest">
                                    <Star size={16} fill="currentColor" /> The Future of Learning
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-gray-100">
                                    Unlock Your <br />
                                    <span className="text-yellow-500">Potential</span> Online
                                </h1>
                                <p className="text-xl text-gray-400 leading-relaxed max-w-lg font-medium">
                                    Access world-class education from anywhere. Master new skills with our expert-led, interactive courses designed for your career growth.
                                </p>

                                <div className="flex flex-wrap items-center gap-6">
                                    <Link to="/courses">
                                        <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold rounded-xl text-lg px-10 py-4 flex items-center gap-2 transition-all shadow-lg group">
                                            Start Learning <ArrowRight className="group-hover:trangray-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                    <Link to="/contact">
                                        <button className="bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-200 font-bold rounded-xl text-lg px-10 py-4 transition-all shadow-lg">
                                            Contact Us
                                        </button>
                                    </Link>
                                </div>

                                <div className="flex items-center gap-10 pt-4 border-t border-gray-700/50">
                                    {stats.map((s, i) => (
                                        <div key={i}>
                                            <h4 className="text-2xl font-bold text-gray-100">{s.value}</h4>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="w-full lg:w-1/2 relative"
                            >
                                <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full scale-90 animate-pulse"></div>
                                <img 
                                    className="relative z-10 w-full drop-shadow-2xl animate-float" 
                                    alt="hero" 
                                    src={HomePageImage} 
                                />
                            </motion.div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* Top Categories Section */}
            <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto bg-gray-900">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-6 mb-16">
                    <div className="space-y-4 text-center lg:text-left">
                        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-100">Top Categories</h2>
                        <div className="w-20 h-2 bg-yellow-500 rounded-full mx-auto lg:mx-0"></div>
                        <p className="text-gray-400 text-lg max-w-xl italic font-medium">
                            Explore diverse subjects and start your journey today with our curated selections.
                        </p>
                    </div>
                    <Link to="/courses" className="text-yellow-500 font-bold flex items-center gap-2 hover:gap-4 transition-all duration-300 mb-2">
                        View All Categories <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, i) => (
                        <motion.div
                            whileHover={{ y: -10 }}
                            key={i}
                            className="p-8 bg-gray-800/50 backdrop-blur-md rounded-3xl border border-gray-700/50 group cursor-pointer transition-all hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10"
                        >
                            <div className="w-14 h-14 bg-gray-900 border border-gray-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {cat.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-100">{cat.name}</h3>
                            <p className="text-gray-500 font-semibold text-sm uppercase tracking-wide">100+ Courses</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-gray-800/50 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-tr from-yellow-500 to-yellow-700 rounded-3xl rotate-3 shadow-2xl"></div>
                        <div className="absolute inset-0 aspect-square bg-gray-900 rounded-3xl -rotate-3 border border-gray-700 flex items-center justify-center overflow-hidden shadow-xl">
                             <div className="text-yellow-500/10 scale-[10] absolute">
                                <BookOpen size={100} />
                             </div>
                             <div className="relative z-10 text-center p-10">
                                <h2 className="text-8xl font-bold text-yellow-500 mb-4">12+</h2>
                                <p className="text-2xl font-bold text-gray-100 uppercase tracking-widest">Years of Excellence</p>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <h2 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-100">Why Choose <br /> Our Platform?</h2>
                        
                        <div className="space-y-8">
                            {[
                                { title: "Flexible Learning", color: "yellow", icon: <Star size={24} />, desc: "Study at your own pace with lifetime access to all course materials." },
                                { title: "Expert Instructors", color: "yellow", icon: <Award size={24} />, desc: "Learn from industry leaders who bring real-world experience to the classroom." },
                                { title: "Career Support", color: "yellow", icon: <Star size={24} />, desc: "Get guidance on resume building, interview prep, and career pathing." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className={`w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-gray-100">{item.title}</h4>
                                        <p className="text-gray-400 font-medium italic">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </HomeLayout>
    );
}

export default HomePage;