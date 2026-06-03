import { useEffect } from "react";
import toast from "react-hot-toast";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from '../../../shared/layouts/HomeLayout';
import { getRazorPayId, purchaseCourseBundle, verifyUserPayment } from "../redux/RazorpaySlice";

function Checkout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const razorpayKey = useSelector((state) => state?.razorpay?.key);
    const subscription_id = useSelector((state) => state?.razorpay?.subscription_id);
    const paymentDetails = {
        razorpay_payment_id: "",
        razorpay_subscription_id: "",
        razorpay_signature: ""
    }

    async function handleSubscription(e) {
        e.preventDefault();
        if(!razorpayKey || !subscription_id) {
            toast.error("Something went wrong");
            return;
        }
        const options = {
            key: razorpayKey,
            subscription_id: subscription_id,
            name: "Coursify Pvt. Ltd.",
            description: "Subscription",
            theme: {
                color: '#F37254'
            },
            
            handler: async function (response) {
                paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
                paymentDetails.razorpay_signature = response.razorpay_signature;
                paymentDetails.razorpay_subscription_id = response.razorpay_subscription_id;

                const res = await dispatch(verifyUserPayment(paymentDetails));
                console.log(res);
                res?.payload?.success ? navigate("/checkout/success") : navigate("/checkout/fail");
            }
        }
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    async function load() {
        await dispatch(getRazorPayId());
        await dispatch(purchaseCourseBundle());
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <HomeLayout>
            <div className="min-h-screen bg-gray-900 pt-20 pb-10 px-4 flex items-center justify-center text-white">
                <form
                    onSubmit={handleSubscription}
                    className="w-full max-w-sm bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden transition-all duration-300"
                >
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-6 text-center text-gray-900">
                        <h1 className="text-2xl font-bold tracking-wide">Subscription Bundle</h1>
                    </div>
                    <div className="p-8 space-y-6 text-center flex flex-col items-center">
                        <p className="text-gray-300 text-sm leading-relaxed">
                            This purchase will allow you to access all available courses on our platform for{" "} 
                            <span className="text-yellow-500 font-bold block mt-1 text-base">
                                1 Year duration
                            </span>
                            <span className="block mt-2 text-xs italic text-gray-400">
                                All existing and newly launched courses will also be available
                            </span>
                        </p>

                        <div className="flex items-center justify-center gap-1 text-4xl font-extrabold text-yellow-500 bg-gray-900/50 py-4 px-8 rounded-xl border border-gray-700/50">
                            <BiRupee /><span>499</span>
                        </div>
                        
                        <div className="text-xs text-gray-400 space-y-1 bg-gray-800/30 w-full py-3 rounded-lg">
                            <p className="flex items-center justify-center gap-2">✅ 100% refund on cancellation</p>
                            <p className="italic">* Terms and conditions apply *</p>
                        </div>
                        
                        <button type="submit" className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 transition-all ease-in-out duration-300 rounded-lg py-3 font-bold text-lg text-gray-900 shadow-lg cursor-pointer mt-4">
                            Buy Now
                        </button>
                    </div>
                </form>
            </div>
        </HomeLayout>
    );
    
}

export default Checkout;