import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BsPersonCircle } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { isEmail, isValidPassword } from '../../../core/config/regexMatcher';
import HomeLayout from '../../../shared/layouts/HomeLayout';
import { adminSendSignupOtp, adminVerifySignupOtp, resendOtp } from '../../auth/redux/AuthSlice';

function AdminSignup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [previewImage, setPreviewImage] = useState("");
    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
        adminSecret: "",
        avatar: ""
    });

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const otpRefs = useRef([]);

    useEffect(() => {
        let timer;
        if (isOtpSent && cooldown > 0) {
            timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [isOtpSent, cooldown]);

    function handleUserInput(e) {
        const {name, value} = e.target;
        setSignupData({
            ...signupData,
            [name]: value
        });
    }

    function getImage(event) {
        event.preventDefault();
        const uploadedImage = event.target.files[0];
        if(uploadedImage) {
            setSignupData({
                ...signupData,
                avatar: uploadedImage
            });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setPreviewImage(this.result);
            });
        }
    }

    async function handleSendOtp(event) {
        event.preventDefault();
        if(!signupData.email || !signupData.password || !signupData.fullName || !signupData.adminSecret) {
            toast.error("Please fill all the details");
            return;
        }

        if(signupData.fullName.length < 5) {
            toast.error("Name should be atleast of 5 characters");
            return;
        }
        if(!isEmail(signupData.email)) {
            toast.error("Invalid email id");
            return;
        }
        if(!isValidPassword(signupData.password)) {
            toast.error("Password should be 6-16 characters with a number and special character");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("fullName", signupData.fullName);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        formData.append("adminSecret", signupData.adminSecret);
        if(signupData.avatar) formData.append("avatar", signupData.avatar);

        const response = await dispatch(adminSendSignupOtp(formData));
        setIsSubmitting(false);
        if(response?.payload?.success) {
            setIsOtpSent(true);
            setCooldown(60);
        }
    }

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1].focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (pasteData.some(char => !/^[0-9]$/.test(char))) return;
        const newOtp = [...otp];
        pasteData.forEach((char, i) => { if (i < 6) newOtp[i] = char; });
        setOtp(newOtp);
        if (pasteData.length < 6) otpRefs.current[pasteData.length].focus();
        else otpRefs.current[5].focus();
    };

    async function handleVerifyOtp(e) {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        setIsSubmitting(true);
        const response = await dispatch(adminVerifySignupOtp({ email: signupData.email, otp: enteredOtp }));
        setIsSubmitting(false);
        if (response?.payload?.success) navigate("/dashboard");
    }

    async function handleResendOtp() {
        if (cooldown > 0) return;
        setIsSubmitting(true);
        const response = await dispatch(resendOtp({ email: signupData.email }));
        setIsSubmitting(false);
        if (response?.payload?.success) setCooldown(60);
    }

    return (
        <HomeLayout>
            <div className='flex items-center justify-center min-h-screen bg-gray-900 pt-20 pb-10 px-4'>
                <div className='w-full max-w-md bg-rose-900/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-rose-500/20 transition-all duration-300'>
                    
                    {!isOtpSent ? (
                        <form noValidate onSubmit={handleSendOtp} className='flex flex-col gap-5 text-white'>
                            <div className="text-center mb-4">
                                <h1 className="text-3xl font-bold tracking-wide text-rose-500">Admin Account</h1>
                                <p className="text-gray-300 text-sm mt-2">Sign up with your admin credentials</p>
                            </div>

                            <label htmlFor="image_uploads" className="cursor-pointer mx-auto transition-transform hover:scale-105">
                                {previewImage ? (
                                    <img className="w-24 h-24 rounded-full object-cover border-2 border-rose-500 shadow-lg" src={previewImage} alt="Profile" />
                                ) : (
                                    <BsPersonCircle className='w-24 h-24 rounded-full text-gray-400' />
                                )}
                            </label>
                            <input onChange={getImage} className="hidden" type="file" name="image_uploads" id="image_uploads" accept=".jpg, .jpeg, .png, .svg" />
                            
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="fullName" className='text-sm font-semibold text-gray-200'> Full Name </label>
                                <input type="text" required name="fullName" id="fullName" placeholder="John Doe"
                                    className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-gray-500"
                                    onChange={handleUserInput} value={signupData.fullName} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label htmlFor="email" className='text-sm font-semibold text-gray-200'> Email </label>
                                <input type="email" required name="email" id="email" placeholder="admin@example.com"
                                    className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-gray-500"
                                    onChange={handleUserInput} value={signupData.email} />
                            </div>

                            <div className='flex flex-col gap-1'>
                                <label htmlFor="password" className='text-sm font-semibold text-gray-200'> Password </label>
                                <input type="password" required name="password" id="password" placeholder="••••••••"
                                    className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-gray-500"
                                    onChange={handleUserInput} value={signupData.password} />
                            </div>
                            
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="adminSecret" className='text-sm font-semibold text-rose-300'> Admin Secret Key </label>
                                <input type="password" required name="adminSecret" id="adminSecret" placeholder="••••••••"
                                    className="bg-rose-950/50 px-4 py-2 rounded-lg border border-rose-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-gray-500"
                                    onChange={handleUserInput} value={signupData.adminSecret} />
                            </div>

                            <button type="submit" disabled={isSubmitting} className='mt-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 transition-all rounded-lg py-3 font-bold text-lg text-white shadow-lg cursor-pointer'>
                                {isSubmitting ? "Sending OTP..." : "Sign Up as Admin"}
                            </button>

                            <p className="text-center text-sm text-gray-300 mt-2">
                                Already have an admin account? <Link to="/admin/login" className='text-rose-500 hover:text-rose-400 font-semibold underline-offset-4 hover:underline transition-all'> Login here</Link>
                            </p>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center text-white">
                            <h2 className="text-2xl font-bold mb-2">Verify Admin Email</h2>
                            <p className="text-gray-300 text-sm text-center mb-6">
                                We've sent a 6-digit code to <span className="font-semibold text-rose-500">{signupData.email}</span>
                            </p>
                            
                            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col items-center">
                                <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                                    {otp.map((digit, idx) => (
                                        <input key={idx} ref={el => otpRefs.current[idx] = el} type="text" maxLength={1} value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                            className="w-12 h-14 text-center text-xl font-bold bg-gray-800/50 border border-gray-600 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                                        />
                                    ))}
                                </div>
                                
                                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 transition-all rounded-lg py-3 font-bold text-lg text-white shadow-lg">
                                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                                </button>
                            </form>
                            
                            <div className="mt-6 flex flex-col items-center gap-2 text-sm">
                                <p className="text-gray-400">Didn't receive the code?</p>
                                <button onClick={handleResendOtp} disabled={cooldown > 0 || isSubmitting}
                                    className={`font-semibold transition-all ${cooldown > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-rose-500 hover:text-rose-400 underline underline-offset-4'}`}>
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}

export default AdminSignup;
