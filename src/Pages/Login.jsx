import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import HomeLayout from '../Layouts/HomeLayout';
import { login, googleAuth, sendLoginOtp, verifyLoginOtp, resendOtp } from '../Redux/Slices/AuthSlice';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [isOtpSent, setIsOtpSent] = useState(false);
    
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(0);
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
        setLoginData({ ...loginData, [name]: value });
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();
        
        if (!loginData.email) {
            toast.error("Please enter your email");
            return;
        }

        if (loginMethod === 'password') {
            if (!loginData.password) {
                toast.error("Please enter your password");
                return;
            }
            setIsSubmitting(true);
            const response = await dispatch(login(loginData));
            setIsSubmitting(false);
            if(response?.payload?.success) navigate("/dashboard");
        } else {
            // Send OTP
            setIsSubmitting(true);
            const response = await dispatch(sendLoginOtp({ email: loginData.email }));
            setIsSubmitting(false);
            if(response?.payload?.success) {
                setIsOtpSent(true);
                setCooldown(60);
            }
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
        const response = await dispatch(verifyLoginOtp({ email: loginData.email, otp: enteredOtp }));
        setIsSubmitting(false);
        if (response?.payload?.success) navigate("/dashboard");
    }

    async function handleResendOtp() {
        if (cooldown > 0) return;
        setIsSubmitting(true);
        const response = await dispatch(resendOtp({ email: loginData.email }));
        setIsSubmitting(false);
        if (response?.payload?.success) setCooldown(60);
    }

    async function handleGoogleSuccess(credentialResponse) {
        const response = await dispatch(googleAuth(credentialResponse.credential));
        if(response?.payload?.success) navigate("/dashboard");
    }

    return (
        <HomeLayout>
            <div className='flex items-center justify-center min-h-screen bg-gray-900 pt-16 pb-10 px-4'>
                <div className='w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 transition-all duration-300'>
                    
                    {!isOtpSent ? (
                        <div className='flex flex-col gap-6 text-white'>
                            <div className="text-center">
                                <h1 className="text-3xl font-bold tracking-wide">Welcome Back</h1>
                                <p className="text-gray-300 text-sm mt-2">Log in to continue your journey</p>
                            </div>

                            {/* Method Toggle */}
                            <div className="flex p-1 bg-gray-800/80 rounded-lg border border-gray-700">
                                <button 
                                    onClick={() => setLoginMethod('password')} 
                                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${loginMethod === 'password' ? 'bg-yellow-500 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Password
                                </button>
                                <button 
                                    onClick={() => setLoginMethod('otp')} 
                                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${loginMethod === 'otp' ? 'bg-yellow-500 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    OTP
                                </button>
                            </div>

                            <form noValidate onSubmit={handleLoginSubmit} className='flex flex-col gap-5'>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="email" className='text-sm font-semibold text-gray-200'> Email </label>
                                    <input type="email" required name="email" id="email" placeholder="john@example.com"
                                        className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500"
                                        onChange={handleUserInput} value={loginData.email} />
                                </div>

                                {loginMethod === 'password' && (
                                    <div className='flex flex-col gap-1 transition-all duration-500'>
                                        <label htmlFor="password" className='text-sm font-semibold text-gray-200'> Password </label>
                                        <input type="password" required name="password" id="password" placeholder="••••••••"
                                            className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500"
                                            onChange={handleUserInput} value={loginData.password} />
                                    </div>
                                )}

                                <button type="submit" disabled={isSubmitting} className='mt-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 transition-all rounded-lg py-3 font-bold text-lg text-gray-900 shadow-lg'>
                                    {isSubmitting ? "Processing..." : (loginMethod === 'password' ? "Login" : "Send OTP")}
                                </button>
                            </form>

                            <div className="flex w-full items-center justify-center my-1">
                                <div className="w-full h-[1px] bg-gray-600"></div>
                                <span className="px-4 text-gray-400 text-sm">OR</span>
                                <div className="w-full h-[1px] bg-gray-600"></div>
                            </div>

                            <div className="flex justify-center w-full">
                                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google Login Failed')} useOneTap theme="filled_black" shape="pill" text="continue_with" />
                            </div>

                            <p className="text-center text-sm text-gray-300 mt-2">
                                Don't have an account? <Link to="/signup" className='text-yellow-500 hover:text-yellow-400 font-semibold underline-offset-4 hover:underline transition-all'> Sign Up</Link>
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-white">
                            <h2 className="text-2xl font-bold mb-2">Verify Login</h2>
                            <p className="text-gray-300 text-sm text-center mb-6">
                                We've sent a login code to <span className="font-semibold text-yellow-500">{loginData.email}</span>
                            </p>
                            
                            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col items-center">
                                <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                                    {otp.map((digit, idx) => (
                                        <input key={idx} ref={el => otpRefs.current[idx] = el} type="text" maxLength={1} value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                            className="w-12 h-14 text-center text-xl font-bold bg-gray-800/50 border border-gray-600 rounded-lg focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
                                        />
                                    ))}
                                </div>
                                
                                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 transition-all rounded-lg py-3 font-bold text-lg text-gray-900 shadow-lg">
                                    {isSubmitting ? "Verifying..." : "Verify & Login"}
                                </button>
                            </form>
                            
                            <div className="mt-6 flex flex-col items-center gap-2 text-sm">
                                <p className="text-gray-400">Didn't receive the code?</p>
                                <button onClick={handleResendOtp} disabled={cooldown > 0 || isSubmitting}
                                    className={`font-semibold transition-all ${cooldown > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-yellow-500 hover:text-yellow-400 underline underline-offset-4'}`}>
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                                </button>
                                
                                <button onClick={() => { setIsOtpSent(false); setOtp(['','','','','','']); }} className="mt-4 text-gray-400 hover:text-white transition-all text-sm underline underline-offset-4">
                                    Use a different login method
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}

export default Login;