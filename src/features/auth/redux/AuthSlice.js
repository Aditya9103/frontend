import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../../core/services/auth.service";
import { toast } from "react-hot-toast";

// ================= helpers =================
const getStoredJson = (key, fallback) => {
  const value = localStorage.getItem(key);
  if (!value || value === "undefined") return fallback;
  try { return JSON.parse(value); } catch { localStorage.removeItem(key); return fallback; }
};
const getStoredBoolean = (key) => localStorage.getItem(key) === "true";

// ================= initial state =================
const initialState = {
  isLoggedIn: getStoredBoolean("isLoggedIn"),
  data: getStoredJson("data", {}),
  role: localStorage.getItem("role") || "",
};

// ================= SIGNUP =================
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    let res = authService.register(data);
    toast.promise(res, { loading: "Creating account...", success: (data) => data?.data?.message, error: "Signup failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.message); }
});

// ================= LOGIN (COOKIE BASED) =================
export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    let res = authService.login(data);
    await toast.promise(res, { loading: "Logging in...", success: (data) => data?.data?.message, error: "Login failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.message || error.message); }
});

// ================= GOOGLE AUTH =================
export const googleAuth = createAsyncThunk("auth/googleAuth", async (credential) => {
  try {
    let res = authService.googleAuth(credential);
    await toast.promise(res, { loading: "Authenticating with Google...", success: (data) => data?.data?.message, error: "Google Authentication failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.message || error.message); }
});

// ================= OTP FLOW =================
export const sendSignupOtp = createAsyncThunk("auth/sendSignupOtp", async (data) => {
  try {
    let res = authService.otpSignup(data);
    await toast.promise(res, { loading: "Sending OTP...", success: "OTP sent to email", error: "Failed to send OTP" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Error sending OTP"); throw error; }
});

export const verifySignupOtp = createAsyncThunk("auth/verifySignupOtp", async (data) => {
  try {
    let res = authService.verifySignupOtp(data);
    await toast.promise(res, { loading: "Verifying...", success: "Verified successfully", error: "Verification failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Invalid OTP"); throw error; }
});

export const sendLoginOtp = createAsyncThunk("auth/sendLoginOtp", async (data) => {
  try {
    let res = authService.otpLogin(data);
    await toast.promise(res, { loading: "Sending OTP...", success: "OTP sent to email", error: "Failed to send OTP" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Error sending OTP"); throw error; }
});

export const verifyLoginOtp = createAsyncThunk("auth/verifyLoginOtp", async (data) => {
  try {
    let res = authService.verifyLoginOtp(data);
    await toast.promise(res, { loading: "Verifying...", success: "Logged in successfully", error: "Verification failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Invalid OTP"); throw error; }
});

export const adminSendSignupOtp = createAsyncThunk("auth/adminSendSignupOtp", async (data) => {
  try {
    let res = authService.adminOtpSignup(data);
    await toast.promise(res, { loading: "Sending Admin OTP...", success: "Admin OTP sent to email", error: "Failed to send Admin OTP" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Error sending Admin OTP"); throw error; }
});

export const adminVerifySignupOtp = createAsyncThunk("auth/adminVerifySignupOtp", async (data) => {
  try {
    let res = authService.adminVerifySignupOtp(data);
    await toast.promise(res, { loading: "Verifying Admin...", success: "Admin verified successfully", error: "Admin verification failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Invalid OTP"); throw error; }
});

export const adminSendLoginOtp = createAsyncThunk("auth/adminSendLoginOtp", async (data) => {
  try {
    let res = authService.adminOtpLogin(data);
    await toast.promise(res, { loading: "Sending Admin OTP...", success: "Admin OTP sent to email", error: "Failed to send Admin OTP" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Error sending Admin OTP"); throw error; }
});

export const adminVerifyLoginOtp = createAsyncThunk("auth/adminVerifyLoginOtp", async (data) => {
  try {
    let res = authService.adminVerifyLoginOtp(data);
    await toast.promise(res, { loading: "Verifying Admin...", success: "Admin logged in successfully", error: "Admin verification failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Invalid OTP"); throw error; }
});

export const adminPasswordLogin = createAsyncThunk("auth/adminPasswordLogin", async (data) => {
  try {
    let res = authService.adminPasswordLogin(data);
    await toast.promise(res, { loading: "Logging in...", success: "Admin logged in successfully", error: "Login failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Invalid email or password"); throw error; }
});

export const superAdminSignup = createAsyncThunk("auth/superAdminSignup", async (data) => {
  try {
    let res = authService.superAdminSignup(data);
    await toast.promise(res, { loading: "Creating Super Admin...", success: "Super Admin created successfully", error: "Signup failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Signup failed"); throw error; }
});

export const resendOtp = createAsyncThunk("auth/resendOtp", async (data) => {
  try {
    let res = authService.resendOtp(data);
    await toast.promise(res, { loading: "Resending OTP...", success: "OTP resent successfully", error: "Failed to resend" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.message || "Error resending OTP"); throw error; }
});

// ================= LOGOUT =================
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    let res = authService.logout();
    await toast.promise(res, { loading: "Logging out...", success: (data) => data?.data?.message, error: "Logout failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error.message); }
});

// ================= GET USER =================
export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = await authService.getUserData();
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.message); }
});

// ================= UPDATE PROFILE =================
export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
  try {
    let res = authService.updateProfile(data[0], data[1]);
    await toast.promise(res, { loading: "Updating profile...", success: (d) => d?.data?.message, error: "Update failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.message); }
});

// ================= CHANGE PASSWORD =================
export const changePassword = createAsyncThunk("/auth/changePassword", async (userPassword) => {
  try {
    let res = authService.changePassword(userPassword);
    await toast.promise(res, { loading: "Changing password...", success: (data) => data?.data?.message, error: "Failed to change password" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.message); }
});

// ================= UPDATE PROGRESS =================
export const updateCourseProgress = createAsyncThunk("/user/progress", async ({ courseId, lectureId }) => {
  try {
    const res = await authService.updateCourseProgress(courseId, lectureId);
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.message); }
});

// ================= SUBMIT QUIZ =================
export const submitQuiz = createAsyncThunk("/user/quiz/submit", async (data) => {
  try {
    let res = authService.submitQuiz(data);
    await toast.promise(res, { loading: "Submitting quiz...", success: (data) => data?.data?.message, error: "Failed to submit quiz" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.message); }
});

// ================= SUBMIT ASSIGNMENT =================
export const submitAssignment = createAsyncThunk("/user/assignment/submit", async (data) => {
  try {
    let res = authService.submitAssignment(data);
    await toast.promise(res, { loading: "Submitting assignment...", success: (data) => data?.data?.message, error: "Failed to submit assignment" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.message); }
});

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })
      .addCase(verifySignupOtp.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })
      .addCase(adminVerifySignupOtp.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })
      .addCase(adminVerifyLoginOtp.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })
      .addCase(adminPasswordLogin.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })
      .addCase(superAdminSignup.fulfilled, (state, action) => {})
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("data");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        if (!action?.payload?.success) return;
        state.data.progress = action.payload.progress;
        localStorage.setItem("data", JSON.stringify(state.data));
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        if (!action?.payload?.success) return;
        state.data.progress = action.payload.progress;
        state.data.weakTopics = action.payload.weakTopics;
        localStorage.setItem("data", JSON.stringify(state.data));
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        if (!action?.payload?.success) return;
        state.data.progress = action.payload.progress;
        localStorage.setItem("data", JSON.stringify(state.data));
      });
  },
});

export default authSlice.reducer;