import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import HomeLayout from '../../Layouts/HomeLayout';
import { changePassword } from '../../Redux/Slices/AuthSlice';

function ChangePassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userPassword, setUserPassword] = useState({
        oldPassword: "",
        newPassword: "",
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setUserPassword({
            ...userPassword,
            [name]: value,
        });
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        if (!userPassword.oldPassword || !userPassword.newPassword) {
            toast.error("All fields are mandatory");
            return;
        }

        if (userPassword.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        const res = await dispatch(changePassword(userPassword));
        if (res?.payload?.success) {
            navigate('/user/profile');
        }

        setUserPassword({
            oldPassword: "",
            newPassword: "",
        });
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-80 h-[26rem] shadow-[0_0_10px_black]"
                >
                    <h1 className="text-center text-2xl font-bold">Change Password</h1>

                    <div className="flex flex-col gap-1">
                        <label className="text-lg font-semibold" htmlFor="oldPassword">
                            Old Password
                        </label>
                        <input
                            required
                            type="password"
                            name="oldPassword"
                            id="oldPassword"
                            placeholder="Enter your old password"
                            className="bg-transparent px-2 py-1 border"
                            value={userPassword.oldPassword}
                            onChange={handleUserInput}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-lg font-semibold" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            required
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            placeholder="Enter your new password"
                            className="bg-transparent px-2 py-1 border"
                            value={userPassword.newPassword}
                            onChange={handleUserInput}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
                    >
                        Change Password
                    </button>

                    <Link to="/user/profile">
                        <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                            <AiOutlineArrowLeft /> Go back to profile
                        </p>
                    </Link>
                </form>
            </div>
        </HomeLayout>
    );
}

export default ChangePassword;
