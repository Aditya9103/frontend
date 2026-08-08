import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getErrorMessage } from "../../../shared/utils/apiError";
import { login } from "../../auth/redux/AuthSlice";

const SuperAdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutMessage, setLockoutMessage] = useState('');

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  }

  async function handleSuperAdminLogin(event) {
    event.preventDefault();
    setLockoutMessage('');

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    const response = await dispatch(login(loginData));
    setIsSubmitting(false);

    if (response?.payload?.success) {
      navigate("/super-admin/dashboard");
    } else if (response?.error) {
      const code = response?.error?.code;
      if (code === 'ACCOUNT_LOCKED' || code === 'RATE_LIMIT_EXCEEDED') {
        setLockoutMessage(getErrorMessage(code));
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form
        noValidate
        onSubmit={handleSuperAdminLogin}
        className="flex flex-col justify-center gap-4 p-8 w-[24rem] shadow-[0_0_15px_blue] rounded-xl"
      >
        <h1 className="text-3xl font-bold text-center text-blue-500">Super Admin Login</h1>

        {/* Lockout / Rate-limit banner */}
        {lockoutMessage && (
          <div className="p-3 bg-red-900/40 border border-red-500/40 rounded-lg text-red-300 text-sm font-medium">
            🔒 {lockoutMessage}
          </div>
        )}

        <div className="flex flex-col gap-1 mt-4">
          <label className="font-semibold text-lg" htmlFor="sa-email">
            Email
          </label>
          <input
            required
            type="email"
            name="email"
            id="sa-email"
            placeholder="Enter your email"
            className="px-2 py-1 bg-transparent border text-white rounded"
            onChange={handleUserInput}
            value={loginData.email}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-lg" htmlFor="sa-password">
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            id="sa-password"
            placeholder="Enter your password"
            className="px-2 py-1 bg-transparent border text-white rounded"
            onChange={handleUserInput}
            value={loginData.password}
          />
        </div>

        <button
          className="w-full py-2 mt-4 text-lg font-semibold bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50 transition-all ease-in-out duration-300"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in…' : 'Login'}
        </button>

        <p className="text-center mt-2">
          Don&apos;t have an account?{" "}
          <Link to="/super-admin/signup" className="text-blue-500 hover:text-blue-400 font-semibold cursor-pointer">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SuperAdminLogin;
