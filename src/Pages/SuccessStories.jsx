import { motion } from "framer-motion";
import HomeLayout from "../Layouts/HomeLayout";
import { Quote, TrendingUp, Building2, MapPin } from "lucide-react";

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
            <div className="min-h-screen pt-24 pb-12 px-6 lg:px-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
                <header className="max-w-7xl mx-auto text-center mb-20 space-y-4">
                    <h1 className="text-4xl lg:text-6xl font-black font-outfit text-slate-900 dark:text-white">
                        Student <span className="text-gradient">Success</span> Stories
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto italic">
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
                            className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            <div className="w-full lg:w-1/3 relative group">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src={story.image} alt={story.name} className="w-full aspect-square rounded-[3rem] object-cover shadow-2xl relative z-10 border-8 border-white dark:border-slate-900" />
                                <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white p-6 rounded-3xl shadow-xl z-20">
                                    <TrendingUp size={32} />
                                </div>
                            </div>

                            <div className="w-full lg:w-2/3 space-y-6">
                                <Quote size={64} className="text-emerald-500/20" />
                                <p className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
                                    "{story.content}"
                                </p>
                                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-8">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white">{story.name}</h3>
                                        <p className="text-emerald-500 font-bold">{story.role}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Building2 size={18} className="text-emerald-500" />
                                        <span className="font-bold text-sm">{story.company}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <MapPin size={18} className="text-emerald-500" />
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
