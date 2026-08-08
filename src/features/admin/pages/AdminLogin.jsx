import { useEffect,useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import HomeLayout from '../../../shared/layouts/HomeLayout';
import { getErrorMessage } from '../../../shared/utils/apiError';
import { adminPasswordLogin, adminSendLoginOtp, adminVerifyLoginOtp, resendOtp } from '../../auth/redux/AuthSlice';

function AdminLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [isOtpSent, setIsOtpSent] = useState(false);
    
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lockoutMessage, setLockoutMessage] = useState('');

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
        setLockoutMessage('');

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
            const response = await dispatch(adminPasswordLogin({ email: loginData.email, password: loginData.password }));
            setIsSubmitting(false);
            if (response?.payload?.success) {
                navigate("/dashboard");
            } else if (response?.error) {
                const code = response?.error?.code;
                if (code === 'ACCOUNT_LOCKED' || code === 'RATE_LIMIT_EXCEEDED') {
                    setLockoutMessage(getErrorMessage(code));
                }
            }
        } else {
            setIsSubmitting(true);
            const response = await dispatch(adminSendLoginOtp({ email: loginData.email }));
            setIsSubmitting(false);
            if (response?.payload?.success) {
                setIsOtpSent(true);
                setCooldown(60);
            } else if (response?.error) {
                const code = response?.error?.code;
                if (code === 'ACCOUNT_LOCKED' || code === 'RATE_LIMIT_EXCEEDED') {
                    setLockoutMessage(getErrorMessage(code));
                }
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
        const response = await dispatch(adminVerifyLoginOtp({ email: loginData.email, otp: enteredOtp }));
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

    return (
        <HomeLayout>
            <div className='flex items-center justify-center min-h-screen bg-gray-900 pt-16 pb-10 px-4'>
                <div className='w-full max-w-md bg-rose-900/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-rose-500/20 transition-all duration-300'>

                    {/* Lockout / Rate-limit banner */}
                    {lockoutMessage && (
                        <div className="mb-4 p-4 bg-red-900/40 border border-red-500/40 rounded-xl text-red-300 text-sm font-medium">
                            🔒 {lockoutMessage}
                        </div>
                    )}

                    {!isOtpSent ? (
                        <div className='flex flex-col gap-6 text-white'>
                            <div className="text-center">
                                <h1 className="text-3xl font-bold tracking-wide text-rose-500">Admin Portal</h1>
                                <p className="text-gray-300 text-sm mt-2">Log in with your admin credentials</p>
                            </div>

                            <form noValidate onSubmit={handleLoginSubmit} className='flex flex-col gap-5'>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="email" className='text-sm font-semibold text-gray-200'> Admin Email </label>
                                    <input type="email" required name="email" id="email" placeholder="admin@example.com"
                                        className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-gray-500"
                                        onChange={handleUserInput} value={loginData.email} />
                                </div>

                                {loginMethod === 'password' && (
                                    <div className='flex flex-col gap-1'>
                                        <label htmlFor="password" className='text-sm font-semibold text-gray-200'> Password </label>
                                        <input type="password" required name="password" id="password" placeholder="••••••••"
                                            className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-gray-500"
                                            onChange={handleUserInput} value={loginData.password} />
                                    </div>
                                )}

                                <button type="submit" disabled={isSubmitting} className='mt-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 transition-all rounded-lg py-3 font-bold text-lg text-white shadow-lg'>
                                    {isSubmitting ? "Processing..." : (loginMethod === 'password' ? "Login" : "Send Admin OTP")}
                                </button>
                            </form>

                            <div className="flex items-center gap-4 my-2">
                                <div className="h-px bg-gray-600 flex-1"></div>
                                <span className="text-sm text-gray-400">OR</span>
                                <div className="h-px bg-gray-600 flex-1"></div>
                            </div>

                            <button onClick={() => setLoginMethod(prev => prev === 'password' ? 'otp' : 'password')}
                                className="w-full bg-transparent border border-rose-500/50 hover:bg-rose-500/10 transition-all rounded-lg py-2 font-semibold text-rose-400 shadow-sm">
                                {loginMethod === 'password' ? "Login with OTP instead" : "Login with Password instead"}
                            </button>

                            <p className="text-center text-sm text-gray-300 mt-2">
                                Not an admin? <Link to="/login" className='text-yellow-500 hover:text-yellow-400 font-semibold underline-offset-4 hover:underline transition-all'> Login as User</Link>
                            </p>
                            
                            <p className="text-center text-sm text-gray-300 mt-2">
                                Need to register? <Link to="/admin/signup" className='text-rose-500 hover:text-rose-400 font-semibold underline-offset-4 hover:underline transition-all'> Sign Up</Link>
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-white">
                            <h2 className="text-2xl font-bold mb-2">Verify Admin Login</h2>
                            <p className="text-gray-300 text-sm text-center mb-6">
                                We've sent an admin code to <span className="font-semibold text-rose-500">{loginData.email}</span>
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
                                    {isSubmitting ? "Verifying..." : "Verify & Login"}
                                </button>
                            </form>
                            
                            <div className="mt-6 flex flex-col items-center gap-2 text-sm">
                                <p className="text-gray-400">Didn't receive the code?</p>
                                <button onClick={handleResendOtp} disabled={cooldown > 0 || isSubmitting}
                                    className={`font-semibold transition-all ${cooldown > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-rose-500 hover:text-rose-400 underline underline-offset-4'}`}>
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                                </button>
                                
                                <button onClick={() => { setIsOtpSent(false); setOtp(['','','','','','']); }} className="mt-4 text-gray-400 hover:text-white transition-all text-sm underline underline-offset-4">
                                    Use a different email or password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}

export default AdminLogin;
