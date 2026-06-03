import { useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../../../shared/layouts/HomeLayout";
import { getUserData } from "../../auth/redux/AuthSlice";

function CheckoutSuccess() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserData());
    })

    return (
        <HomeLayout>
            <div className="min-h-screen bg-gray-900 pt-20 pb-10 px-4 flex items-center justify-center text-white">
                <div className="w-full max-w-sm bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-green-500/30 overflow-hidden transition-all duration-300">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 py-6 text-center text-white shadow-md">
                        <h1 className="text-2xl font-bold tracking-wide">Payment Successful</h1>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center space-y-6 text-center">
                        <div className="bg-green-500/10 p-4 rounded-full">
                            <AiFillCheckCircle className="text-green-500 text-6xl drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                        </div>
                        
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-100">
                                Welcome to the Pro Bundle
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Your payment has been verified. You now have full access to all premium courses and features.
                            </p>
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <Link to="/" className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 transition-all ease-in-out duration-300 rounded-lg py-3 font-bold text-lg text-white shadow-lg text-center">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default CheckoutSuccess;