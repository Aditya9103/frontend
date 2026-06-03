import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { superAdminSignup } from "../../auth/redux/AuthSlice";

const SuperAdminSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    superAdminSecurityCode: "",
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  }

  async function createNewSuperAdmin(event) {
    event.preventDefault();

    if (
      !signupData.fullName ||
      !signupData.email ||
      !signupData.password ||
      !signupData.superAdminSecurityCode
    ) {
      toast.error("Please fill all the details");
      return;
    }

    // Checking name length
    if (signupData.fullName.length < 5) {
      toast.error("Name should be at least 5 characters long");
      return;
    }

    try {
      const response = await dispatch(superAdminSignup(signupData));
      
      if (response?.payload?.success) {
        navigate("/super-admin/login");
      }
    } catch (error) {
      toast.error("Failed to create Super Admin account");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <form
        noValidate
        onSubmit={createNewSuperAdmin}
        className="flex flex-col justify-center gap-4 p-8 w-[24rem] shadow-[0_0_15px_blue] rounded-xl"
      >
        <h1 className="text-3xl font-bold text-center text-blue-500">Super Admin Signup</h1>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-lg" htmlFor="fullName">
            Full Name
          </label>
          <input
            required
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Enter your name"
            className="px-2 py-1 bg-transparent border text-white rounded"
            onChange={handleUserInput}
            value={signupData.fullName}
          />
        </div>

        <div className="flex flex-col gap-1">
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
            value={signupData.email}
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
            value={signupData.password}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-lg" htmlFor="superAdminSecurityCode">
            Security Code
          </label>
          <input
            required
            type="password"
            name="superAdminSecurityCode"
            id="superAdminSecurityCode"
            placeholder="Enter Secret Setup Code"
            className="px-2 py-1 bg-transparent border text-blue-300 rounded"
            onChange={handleUserInput}
            value={signupData.superAdminSecurityCode}
          />
        </div>

        <button
          className="w-full py-2 mt-4 text-lg font-semibold bg-blue-600 rounded hover:bg-blue-500 transition-all ease-in-out duration-300"
          type="submit"
        >
          Create Super Admin Account
        </button>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link to="/super-admin/login" className="text-blue-500 hover:text-blue-400 font-semibold cursor-pointer">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SuperAdminSignup;
