import { useState } from "react";
import { toast } from "react-hot-toast";

import publicService from "../../../core/services/public.service";
import { isEmail } from "../../../core/config/regexMatcher";
import HomeLayout from "../../../shared/layouts/HomeLayout";

function Contact() {

    const [userInput, setUserInput] = useState({
        name: "",
        email: "",
        message: "",
    });

    function handleInputChange(e) {
        const {name, value} = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    } 

    async function onFormSubmit(e) {
        e.preventDefault();
        if(!userInput.email || !userInput.name || !userInput.message) {
            toast.error("All fields are mandatory");
            return;
        }

        if(!isEmail(userInput.email)) {
            toast.error("Invalid email");
            return;
        }

        try {
            const response = publicService.contactUs(userInput);
            toast.promise(response, {
                loading: "Submitting your message...",
                success: "Form submitted successfully",
                error: "Failed to submit the form"
            });
            const contactResponse = await response;
            console.log(contactResponse)
            if(contactResponse?.data?.success) {
                setUserInput({
                    name: "",
                    email: "",
                    message: "",
                });
            }
        } catch (err) {
            toast.error("operation failed....")
        }

    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center min-h-screen bg-gray-900 pt-16 pb-10 px-4">
                <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-700/50 transition-all duration-300">
                    <form 
                        noValidate
                        onSubmit={onFormSubmit}
                        className="flex flex-col gap-5 text-white">

                        <div className="text-center mb-2">
                            <h1 className="text-3xl font-bold tracking-wide text-yellow-500">Contact Us</h1>
                            <p className="text-gray-300 text-sm mt-2">We'd love to hear from you</p>
                        </div>

                        <div className="flex flex-col w-full gap-1">
                            <label htmlFor="name" className="text-sm font-semibold text-gray-200">
                                Name
                            </label>
                            <input 
                                className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500"
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                onChange={handleInputChange}
                                value={userInput.name}
                            />
                        </div>

                        <div className="flex flex-col w-full gap-1">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-200">
                                Email
                            </label>
                            <input 
                                className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                onChange={handleInputChange}
                                value={userInput.email}
                            />
                        </div>

                        <div className="flex flex-col w-full gap-1">
                            <label htmlFor="message" className="text-sm font-semibold text-gray-200">
                                Message
                            </label>
                            <textarea 
                                className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-600 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-gray-500 resize-none h-32"
                                id="message"
                                name="message"
                                placeholder="Enter your message"
                                onChange={handleInputChange}
                                value={userInput.message}
                            />
                        </div>

                        <button type="submit"
                            className="mt-2 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 transition-all ease-in-out duration-300 rounded-lg py-3 font-bold text-lg text-gray-900 shadow-lg cursor-pointer"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Contact;