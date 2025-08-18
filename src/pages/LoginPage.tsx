import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginThunk } from "../Redux/Slicers/LoginSlicer";
import { useDispatch, useSelector } from "react-redux";
import type { MyDispatch, RootState } from "../Redux/Store";
import { useRef } from "react";
import type { LoginRequest } from "../Models/LoginModels/LoginRequest";
import {
    Email,
    Lock,
    Login,
    Visibility,
    VisibilityOff,
    Security,
    CheckCircle,
    Error as ErrorIcon,
} from "@mui/icons-material"


export default function LoginPage() 
{
    const navigate = useNavigate();
    const dispatch = useDispatch<MyDispatch>();

    const [showPassword, setShowPassword] = useState(false)

    const isLoading = useSelector((state: RootState) => state.Login.Loading);
    const success = useSelector((state: RootState) => state.Login.IsLoggedin);
    const error = useSelector((state: RootState) => state.Login.Error);

    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const handleLogin = (event: React.FormEvent) => 
    {
          event.preventDefault();

          const Request: LoginRequest = {
            Email: email.current?.value || "",
            Password: password.current?.value || "",
          };

          dispatch(LoginThunk(Request))
            .unwrap()
            .then((result) => 
            {
              const role = localStorage.getItem("Role");
              if (role === "Admin") {
                navigate("/Dashboard");
              } else if (role === "Technician") {
                navigate("/TaskManagement");
              }
            })
            .catch((err) =>
            {
              console.error("Login failed:", err); 
            });
        };


    return (
        <>
        <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          overflow: "hidden",
          width: "100%",
          maxWidth: "450px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "32px 24px",
            textAlign: "center",
            color: "white",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
            }}
          >
            <Security style={{ fontSize: 40, color: "white" }} />
          </div>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Welcome Back
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              opacity: 0.9,
            }}
          >
            Sign in to your account to continue
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "32px 24px" }}>
          {/* Success Message */}
          {success && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "8px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#155724",
              }}
            >
              <CheckCircle style={{ fontSize: 20 }} />
              <span style={{ fontSize: "14px", fontWeight: "medium" }}>{success}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "12px 16px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                border: "1px solid #f5c6cb",
              }}
            >
              <ErrorIcon style={{ marginRight: "8px" }} />
              <strong>{error}</strong>
            </div>
          )}


          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6c757d",
                    zIndex: 1,
                  }}
                >
                  <Email style={{ fontSize: 20 }} />
                </div>
                <input
                  ref={email}
                  type="email"
                  id="Email"
                  name="Email"
                  autoFocus
                  required
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px 12px 12px 44px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "all 0.2s",
                    backgroundColor: isLoading ? "#f8f9fa" : "white",
                    color: isLoading ? "#6c757d" : "#333",
                  }}
                  placeholder="Enter your email address"
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6c757d",
                    zIndex: 1,
                  }}
                >
                  <Lock style={{ fontSize: 20 }} />
                </div>
                <input
                  ref={password}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 44px",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "all 0.2s",
                    backgroundColor: isLoading ? "#f8f9fa" : "white",
                    color: isLoading ? "#6c757d" : "#333",
                  }}
                  placeholder="Enter your password"
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    color: "#6c757d",
                    padding: "4px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPassword ? <VisibilityOff style={{ fontSize: 20 }} /> : <Visibility style={{ fontSize: 20 }} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                background: isLoading
                  ? "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
                boxShadow: isLoading ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-1px)"
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.4)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)"
                }
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Signing In...
                </>
              ) : (
                <>
                  <Login style={{ fontSize: 20 }} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #e9ecef",
                  borderTop: "4px solid #667eea",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <div
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  fontWeight: "medium",
                }}
              >
                Authenticating...
              </div>
            </div>
          </div>
        )}
      </div>

      
    </div>
        </>
    );
}