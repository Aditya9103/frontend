import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Globe, Laptop, Award, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import HomePageImage from "../Assets/Images/homePageMainImage.png";
import HomeLayout from "../Layouts/HomeLayout";

function HomePage() {
    const categories = [
        { name: "Web Development", icon: <Laptop className="text-emerald-400" /> },
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
            <div className="relative w-full overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
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
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-widest">
                                    <Star size={16} fill="currentColor" /> The Future of Learning
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-black font-outfit leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                                    Unlock Your <br />
                                    <span className="text-gradient">Potential</span> Online
                                </h1>
                                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                                    Access world-class education from anywhere. Master new skills with our expert-led, interactive courses designed for your career growth.
                                </p>

                                <div className="flex flex-wrap items-center gap-6">
                                    <Link to="/courses">
                                        <button className="btn-modern btn-primary-modern text-lg px-10 py-4 group">
                                            Start Learning <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                    <Link to="/contact">
                                        <button className="btn-modern btn-outline-modern text-lg px-10 py-4">
                                            Contact Us
                                        </button>
                                    </Link>
                                </div>

                                <div className="flex items-center gap-10 pt-4 border-t border-slate-200 dark:border-slate-800">
                                    {stats.map((s, i) => (
                                        <div key={i}>
                                            <h4 className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</h4>
                                            <p className="text-xs text-slate-500 font-black uppercase tracking-wider">{s.label}</p>
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
                                <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] rounded-full scale-90 animate-pulse"></div>
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
            <section className="py-24 px-6 lg:px-20 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-6 mb-16">
                    <div className="space-y-4 text-center lg:text-left">
                        <h2 className="text-4xl lg:text-5xl font-black font-outfit tracking-tight text-slate-900 dark:text-white">Top Categories</h2>
                        <div className="w-20 h-2 bg-emerald-500 rounded-full mx-auto lg:mx-0"></div>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl italic">
                            Explore diverse subjects and start your journey today with our curated selections.
                        </p>
                    </div>
                    <Link to="/courses" className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 hover:gap-4 transition-all duration-300 mb-2">
                        View All Categories <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, i) => (
                        <motion.div
                            whileHover={{ y: -10 }}
                            key={i}
                            className="p-8 glass-card rounded-3xl group cursor-pointer transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10"
                        >
                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {cat.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{cat.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm uppercase tracking-wide">100+ Courses</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-tr from-emerald-500 to-teal-700 rounded-3xl rotate-3 shadow-2xl"></div>
                        <div className="absolute inset-0 aspect-square bg-white dark:bg-slate-800 rounded-3xl -rotate-3 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shadow-xl">
                             <div className="text-emerald-500/10 scale-[10] absolute">
                                <BookOpen size={100} />
                             </div>
                             <div className="relative z-10 text-center p-10">
                                <h2 className="text-8xl font-black text-emerald-500 font-outfit mb-4">12+</h2>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-widest">Years of Excellence</p>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <h2 className="text-4xl lg:text-6xl font-black font-outfit leading-tight text-slate-900 dark:text-white">Why Choose <br /> Our Platform?</h2>
                        
                        <div className="space-y-8">
                            {[
                                { title: "Flexible Learning", color: "emerald", icon: <Star size={24} />, desc: "Study at your own pace with lifetime access to all course materials." },
                                { title: "Expert Instructors", color: "blue", icon: <Award size={24} />, desc: "Learn from industry leaders who bring real-world experience to the classroom." },
                                { title: "Career Support", color: "amber", icon: <Star size={24} />, desc: "Get guidance on resume building, interview prep, and career pathing." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex-shrink-0 flex items-center justify-center text-${item.color}-600 dark:text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 italic">{item.desc}</p>
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