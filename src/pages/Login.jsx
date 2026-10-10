import { useState } from "react";
import api from "../api";

function Login({ onLogin, onCreateAccount }) {

    const [role, setRole] = useState("EMPLOYEE");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        try {

            setLoading(true);

            console.log("LOGIN REQUEST:", {
                email,
                role
            });

            const response = await api.post("/auth/login", {
                email: email.trim(),
                password: password,
                role: role
            });

            console.log("LOGIN RESPONSE:", response.data);

            if (!response.data?.token) {
                setError("Login failed. Invalid server response.");
                return;
            }

            if (
                response.data.role &&
                response.data.role.toUpperCase() !== role
            ) {
                setError(
                    `This account is registered as ${response.data.role}.`
                );
                return;
            }

            onLogin(response.data);

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            if (error.response?.data) {

                if (typeof error.response.data === "string") {
                    setError(error.response.data);
                } else {
                    setError(
                        error.response.data.message ||
                        "Invalid email or password."
                    );
                }

            } else {

                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="login-page">

            {/* =========================================
                LEFT BRANDING
            ========================================= */}

            <div className="login-left">

                <div className="brand-section">

                    <div className="brand-logo">
                        W
                    </div>

                    <div className="brand-name">
                        WorkLeave
                    </div>

                    <div className="brand-subtitle">
                        Employee Leave Management System
                    </div>

                    <div className="brand-line"></div>

                    <h1>
                        Manage your work life
                        <br />
                        <span>with ease.</span>
                    </h1>

                    <p className="brand-description">
                        Manage employee leave requests, leave balances,
                        approvals and employee information from one
                        secure platform.
                    </p>

                    <div className="features">

                        <div className="feature">
                            <div className="feature-check">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Easy Leave Management
                                </strong>

                                <span>
                                    Apply and track leave requests easily.
                                </span>
                            </div>
                        </div>


                        <div className="feature">
                            <div className="feature-check">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Real-time Leave Balance
                                </strong>

                                <span>
                                    View your available leave at any time.
                                </span>
                            </div>
                        </div>


                        <div className="feature">
                            <div className="feature-check">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Simple Approval Workflow
                                </strong>

                                <span>
                                    Managers can review and approve requests.
                                </span>
                            </div>
                        </div>

                    </div>

                </div>


                <div className="left-footer">
                    © 2026 WorkLeave. All rights reserved.
                </div>

            </div>


            {/* =========================================
                RIGHT LOGIN
            ========================================= */}

            <div className="login-right">

                <div className="login-card">

                    {/* Header */}

                    <div className="login-header">

                        <div className="welcome">
                            WELCOME BACK
                        </div>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Enter your credentials to access your dashboard.
                        </p>

                    </div>


                    {/* Role */}

                    <div className="role-section">

                        <label>
                            Sign in as
                        </label>

                        <div className="role-container">

                            <button
                                type="button"
                                className={
                                    role === "EMPLOYEE"
                                        ? "role-card selected"
                                        : "role-card"
                                }
                                onClick={() => {
                                    setRole("EMPLOYEE");
                                    setError("");
                                }}
                            >

                                <div className="role-icon">
                                    👤
                                </div>

                                <div className="role-info">

                                    <strong>
                                        Employee
                                    </strong>

                                    <span>
                                        Employee portal
                                    </span>

                                </div>

                            </button>


                            <button
                                type="button"
                                className={
                                    role === "MANAGER"
                                        ? "role-card selected"
                                        : "role-card"
                                }
                                onClick={() => {
                                    setRole("MANAGER");
                                    setError("");
                                }}
                            >

                                <div className="role-icon">
                                    💼
                                </div>

                                <div className="role-info">

                                    <strong>
                                        Manager
                                    </strong>

                                    <span>
                                        Management portal
                                    </span>

                                </div>

                            </button>

                        </div>

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="login-error">

                            <span className="error-icon">
                                !
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* Form */}

                    <form
                        className="login-form"
                        onSubmit={handleLogin}
                    >

                        {/* Email */}

                        <div className="form-field">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="input-box">

                                <span className="input-symbol">
                                    @
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div className="form-field">

                            <div className="password-heading">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="forgot-button"
                                    onClick={() => {
                                        setError(
                                            "Please contact your administrator to reset your password."
                                        );
                                    }}
                                >
                                    Forgot password?
                                </button>

                            </div>


                            <div className="input-box">

                                <span className="input-symbol">
                                    ●
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="show-button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* Remember */}

                        <div className="remember-row">

                            <label>

                                <input
                                    type="checkbox"
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>

                        </div>


                        {/* Sign in */}

                        <button
                            type="submit"
                            className="signin-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <span className="signin-arrow">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* Register */}

                    <div className="register-section">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={onCreateAccount}
                        >
                            Create an account
                        </button>

                    </div>


                    {/* Security */}

                    <div className="security-message">

                        <span>
                            🔒
                        </span>

                        <span>
                            Your information is securely protected
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;