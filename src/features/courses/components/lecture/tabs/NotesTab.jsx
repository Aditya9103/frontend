import React from 'react';
import { FileText, Send, Trash2, Clock } from 'lucide-react';

const NotesTab = ({
    notes,
    noteInput,
    setNoteInput,
    handleAddNote,
    handleExportNotes,
    seekToTime,
    handleDeleteNote,
    formatTime
}) => {
    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"><FileText size={20} /></div>
                    <div>
                        <h2 className="text-xl font-black font-outfit text-white">Smart Notes</h2>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Timestamped Learning</p>
                    </div>
                </div>
                {notes.length > 0 && (
                    <button onClick={handleExportNotes} className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                        <FileText size={14} /> Export to PDF
                    </button>
                )}
            </div>

            <div className="flex gap-3 mb-6 flex-shrink-0">
                <input 
                    type="text" 
                    value={noteInput} 
                    onChange={(e) => setNoteInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    placeholder="Type a note and hit enter... (Saves current timestamp)" 
                    className="flex-1 bg-black/50 border border-white/10 focus:border-yellow-500 rounded-xl px-5 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-yellow-500/20 text-white"
                />
                <button onClick={handleAddNote} disabled={!noteInput.trim()} className="px-6 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed">
                    <Send size={20} />
                </button>
            </div>

            <div className="pb-4">
                {notes.length > 0 ? (
                    <div className="relative border-l-2 border-white/10 ml-6 pl-8 space-y-8">
                        {notes.map((note) => (
                            <div key={note._id} className="relative group">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[41px] top-1 w-5 h-5 bg-yellow-500 rounded-full border-4 border-[#121212] group-hover:scale-125 transition-transform" />
                                
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-yellow-500/30 transition-all flex flex-col gap-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <button onClick={() => seekToTime(note.timestamp)} className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg text-[10px] font-black flex items-center gap-1.5 hover:bg-yellow-500 hover:text-black transition-all flex-shrink-0">
                                            <Clock size={12} /> {formatTime(note.timestamp)}
                                        </button>
                                        <button onClick={() => handleDeleteNote(note._id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all flex-shrink-0">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <p className="text-sm font-medium text-gray-200 leading-relaxed break-words whitespace-pre-wrap">
                                        {note.text}
                                    </p>
                                    {note.lectureTitle && (
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">
                                            {note.lectureTitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <FileText size={48} className="opacity-20" />
                        <p className="font-bold">No notes yet. Add one to save a specific moment!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesTab;
