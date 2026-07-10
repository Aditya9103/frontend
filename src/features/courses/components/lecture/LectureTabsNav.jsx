import React from 'react';
import { motion } from 'framer-motion';
import { List, CheckCircle, FileText, MessageSquare, Bookmark } from 'lucide-react';

const LectureTabsNav = ({ activeTab, setActiveTab }) => {
    return (
        <div className="pt-4 flex justify-start">
            <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10 backdrop-blur-md overflow-x-auto custom-scrollbar max-w-full">
                {[
                    { id: "playlist", label: "Playlist", icon: List, hideDesktop: true },
                    { id: "tasks", label: "Tasks", icon: CheckCircle },
                    { id: "notes", label: "Notes", icon: FileText },
                    { id: "qa", label: "Community Q&A", icon: MessageSquare },
                    { id: "bookmarks", label: "Bookmarks", icon: Bookmark }
                ].map((tab) => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id)} 
                        className={`relative px-6 py-3 rounded-[1.2rem] flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${tab.hideDesktop ? 'xl:hidden' : ''} ${activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        {activeTab === tab.id && (
                            <motion.div layoutId="activeTab" className="absolute inset-0 bg-yellow-500 rounded-[1.2rem] shadow-[0_0_15px_rgba(234,179,8,0.4)]" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <tab.icon size={14} /> {tab.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LectureTabsNav;
