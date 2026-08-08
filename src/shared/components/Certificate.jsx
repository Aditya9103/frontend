import { Award, BookOpen,ShieldCheck } from 'lucide-react';
import { forwardRef } from 'react';

const Certificate = forwardRef(({ studentName, courseName, date }, ref) => {
    return (
        <div 
            ref={ref}
            className="w-[1000px] h-[700px] bg-white p-12 relative flex flex-col items-center justify-between overflow-hidden border-[20px] border-yellow-500/10"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full -trangray-y-1/2 trangray-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full trangray-y-1/2 -trangray-x-1/2"></div>
            
            {/* Border Accents */}
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-yellow-500/20 rounded-xl"></div>
            
            {/* Content */}
            <div className="z-10 flex flex-col items-center text-center space-y-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="text-white" size={24} />
                    </div>
                    <span className="text-3xl font-black tracking-tighter">
                        LEARN<span className="text-yellow-500">IFY</span>
                    </span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-gray-900 tracking-tight">CERTIFICATE</h1>
                    <p className="text-xl font-bold text-yellow-500 tracking-[0.3em] uppercase">of Completion</p>
                </div>

                <div className="w-24 h-1 bg-yellow-500/20"></div>

                <div className="space-y-4">
                    <p className="text-gray-500 font-medium italic">This is to certify that</p>
                    <h2 className="text-5xl font-black text-gray-800 capitalize border-b-2 border-gray-100 pb-4 px-12">{studentName}</h2>
                    <p className="text-gray-500 font-medium italic mt-4">has successfully completed the professional course</p>
                    <h3 className="text-3xl font-black text-yellow-600">{courseName}</h3>
                </div>
            </div>

            <div className="z-10 w-full flex items-end justify-between px-12 pb-8">
                <div className="space-y-2">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Date of Achievement</p>
                    <p className="text-xl font-bold text-gray-800">{date}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center border-2 border-yellow-500/20">
                        <Award size={40} className="text-yellow-500" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-black text-yellow-600 uppercase tracking-widest">
                        <ShieldCheck size={12} /> Verified Credential
                    </div>
                </div>

                <div className="space-y-2 text-right">
                    <div className="h-12 flex items-end justify-end">
                        <div className="text-4xl text-gray-800 opacity-80" style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive", transform: 'rotate(-2deg)' }}>
                            Learnify Team
                        </div>
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Academic Director</p>
                </div>
            </div>

            {/* Corner Emblems */}
            <div className="absolute top-0 left-0 p-8">
                <div className="w-12 h-12 border-t-4 border-l-4 border-yellow-500/20"></div>
            </div>
            <div className="absolute bottom-0 right-0 p-8">
                <div className="w-12 h-12 border-b-4 border-r-4 border-yellow-500/20"></div>
            </div>
        </div>
    );
});

Certificate.displayName = 'Certificate';

export default Certificate;
