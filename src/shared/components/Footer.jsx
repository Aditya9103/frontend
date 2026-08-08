import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';
import { BsFacebook, BsGithub,BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { Link } from 'react-router-dom';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
            <div className="max-w-7xl mx-auto pt-20 pb-10 px-6 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 space-y-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/20">
                                <BookOpen className="text-white" size={28} />
                            </div>
                            <span className="text-3xl font-black font-outfit tracking-tighter text-gray-900 dark:text-white">
                                LEARN<span className="text-yellow-500">IFY</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-lg">
                            Elevating the standard of online education through interactive, expert-led curriculum. Join 50,000+ students worldwide.
                        </p>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Download Our App</h4>
                            <div className="flex flex-wrap gap-3">
                                <div className="px-4 py-2 bg-gray-900 text-white rounded-xl flex items-center gap-2 cursor-pointer hover:bg-black transition-all border border-gray-800">
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                        <div className="w-3 h-3 bg-black rounded-full"></div>
                                    </div>
                                    <div className="text-[10px] leading-none">
                                        <p className="opacity-60">Get it on</p>
                                        <p className="text-sm font-bold">Google Play</p>
                                    </div>
                                </div>
                                <div className="px-4 py-2 bg-gray-900 text-white rounded-xl flex items-center gap-2 cursor-pointer hover:bg-black transition-all border border-gray-800">
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                        <div className="w-3 h-3 bg-black rounded-full"></div>
                                    </div>
                                    <div className="text-[10px] leading-none">
                                        <p className="opacity-60">Download on</p>
                                        <p className="text-sm font-bold">App Store</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-12">
                        {/* Company */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black font-outfit text-gray-900 dark:text-white uppercase tracking-[0.2em]">Company</h3>
                            <ul className="space-y-4">
                                {['About Us', 'Careers', 'Press', 'Affiliate', 'Contact'].map((item) => (
                                    <li key={item}>
                                        <Link className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors font-bold text-sm">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Top Categories */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black font-outfit text-gray-900 dark:text-white uppercase tracking-[0.2em]">Categories</h3>
                            <ul className="space-y-4">
                                {['Web Dev', 'Data Science', 'Design', 'Marketing', 'Business'].map((item) => (
                                    <li key={item}>
                                        <Link className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors font-bold text-sm">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black font-outfit text-gray-900 dark:text-white uppercase tracking-[0.2em]">Resources</h3>
                            <ul className="space-y-4">
                                {['Blog', 'Certificates', 'Podcasts', 'Community', 'Docs'].map((item) => (
                                    <li key={item}>
                                        <Link className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors font-bold text-sm">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social & Support */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <h3 className="text-sm font-black font-outfit text-gray-900 dark:text-white uppercase tracking-[0.2em]">Support</h3>
                                <ul className="space-y-4">
                                    {['Help Center', 'Terms', 'Privacy'].map((item) => (
                                        <li key={item}>
                                            <Link className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 transition-colors font-bold text-sm">{item}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-wrap gap-3 pt-2">
                                {[<BsFacebook size={16} />, <BsTwitter size={16} />, <BsInstagram size={16} />, <BsGithub size={16} />].map((icon, i) => (
                                    <a key={i} href="#" className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-yellow-500 hover:text-white transition-all shadow-sm">
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter & Bottom */}
                <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                         <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">
                            © {year} LEARN<span className="text-yellow-500 font-black">IFY</span>. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                             <div className="font-black text-xs text-gray-400 italic">SECURE PAYMENTS:</div>
                             <div className="flex gap-4">
                                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-800 rounded"></div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="w-full max-w-md">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -trangray-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={18} />
                            <input 
                                type="email" 
                                placeholder="Subscribe to our news" 
                                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-3 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-gray-900 dark:text-white font-bold text-sm"
                            />
                            <button className="absolute right-2 top-1/2 -trangray-y-1/2 px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white font-black text-xs uppercase rounded-xl transition-all shadow-lg">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    );
}

export default Footer;