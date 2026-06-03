import axios from "axios";
import { toast } from "react-hot-toast";

// STEP 1: Smart Environment Detection
// We check if the website is running on your local computer ('localhost') or on the internet.
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// STEP 2: Setting the API Address
// If we are local, we talk to our local server (port 5001). 
// If we are on the internet, we talk to the production server on Render.
const BASE_URL = isLocal 
    ? "http://localhost:5001/api/v1" 
    : (import.meta.env.VITE_API_BASE_URL || "https://learnify-backendrender.onrender.com/api/v1");

// STEP 3: Creating the 'Connection Bridge' (Axios Instance)
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // This allows us to send 'cookies' for staying logged in
  timeout: 40000,        // We wait up to 40 seconds for a response before giving up
});

// STEP 4: Global 'Safety Net' (Interceptors)
// This code watches every single piece of data coming back from the server.
axiosInstance.interceptors.response.use(
    (response) => response, // If everything is fine, just pass the data through
    (error) => {
        const { response } = error;

        // If there is no response at all (Server is dead or No Internet)
        if (!response) {
            toast.error("Network issue. Please check your internet connection.");
            return Promise.reject(error);
        }

        const status = response.status;

        // Case: Session Expired (Error 401)
        // If the server says "I don't know who you are anymore", we send you to the login page.
        if (status === 401) {
            if (!window.location.pathname.includes('/login')) {
                toast.error("Session expired. Please log in again.");
                localStorage.clear(); // Clear all saved user data
                window.location.href = '/login';
            }
        } 
        // Case: No Permission (Error 403)
        else if (status === 403) {
            toast.error("Access denied. You don't have permission for this.");
        } 
        // Case: Server Crash (Error 500+)
        else if (status >= 500) {
            toast.error("The server hit a snag. Our team is looking into it.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;