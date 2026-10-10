
import { useState } from "react";

import Home from "./Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

function App() {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (!token || !savedUser) {
            return null;
        }

        try {
            const parsedUser = JSON.parse(savedUser);

            if (!parsedUser || !parsedUser.role) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("employeeId");
                localStorage.removeItem("role");
                localStorage.removeItem("name");

                return null;
            }

            return parsedUser;
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("employeeId");
            localStorage.removeItem("role");
            localStorage.removeItem("name");

            return null;
        }
    });

    const [page, setPage] = useState(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        return token && savedUser ? "dashboard" : "home";
    });

    /* LOGIN */

    const handleLogin = (loginData) => {
        if (!loginData || !loginData.token) {
            return;
        }

        const loggedInUser = {
            employeeId: loginData.employeeId,
            role: loginData.role,
            name: loginData.name,
            email: loginData.email
        };

        localStorage.setItem("token", loginData.token);

        localStorage.setItem(
            "user",
            JSON.stringify(loggedInUser)
        );

        localStorage.setItem(
            "employeeId",
            loginData.employeeId || ""
        );

        localStorage.setItem(
            "role",
            loginData.role || ""
        );

        localStorage.setItem(
            "name",
            loginData.name || ""
        );

        setUser(loggedInUser);
        setPage("dashboard");
    };

    /* LOGOUT */

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("employeeId");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        sessionStorage.clear();

        setUser(null);
        setPage("home");
    };

    /* REGISTRATION SUCCESS */

    const handleRegisterSuccess = () => {
        // User must log in after registration.
        setPage("login");
    };

    /* PUBLIC PAGES */

    if (!user) {
        if (page === "register") {
            return (
                <Register
                    onRegisterSuccess={handleRegisterSuccess}
                    onBackToLogin={() => setPage("login")}
                />
            );
        }

        if (page === "login") {
            return (
                <Login
                    onLogin={handleLogin}
                    onCreateAccount={() => setPage("register")}
                />
            );
        }

        return (
            <Home
                onNavigate={(destination) => {
                    if (
                        destination === "login" ||
                        destination === "register"
                    ) {
                        setPage(destination);
                    }
                }}
            />
        );
    }

    /* MANAGER DASHBOARD */

    if (
        user.role &&
        user.role.toUpperCase() === "MANAGER"
    ) {
        return (
            <ManagerDashboard
                user={user}
                onLogout={handleLogout}
            />
        );
    }

    /* EMPLOYEE DASHBOARD */

    return (
        <EmployeeDashboard
            user={user}
            onLogout={handleLogout}
        />
    );
}

export default App;
