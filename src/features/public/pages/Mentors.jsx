import { motion } from "framer-motion";
import { BookOpen, Star,User } from "lucide-react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

import HomeLayout from "../../../shared/layouts/HomeLayout";

function Mentors() {
    const mentors = [
        {
            name: "Dr. Aradhya Sharma",
            role: "Senior AI Researcher",
            bio: "With over 15 years in Machine Learning and AI, Dr. Sharma has led projects at global tech giants.",
            courses: 12,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
        },
        {
            name: "Vikram Malhotra",
            role: "Full Stack Architect",
            bio: "Expert in scalable web architectures and modern JavaScript frameworks. Passionate about clean code.",
            courses: 8,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
        },
        {
            name: "Sanya Iyer",
            role: "Product Design Lead",
            bio: "Defining user experiences for the next billion users. Former UX Lead at top fintech startups.",
            courses: 5,
            rating: 5.0,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200"
        }
    ];

    return (
        <HomeLayout>
            <div className="min-h-screen py-24 px-4 lg:px-20 bg-gray-900 transition-colors duration-500">
                <header className="max-w-7xl mx-auto text-center mb-20 space-y-4">
                    <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-100">
                        Learn from the <span className="text-yellow-500">Best</span>
                    </h1>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto italic">
                        Our mentors are industry veterans, researchers, and pioneers in their fields.
                    </p>
                </header>

                <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
                    {mentors.map((mentor, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-800/50 backdrop-blur-md p-8 rounded-[2.5rem] border border-gray-700/50 shadow-2xl group hover:shadow-yellow-500/10 hover:border-yellow-500/30 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-[5rem] -z-10 group-hover:bg-yellow-500/10 transition-colors"></div>
                            
                            <div className="flex items-center gap-6 mb-6">
                                <img src={mentor.image} alt={mentor.name} className="w-20 h-20 rounded-2xl object-cover shadow-xl border-2 border-gray-700" />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-100">{mentor.name}</h2>
                                    <p className="text-yellow-500 font-semibold text-sm">{mentor.role}</p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed mb-8 italic">
                                "{mentor.bio}"
                            </p>

                            <div className="flex items-center justify-between border-t border-gray-700/50 pt-6">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <BookOpen size={16} className="text-yellow-500" />
                                        <span className="text-xs font-bold">{mentor.courses} Courses</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-bold">{mentor.rating}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-yellow-500 hover:scale-110 transition-all border border-gray-700 hover:border-yellow-500"><FaLinkedin size={16} /></button>
                                    <button className="p-2 bg-gray-900 rounded-lg text-gray-400 hover:text-yellow-500 hover:scale-110 transition-all border border-gray-700 hover:border-yellow-500"><FaTwitter size={16} /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </main>
            </div>
        </HomeLayout>
    );
}

export default Mentors;
