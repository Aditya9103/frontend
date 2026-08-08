import { motion } from "framer-motion";
import { Building2, MapPin,Quote, TrendingUp } from "lucide-react";

import HomeLayout from "../../../shared/layouts/HomeLayout";

function SuccessStories() {
    const stories = [
        {
            name: "Rahul Verma",
            role: "Software Engineer at Google",
            content: "Learnify gave me the structured path I needed. The industry-focused projects were exactly what recruiters were looking for.",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
            company: "Google",
            location: "Bangalore"
        },
        {
            name: "Ananya Das",
            role: "UX Designer at Microsoft",
            content: "The mentor support is unparalleled. Being able to ask questions and get industry-standard feedback changed my career trajectory.",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
            company: "Microsoft",
            location: "Hyderabad"
        },
        {
            name: "Ishaan Mehta",
            role: "Data Scientist at Amazon",
            content: "From basic math to complex AI models, the transition was seamless. I highly recommend Learnify to anyone serious about tech.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
            company: "Amazon",
            location: "Seattle"
        }
    ];

    return (
        <HomeLayout>
            <div className="min-h-screen py-24 px-4 lg:px-20 bg-gray-900 transition-colors duration-500">
                <header className="max-w-7xl mx-auto text-center mb-20 space-y-4">
                    <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-100">
                        Student <span className="text-yellow-500">Success</span> Stories
                    </h1>
                    <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto italic">
                        Join thousands of students who have transformed their careers with our expert-led programs.
                    </p>
                </header>

                <main className="max-w-7xl mx-auto space-y-16 mb-24">
                    {stories.map((story, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`flex flex-col lg:flex-row items-center gap-12 bg-gray-800/50 backdrop-blur-md p-10 rounded-[2.5rem] border border-gray-700/50 shadow-2xl hover:shadow-yellow-500/10 hover:border-yellow-500/30 transition-all duration-500 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full lg:w-1/3 relative group">
                                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src={story.image} alt={story.name} className="w-full aspect-square rounded-[2rem] object-cover shadow-2xl relative z-10 border-4 border-gray-700" />
                                <div className="absolute -bottom-6 -right-6 bg-yellow-500 text-gray-900 p-6 rounded-3xl shadow-xl z-20">
                                    <TrendingUp size={32} />
                                </div>
                            </div>

                            <div className="w-full lg:w-2/3 space-y-6">
                                <Quote size={64} className="text-yellow-500/20" />
                                <p className="text-2xl lg:text-3xl font-medium text-gray-300 leading-relaxed italic">
                                    "{story.content}"
                                </p>
                                <div className="pt-6 border-t border-gray-700/50 flex flex-wrap gap-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-100">{story.name}</h3>
                                        <p className="text-yellow-500 font-semibold">{story.role}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Building2 size={18} className="text-yellow-500" />
                                        <span className="font-bold text-sm">{story.company}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <MapPin size={18} className="text-yellow-500" />
                                        <span className="font-bold text-sm">{story.location}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </main>
            </div>
        </HomeLayout>
    );
}

export default SuccessStories;
