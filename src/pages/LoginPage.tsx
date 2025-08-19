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
    Login as LoginIcon,
    Visibility,
    VisibilityOff,
    Security,
    CheckCircle,
    Error as ErrorIcon,
} from "@mui/icons-material";
import {
    Container,
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";

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
            .then(() => 
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
        <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Paper elevation={4} sx={{ width: '100%', borderRadius: 3, overflow: 'hidden' }}>
                {/* Header */}
                <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 4, textAlign: 'center' }}>
                    <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Security sx={{ fontSize: 36 }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Welcome Back</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Sign in to your account to continue</Typography>
                </Box>

                {/* Body */}
                <Box component="form" onSubmit={handleLogin} sx={{ p: 4 }}>
                    {success && (
                        <Alert icon={<CheckCircle fontSize="inherit" />} severity="success" sx={{ mb: 2 }}>
                            Signed in successfully
                        </Alert>
                    )}
                    {error && (
                        <Alert icon={<ErrorIcon fontSize="inherit" />} severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        inputRef={email}
                        type="email"
                        id="Email"
                        name="Email"
                        autoFocus
                        required
                        disabled={isLoading}
                        label="Email Address"
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        inputRef={password}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        disabled={isLoading}
                        label="Password"
                        fullWidth
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" disabled={isLoading}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        fullWidth
                        sx={{ mt: 2, py: 1.2, fontWeight: 700 }}
                        startIcon={!isLoading ? <LoginIcon /> : undefined}
                    >
                        {isLoading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </Box>

                {isLoading && (
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                )}
            </Paper>
        </Container>
    );
}