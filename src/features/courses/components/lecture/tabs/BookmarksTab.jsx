import React from 'react';
import { Bookmark, Clock, Trash2 } from 'lucide-react';

const BookmarksTab = ({ bookmarks, seekToTime, formatTime }) => {
    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4 flex-shrink-0">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"><Bookmark size={20} /></div>
                <div>
                    <h2 className="text-xl font-black font-outfit text-white">My Bookmarks</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Saved Video Moments</p>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookmarks.map((bookmark) => (
                        <div key={bookmark._id} className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all flex flex-col justify-between h-32 relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 opacity-5 text-yellow-500 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
                                <Bookmark size={100} />
                            </div>
                            <div className="flex justify-between items-start z-10">
                                <button onClick={() => seekToTime(bookmark.timestamp)} className="px-3 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-lg text-xs font-black flex items-center gap-1.5 hover:bg-yellow-500 hover:text-black transition-all">
                                    <Clock size={12} /> {formatTime(bookmark.timestamp)}
                                </button>
                            </div>
                            <div className="z-10">
                                <h4 className="font-bold text-gray-200 truncate">{bookmark.label || 'Saved Moment'}</h4>
                            </div>
                        </div>
                    ))}
                </div>
                {bookmarks.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <Bookmark size={48} className="opacity-20" />
                        <p className="font-bold">No bookmarks yet. Click "Bookmark Moment" while watching!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarksTab;
