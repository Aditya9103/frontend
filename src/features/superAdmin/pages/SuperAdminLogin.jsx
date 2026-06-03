import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../auth/redux/AuthSlice";

const SuperAdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  async function handleSuperAdminLogin(event) {
    event.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the details");
      return;
    }

    try {
      const response = await dispatch(login(loginData));
      
      if (response?.payload?.success) {
        navigate("/super-admin/dashboard");
      }
    } catch (error) {
      toast.error("Failed to login to Super Admin account");
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

        <div className="flex flex-col gap-1 mt-4">
          <label className="font-semibold text-lg" htmlFor="email">
            Email
          </label>
          <input
            required
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="px-2 py-1 bg-transparent border text-white rounded"
            onChange={handleUserInput}
            value={loginData.email}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-lg" htmlFor="password">
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="px-2 py-1 bg-transparent border text-white rounded"
            onChange={handleUserInput}
            value={loginData.password}
          />
        </div>

        <button
          className="w-full py-2 mt-4 text-lg font-semibold bg-blue-600 rounded hover:bg-blue-500 transition-all ease-in-out duration-300"
          type="submit"
        >
          Login
        </button>

        <p className="text-center mt-2">
          Don't have an account?{" "}
          <Link to="/super-admin/signup" className="text-blue-500 hover:text-blue-400 font-semibold cursor-pointer">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SuperAdminLogin;
