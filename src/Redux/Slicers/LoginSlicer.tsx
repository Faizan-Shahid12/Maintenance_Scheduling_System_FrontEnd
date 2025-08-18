import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { type LoginResponse } from "../../Models/LoginModels/LoginResponse";
import { type LoginRequest } from "../../Models/LoginModels/LoginRequest";
import api from "../../settings/axios";

interface LoginState
 {
    user: LoginResponse | null;
    isAuthenticated: boolean;
    IsLoggedin: boolean;
    Loading: boolean;
    AuthLoading: boolean;
    Error: string | undefined
}

const initialState: LoginState = {
    user: null,
    isAuthenticated: false,
    IsLoggedin: false,
    Loading: false,
    AuthLoading: true,
    Error: "",
};

export const CheckEmail = createAsyncThunk<boolean,string>(
    "Register/CheckEmail",
    async (Email,ThunkApi) =>
    {
        try
        {
            const encodedEmail = encodeURIComponent(Email);
            const response = await api.get<boolean>("/Authentication/CheckEmail?email=" + encodedEmail)
            return response.data;
        }
        catch (error : any)
        {
            return ThunkApi.rejectWithValue(error);
        }
    }
)

export const LoginThunk = createAsyncThunk<LoginResponse, LoginRequest>(
    "login/User",
    async (Request,ThunkAPI) => 
    {
        try
        {
            const response = await api.post<LoginResponse>("/Authentication/Login", Request);
            return response.data;
        }
        catch (error : any)
        {
            return ThunkAPI.rejectWithValue("Login Failed");
        }
    }

);

export const RefreshTokenThunk = createAsyncThunk<LoginResponse,string>(
    "login/RefreshToken",
    async (RefreshToken,ThunkApi) => 
    {
        const expiry = localStorage.getItem("Expiry");
        if (expiry) 
        {
            const expiryDate = new Date(expiry);
            const timeLeft = expiryDate.getTime() - Date.now();

            if (timeLeft <= 60 * 1000) 
            { 

                if (RefreshToken) {
                    const response = await api.post<LoginResponse>(
                        "/Authentication/RefreshToken?Token=" + encodeURIComponent(RefreshToken)
                    );
                    return response.data;
                }
            }
        }

        return ThunkApi.rejectWithValue("RefreshToken Expired");

    }
);

export const setAuthFromToken = createAsyncThunk<boolean>(
  "auth/setAuthFromToken",
  async () => {
    const expiry = localStorage.getItem("Expiry")
    const token = localStorage.getItem("AccessToken")

    if (expiry && token) {
      const expiryTime = new Date(expiry).getTime()
      const now = Date.now()

      if (expiryTime > now) {
        return true 
      } else {
        localStorage.clear()
        return false
      }
    }
    return false
  }
)

const LoginSlice = createSlice({
    name: "Login",
    initialState,
    reducers: {
        setLogout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.IsLoggedin = false;
            localStorage.clear();
            window.location.href = "/login"; 
        },
    },
    extraReducers: (builder) => 
    {
        builder.addCase(LoginThunk.pending, (state) =>
        {
            state.Loading = true;
        })
        .addCase(LoginThunk.fulfilled, (state, action) => 
        {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.IsLoggedin = true;
            let expiryDate = new Date(action.payload.accessTokenExpiry);

            localStorage.setItem("AccessToken", action.payload.token);
            localStorage.setItem("Expiry", expiryDate.toISOString());
            localStorage.setItem("RefreshToken", action.payload.refreshToken);
            localStorage.setItem("Role", action.payload.roles[0]);
            localStorage.setItem("userId", action.payload.userId);
            localStorage.setItem("Name", action.payload.name);
            state.Loading = false;
        })
        .addCase(LoginThunk.rejected, (state, action) => 
        {
            state.Loading = false;
            state.isAuthenticated = false;
            state.IsLoggedin = false;
            state.user = null;
            state.Error = "Login Failed"
        })
        .addCase(RefreshTokenThunk.fulfilled, (state, action) => 
        {
            state.user = action.payload;
            let expiryDate = new Date(action.payload.accessTokenExpiry);

            localStorage.setItem("AccessToken", action.payload.token);
            localStorage.setItem("Expiry", expiryDate.toISOString());
            localStorage.setItem("RefreshToken", action.payload.refreshToken);
            localStorage.setItem("Role", action.payload.roles[0]);
            localStorage.setItem("userId", action.payload.userId);
            localStorage.setItem("Name", action.payload.name);

        })
        .addCase(RefreshTokenThunk.rejected, (state, action) => 
        {
            state.user = null;
            state.isAuthenticated = false;
            state.IsLoggedin = false;
            state.Error = action.error.message;
            console.error("Refresh token failed", action.error.message);
        });
    
    builder.addCase(setAuthFromToken.pending,(state) => 
    {
        state.AuthLoading = true;
    })
    .addCase(setAuthFromToken.fulfilled,(state,action) => 
    {
        state.isAuthenticated = action.payload;
        state.IsLoggedin = action.payload;
        state.AuthLoading = false;
    })
    .addCase(setAuthFromToken.rejected, (state, action) =>
    {
        state.AuthLoading = false;
        state.Error = action.error.message;
    })
     
    }
});

export const { setLogout } = LoginSlice.actions;
export default LoginSlice.reducer;