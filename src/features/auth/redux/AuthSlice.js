/**
 * AuthSlice.js — Redux auth state + async thunks
 *
 * Phase 2 token transport changes:
 *  - Access token is now in `res.data.data.accessToken` (new envelope)
 *  - It is stored in MEMORY via setAccessToken() from axiosInstance.js,
 *    NOT in localStorage (eliminates XSS exposure of tokens)
 *  - User profile data continues to be stored in localStorage for persistence
 *    across page refreshes (non-sensitive: name, role, avatar URL)
 *  - The Axios interceptor silently refreshes the access token on 401
 *    via the httpOnly refresh token cookie, so the user stays logged in
 *    across page refreshes without needing the token in localStorage
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import { clearAccessToken,setAccessToken } from "../../../core/config/tokenStore";
import { destroySocket, initSocket } from "../../../core/config/socket";
import authService from "../../../core/services/auth.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getStoredJson = (key, fallback) => {
  const value = localStorage.getItem(key);
  if (!value || value === "undefined") return fallback;
  try { return JSON.parse(value); } catch { localStorage.removeItem(key); return fallback; }
};
const getStoredBoolean = (key) => localStorage.getItem(key) === "true";

// ── Initial State ──────────────────────────────────────────────────────────────────
const initialState = {
  isLoggedIn: getStoredBoolean("isLoggedIn"),
  data: getStoredJson("data", {}),
  role: localStorage.getItem("role") || "",
  permissions: getStoredJson("permissions", []),
  // authCheckComplete: false until the silent refresh on app mount resolves.
  // RequireAuth waits for this before deciding to render or redirect.
  authCheckComplete: false,
};

// ── Extract user + token from the standard envelope ─────────────────────────
// Shape: { success: true, data: { user, accessToken } }
// All backend auth responses use sendSuccess() which wraps in this shape.
const extractPayload = (responseData) => ({
  user: responseData?.data?.user,
  accessToken: responseData?.data?.accessToken,
});

// ── Shared handler for all successful auth cases ────────────────────────────
const handleAuthSuccess = (state, action) => {
  const { user, accessToken } = extractPayload(action.payload);
  if (!user) return;

  if (accessToken) setAccessToken(accessToken);

  // Non-sensitive profile info persisted for page-refresh recovery
  localStorage.setItem("data", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", user?.role || "");
  localStorage.setItem("permissions", JSON.stringify(user?.permissions || []));

  state.isLoggedIn = true;
  state.data = user;
  state.role = user?.role || "";
  state.permissions = user?.permissions || [];
  state.authCheckComplete = true;

  // Phase 6: connect Socket.IO after every successful auth
  initSocket();
};

// ================= SIGNUP =================
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    let res = authService.register(data);
    toast.promise(res, { loading: "Creating account...", success: (d) => d?.data?.data?.message || "Account created!", error: "Signup failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || error.message); }
});

// ================= LOGIN =================
export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    let res = authService.login(data);
    await toast.promise(res, { loading: "Logging in...", success: "Logged in successfully!", error: "Login failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || error.message); }
});

// ================= GOOGLE AUTH =================
export const googleAuth = createAsyncThunk("auth/googleAuth", async (credential) => {
  try {
    let res = authService.googleAuth(credential);
    await toast.promise(res, { loading: "Authenticating with Google...", success: "Logged in with Google!", error: "Google Authentication failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || error.message); }
});

// ================= OTP FLOW =================
export const sendSignupOtp = createAsyncThunk("auth/sendSignupOtp", async (data) => {
  try {
    let res = authService.otpSignup(data);
    await toast.promise(res, { loading: "Sending OTP...", success: "OTP sent to email", error: "Failed to send OTP" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Error sending OTP"); throw error; }
});

export const verifySignupOtp = createAsyncThunk("auth/verifySignupOtp", async (data) => {
  try {
    let res = authService.verifySignupOtp(data);
    await toast.promise(res, { loading: "Verifying...", success: "Verified successfully", error: "Verification failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Invalid OTP"); throw error; }
});

export const sendLoginOtp = createAsyncThunk("auth/sendLoginOtp", async (data) => {
  try {
    let res = authService.otpLogin(data);
    await toast.promise(res, { loading: "Sending OTP...", success: "OTP sent to email", error: "Failed to send OTP" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Error sending OTP"); throw error; }
});

export const verifyLoginOtp = createAsyncThunk("auth/verifyLoginOtp", async (data) => {
  try {
    let res = authService.verifyLoginOtp(data);
    await toast.promise(res, { loading: "Verifying...", success: "Logged in successfully", error: "Verification failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Invalid OTP"); throw error; }
});

export const adminSendSignupOtp = createAsyncThunk("auth/adminSendSignupOtp", async (data) => {
  try {
    let res = authService.adminOtpSignup(data);
    await toast.promise(res, { loading: "Sending Admin OTP...", success: "Admin OTP sent to email", error: "Failed to send Admin OTP" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Error sending Admin OTP"); throw error; }
});

export const adminVerifySignupOtp = createAsyncThunk("auth/adminVerifySignupOtp", async (data) => {
  try {
    let res = authService.adminVerifySignupOtp(data);
    await toast.promise(res, { loading: "Verifying Admin...", success: "Admin verified successfully", error: "Admin verification failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Invalid OTP"); throw error; }
});

export const adminSendLoginOtp = createAsyncThunk("auth/adminSendLoginOtp", async (data) => {
  try {
    let res = authService.adminOtpLogin(data);
    await toast.promise(res, { loading: "Sending Admin OTP...", success: "Admin OTP sent to email", error: "Failed to send Admin OTP" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Error sending Admin OTP"); throw error; }
});

export const adminVerifyLoginOtp = createAsyncThunk("auth/adminVerifyLoginOtp", async (data) => {
  try {
    let res = authService.adminVerifyLoginOtp(data);
    await toast.promise(res, { loading: "Verifying Admin...", success: "Admin logged in successfully", error: "Admin verification failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Invalid OTP"); throw error; }
});

export const adminPasswordLogin = createAsyncThunk("auth/adminPasswordLogin", async (data) => {
  try {
    let res = authService.adminPasswordLogin(data);
    await toast.promise(res, { loading: "Logging in...", success: "Admin logged in successfully", error: "Login failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Invalid email or password"); throw error; }
});

export const superAdminSignup = createAsyncThunk("auth/superAdminSignup", async (data) => {
  try {
    let res = authService.superAdminSignup(data);
    await toast.promise(res, { loading: "Creating Super Admin...", success: "Super Admin created successfully", error: "Signup failed" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Signup failed"); throw error; }
});

export const resendOtp = createAsyncThunk("auth/resendOtp", async (data) => {
  try {
    let res = authService.resendOtp(data);
    await toast.promise(res, { loading: "Resending OTP...", success: "OTP resent successfully", error: "Failed to resend" });
    return (await res).data;
  } catch (error) { toast.error(error?.response?.data?.error?.message || "Error resending OTP"); throw error; }
});

// ================= LOGOUT =================
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    let res = authService.logout();
    await toast.promise(res, { loading: "Logging out...", success: "Logged out successfully", error: "Logout failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error.message); }
});

// ================= GET USER =================
export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = await authService.getUserData();
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.error?.message); }
});

// ================= UPDATE PROFILE =================
export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
  try {
    let res = authService.updateProfile(data[0], data[1]);
    await toast.promise(res, { loading: "Updating profile...", success: "Profile updated!", error: "Update failed" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.error?.message); }
});

// ================= CHANGE PASSWORD =================
export const changePassword = createAsyncThunk("/auth/changePassword", async (userPassword) => {
  try {
    let res = authService.changePassword(userPassword);
    await toast.promise(res, { loading: "Changing password...", success: "Password changed!", error: "Failed to change password" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.error?.message); }
});

// ================= UPDATE PROGRESS =================
export const updateCourseProgress = createAsyncThunk("/user/progress", async ({ courseId, lectureId }) => {
  try {
    const res = await authService.updateCourseProgress(courseId, lectureId);
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.error?.message); }
});

// ================= SUBMIT QUIZ =================
export const submitQuiz = createAsyncThunk("/user/quiz/submit", async (data) => {
  try {
    let res = authService.submitQuiz(data);
    await toast.promise(res, { loading: "Submitting quiz...", success: "Quiz submitted!", error: "Failed to submit quiz" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.error?.message); }
});

// ================= SUBMIT ASSIGNMENT =================
export const submitAssignment = createAsyncThunk("/user/assignment/submit", async (data) => {
  try {
    let res = authService.submitAssignment(data);
    await toast.promise(res, { loading: "Submitting assignment...", success: "Assignment submitted!", error: "Failed to submit assignment" });
    res = await res;
    return res.data;
  } catch (error) { toast.error(error?.response?.data?.error?.message); }
});

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Called by App.jsx once the silent /auth/refresh attempt resolves
     * (either successfully or with a 401 — both mean the check is done).
     * RequireAuth reads authCheckComplete before deciding to redirect.
     */
    restoreSession: (state, action) => {
      // action.payload: { user, permissions } from the refresh response, or null
      if (action.payload) {
        const { user, permissions } = action.payload;
        state.isLoggedIn = true;
        state.data = user || state.data;
        state.role = user?.role || state.role;
        state.permissions = permissions || [];
      } else {
        // Refresh failed — clear stale localStorage flags
        localStorage.removeItem("data");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("permissions");
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
        state.permissions = [];
      }
      state.authCheckComplete = true;
    },
    // Allows components to manually clear auth (e.g. after reuse-detection event)
    clearAuth: (state) => {
      clearAccessToken();
      localStorage.removeItem("data");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");
      localStorage.removeItem("permissions");
      state.isLoggedIn = false;
      state.data = {};
      state.role = "";
      state.permissions = [];
      state.authCheckComplete = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // All login/verify actions share the same success handler
      .addCase(login.fulfilled, handleAuthSuccess)
      .addCase(googleAuth.fulfilled, handleAuthSuccess)
      .addCase(verifySignupOtp.fulfilled, handleAuthSuccess)
      .addCase(verifyLoginOtp.fulfilled, handleAuthSuccess)
      .addCase(adminVerifySignupOtp.fulfilled, handleAuthSuccess)
      .addCase(adminVerifyLoginOtp.fulfilled, handleAuthSuccess)
      .addCase(adminPasswordLogin.fulfilled, handleAuthSuccess)
      .addCase(createAccount.fulfilled, handleAuthSuccess)
      .addCase(superAdminSignup.fulfilled, (state) => { /* no auto-login on SA signup */ })

      .addCase(logout.fulfilled, (state) => {
        clearAccessToken();
        destroySocket(); // Phase 6: disconnect socket on logout
        localStorage.removeItem("data");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("permissions");
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
        state.permissions = [];
        state.authCheckComplete = true;
      })

      .addCase(getUserData.fulfilled, (state, action) => {
        // /user/me → { success, data: { user } }
        const user = action?.payload?.data?.user;
        if (!user) return;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");
        localStorage.setItem("permissions", JSON.stringify(user?.permissions || []));
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
        state.permissions = user?.permissions || [];
        state.authCheckComplete = true;
      })

      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        const progress = action?.payload?.data?.progress;
        if (!progress) return;
        state.data.progress = progress;
        localStorage.setItem("data", JSON.stringify(state.data));
      })

      .addCase(submitQuiz.fulfilled, (state, action) => {
        const payload = action?.payload?.data;
        if (!payload?.progress) return;
        state.data.progress = payload.progress;
        state.data.weakTopics = payload.weakTopics;
        localStorage.setItem("data", JSON.stringify(state.data));
      })

      .addCase(submitAssignment.fulfilled, (state, action) => {
        const progress = action?.payload?.data?.progress;
        if (!progress) return;
        state.data.progress = progress;
        localStorage.setItem("data", JSON.stringify(state.data));
      });
  },
});

export const { clearAuth, restoreSession } = authSlice.actions;
export default authSlice.reducer;