import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../../Helpers/axiosInstance";
import { toast } from "react-hot-toast";

// ================= helpers =================
const getStoredJson = (key, fallback) => {
  const value = localStorage.getItem(key);
  if (!value || value === "undefined") return fallback;

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
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
    let res = axiosInstance.post("/user/register", data);

    toast.promise(res, {
      loading: "Creating account...",
      success: (data) => data?.data?.message,
      error: "Signup failed",
    });

    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// ================= LOGIN (COOKIE BASED) =================
export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    let res = axiosInstance.post("/user/login", data);

    await toast.promise(res, {
      loading: "Logging in...",
      success: (data) => data?.data?.message,
      error: "Login failed",
    });

    res = await res;

    console.log("LOGIN RESPONSE:", res.data);

    // ❌ NO TOKEN STORAGE (cookies handle auth)
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  }
});

// ================= LOGOUT =================
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    let res = axiosInstance.post("/user/logout");

    await toast.promise(res, {
      loading: "Logging out...",
      success: (data) => data?.data?.message,
      error: "Logout failed",
    });

    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error.message);
  }
});

// ================= GET USER =================
export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = await axiosInstance.get("/user/me");
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

// ================= UPDATE PROFILE =================
export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    try {
      let res = axiosInstance.put(
        `/user/update/${data[0]}`,
        data[1]
      );

      await toast.promise(res, {
        loading: "Updating profile...",
        success: (data) => data?.data?.message,
        error: "Update failed",
      });

      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// ================= CHANGE PASSWORD =================
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword) => {
    try {
      let res = axiosInstance.post("/user/change-password", userPassword);

      await toast.promise(res, {
        loading: "Changing password...",
        success: (data) => data?.data?.message,
        error: "Failed to change password",
      });

      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// ================= SLICE =================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // LOGIN
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

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem("data");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("role");

        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })

      // USER DATA
      .addCase(getUserData.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (!user) return;

        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");

        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      });
  },
});

export default authSlice.reducer;