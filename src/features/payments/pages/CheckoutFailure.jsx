import { RxCrossCircled } from "react-icons/rx";
import { Link } from "react-router-dom";

import HomeLayout from "../../../shared/layouts/HomeLayout";

function CheckoutFailure() {
    return (
        <HomeLayout>
            <div className="min-h-screen bg-gray-900 pt-20 pb-10 px-4 flex items-center justify-center text-white">
                <div className="w-full max-w-sm bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-red-500/30 overflow-hidden transition-all duration-300">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 py-6 text-center text-white shadow-md">
                        <h1 className="text-2xl font-bold tracking-wide">Payment Failed</h1>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center space-y-6 text-center">
                        <div className="bg-red-500/10 p-4 rounded-full">
                            <RxCrossCircled className="text-red-500 text-6xl drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                        </div>
                        
                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-gray-100">
                                Oops! Your payment failed
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                We couldn't process your payment. Please try again or use a different payment method.
                            </p>
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <Link to="/checkout" className="block w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 transition-all ease-in-out duration-300 rounded-lg py-3 font-bold text-lg text-white shadow-lg text-center">
                            Try Again
                        </Link>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default CheckoutFailure;