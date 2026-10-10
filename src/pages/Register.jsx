import { useState } from "react";
import api from "../api";

function Register({
    onRegisterSuccess,
    onBackToLogin
}) {

    const [role, setRole] = useState("EMPLOYEE");


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        department: "",
        designation: ""
    });


    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value
        });

        setError("");
    };


    /* =====================================================
       SELECT ROLE
    ===================================================== */

    const selectRole = (selectedRole) => {

        setRole(selectedRole);

        setError("");
    };


    /* =====================================================
       SUBMIT REGISTRATION
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess("");


        /* -------------------------
           VALIDATION
        ------------------------- */

        if (!formData.name.trim()) {

            setError(
                "Full name is required"
            );

            return;
        }


        if (!formData.email.trim()) {

            setError(
                "Email is required"
            );

            return;
        }


        if (!formData.password) {

            setError(
                "Password is required"
            );

            return;
        }


        if (!formData.department.trim()) {

            setError(
                "Department is required"
            );

            return;
        }


        if (!formData.designation.trim()) {

            setError(
                "Designation is required"
            );

            return;
        }


        if (!role) {

            setError(
                "Role is required"
            );

            return;
        }


        /* -------------------------
           API REQUEST
        ------------------------- */

        try {

            setLoading(true);


            const requestData = {

                name:
                    formData.name.trim(),

                email:
                    formData.email.trim(),

                password:
                    formData.password,

                department:
                    formData.department.trim(),

                designation:
                    formData.designation.trim(),

                role:
                    role
            };


            console.log(
                "REGISTER REQUEST:",
                requestData
            );


            const response =
                await api.post(
                    "/auth/register",
                    requestData
                );


            console.log(
                "REGISTER RESPONSE:",
                response.data
            );


            /* -------------------------
               SUCCESS
            ------------------------- */

            setSuccess(
                "Account created successfully! Please sign in."
            );


            setFormData({
                name: "",
                email: "",
                password: "",
                department: "",
                designation: ""
            });


            if (onRegisterSuccess) {

                onRegisterSuccess(
                    response.data
                );
            }


        } catch (err) {

            console.error(
                "REGISTRATION ERROR:",
                err
            );


            if (err.response) {

                console.error(
                    "BACKEND RESPONSE:",
                    err.response.data
                );


                if (
                    typeof err.response.data ===
                    "string"
                ) {

                    setError(
                        err.response.data
                    );

                } else {

                    setError(
                        err.response.data?.message ||
                        "Registration failed"
                    );
                }

            } else {

                setError(
                    "Cannot connect to backend. Make sure Spring Boot is running."
                );
            }


        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       UI
    ===================================================== */

    return (

        <div className="auth-page">


            {/* =================================================
               LEFT BRANDING
            ================================================= */}

            <div className="auth-left">

                <div className="brand">


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


                    <h2>
                        Manage your leave
                        <br />
                        easily.
                    </h2>


                    <p>
                        A simple and efficient
                        employee leave management
                        system.
                    </p>

                </div>

            </div>


            {/* =================================================
               RIGHT REGISTER
            ================================================= */}

            <div className="auth-right">

                <div className="auth-card">


                    {/* HEADER */}

                    <h1>
                        Create Account
                    </h1>


                    <p className="auth-subtitle">
                        Register your WorkLeave account
                    </p>


                    {/* =================================================
                       ROLE
                    ================================================= */}

                    <div className="role-selection">


                        <button
                            type="button"
                            className={
                                role === "EMPLOYEE"
                                    ? "role-button active"
                                    : "role-button"
                            }
                            onClick={() =>
                                selectRole("EMPLOYEE")
                            }
                        >
                            Employee
                        </button>


                        <button
                            type="button"
                            className={
                                role === "MANAGER"
                                    ? "role-button active"
                                    : "role-button"
                            }
                            onClick={() =>
                                selectRole("MANAGER")
                            }
                        >
                            Manager
                        </button>

                    </div>


                    {/* =================================================
                       FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                    >


                        {/* FULL NAME */}

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />

                        </div>


                        {/* DEPARTMENT */}

                        <div className="form-group">

                            <label>
                                Department
                            </label>

                            <input
                                type="text"
                                name="department"
                                placeholder="Example: AI"
                                value={formData.department}
                                onChange={handleChange}
                            />

                        </div>


                        {/* DESIGNATION */}

                        <div className="form-group">

                            <label>
                                Designation
                            </label>

                            <input
                                type="text"
                                name="designation"
                                placeholder="Example: AI Engineer"
                                value={formData.designation}
                                onChange={handleChange}
                            />

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="error-message">

                                {error}

                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div className="success-message">

                                {success}

                            </div>

                        )}


                        {/* CREATE ACCOUNT */}

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"
                            }

                        </button>

                    </form>


                    {/* =================================================
                       BACK TO LOGIN
                    ================================================= */}

                    <div className="auth-footer">

                        <span>
                            Already have an account?
                        </span>


                        <button
                            type="button"
                            className="link-button"
                            onClick={
                                onBackToLogin
                            }
                        >
                            Sign In
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;