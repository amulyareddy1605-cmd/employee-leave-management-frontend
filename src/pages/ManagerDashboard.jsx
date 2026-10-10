import { useEffect, useState } from "react";
import api from "../api";

import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";

function ManagerDashboard({ user, onLogout }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const [activePage, setActivePage] = useState("dashboard");

    const [employees, setEmployees] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================
       MENU
    ========================================= */

    const openMenu = () => {
        setMenuOpen(true);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const navigate = (page) => {
        setActivePage(page);
    };


    /* =========================================
       LOAD DASHBOARD DATA
    ========================================= */

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [employeeResponse, requestResponse] =
                await Promise.all([
                    api.get("/employee"),
                    api.get("/leave/pending")
                ]);

            setEmployees(
                Array.isArray(employeeResponse.data)
                    ? employeeResponse.data
                    : []
            );

            setPendingRequests(
                Array.isArray(requestResponse.data)
                    ? requestResponse.data
                    : []
            );

        } catch (error) {

            console.error(
                "MANAGER DASHBOARD ERROR:",
                error
            );

            setError(
                "Unable to load dashboard information."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadDashboard();

    }, []);


    /* =========================================
       APPROVE REQUEST
    ========================================= */

    const approveRequest = async (id) => {

        try {

            await api.put(
                `/leave/${id}/approve`,
                null,
                {
                    params: {
                        comment:
                            "Approved by manager"
                    }
                }
            );

            await loadDashboard();

        } catch (error) {

            console.error(
                "APPROVE ERROR:",
                error
            );

            setError(
                "Unable to approve the leave request."
            );
        }
    };


    /* =========================================
       REJECT REQUEST
    ========================================= */

    const rejectRequest = async (id) => {

        try {

            await api.put(
                `/leave/${id}/reject`,
                null,
                {
                    params: {
                        comment:
                            "Rejected by manager"
                    }
                }
            );

            await loadDashboard();

        } catch (error) {

            console.error(
                "REJECT ERROR:",
                error
            );

            setError(
                "Unable to reject the leave request."
            );
        }
    };


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {

        return (
            <div className="dashboard-layout">

                <Sidebar
                    isOpen={menuOpen}
                    onOpen={openMenu}
                    onClose={closeMenu}
                    role={user?.role}
                    activePage={activePage}
                    onNavigate={navigate}
                    onLogout={onLogout}
                />

                <main className="main-content">

                    <Loading
                        text="Loading manager dashboard..."
                    />

                </main>

            </div>
        );
    }


    /* =========================================
       DASHBOARD
    ========================================= */

    const dashboardPage = (

        <>

            <div className="dashboard-heading">

                <div>

                    <div className="page-eyebrow">
                        MANAGEMENT OVERVIEW
                    </div>

                    <h2>
                        Manager Dashboard
                    </h2>

                    <p>
                        Monitor employees and manage leave
                        requests from one place.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate("requests")
                    }
                >
                    Review Requests
                    <span className="button-arrow">
                        →
                    </span>
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* STAT CARDS */}

            <div className="stats-grid manager-stats">

                <div className="stat-card">

                    <div className="stat-icon blue">
                        👥
                    </div>

                    <div className="stat-content">

                        <span>
                            Total Employees
                        </span>

                        <strong>
                            {employees.length}
                        </strong>

                        <small>
                            Registered employees
                        </small>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon orange">
                        ◷
                    </div>

                    <div className="stat-content">

                        <span>
                            Pending Requests
                        </span>

                        <strong>
                            {pendingRequests.length}
                        </strong>

                        <small>
                            Need your attention
                        </small>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon green">
                        ✓
                    </div>

                    <div className="stat-content">

                        <span>
                            System Status
                        </span>

                        <strong className="status-text">
                            Active
                        </strong>

                        <small>
                            Leave system running
                        </small>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon purple">
                        ▤
                    </div>

                    <div className="stat-content">

                        <span>
                            Management
                        </span>

                        <strong className="status-text">
                            Ready
                        </strong>

                        <small>
                            Review requests
                        </small>

                    </div>

                </div>

            </div>


            {/* TWO COLUMNS */}

            <div className="two-column-grid">


                {/* PENDING REQUESTS */}

                <section className="panel">

                    <div className="panel-header">

                        <div>

                            <h3>
                                Pending Leave Requests
                            </h3>

                            <p>
                                Requests waiting for approval
                            </p>

                        </div>

                        <button
                            className="text-button"
                            onClick={() =>
                                navigate("requests")
                            }
                        >
                            View all
                        </button>

                    </div>


                    {pendingRequests.length === 0 ? (

                        <div className="manager-empty">

                            <div className="empty-check">
                                ✓
                            </div>

                            <h4>
                                All caught up!
                            </h4>

                            <p>
                                There are no pending leave
                                requests.
                            </p>

                        </div>

                    ) : (

                        <div className="manager-request-list">

                            {pendingRequests
                                .slice(0, 4)
                                .map((request) => (

                                    <div
                                        className="manager-request"
                                        key={request.id}
                                    >

                                        <div className="request-avatar">
                                            {request.employee?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "E"}
                                        </div>

                                        <div className="request-main">

                                            <strong>
                                                {request.employee?.name ||
                                                    "Employee"}
                                            </strong>

                                            <span>
                                                {request.leaveType?.name ||
                                                    "Leave"}
                                            </span>

                                            <small>
                                                {request.startDate}
                                                {" "}—{" "}
                                                {request.endDate}
                                            </small>

                                        </div>

                                        <div className="request-actions">

                                            <button
                                                className="approve-button"
                                                onClick={() =>
                                                    approveRequest(
                                                        request.id
                                                    )
                                                }
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className="reject-button"
                                                onClick={() =>
                                                    rejectRequest(
                                                        request.id
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>

                                        </div>

                                    </div>

                                ))}

                        </div>

                    )}

                </section>


                {/* QUICK ACTIONS */}

                <section className="panel">

                    <div className="panel-header">

                        <div>

                            <h3>
                                Quick Actions
                            </h3>

                            <p>
                                Common management tasks
                            </p>

                        </div>

                    </div>


                    <div className="quick-actions">

                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate("requests")
                            }
                        >

                            <div className="quick-icon blue">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Review Leave Requests
                                </strong>

                                <span>
                                    Approve or reject employee
                                    leave applications.
                                </span>

                            </div>

                            <b>
                                →
                            </b>

                        </button>


                        <button
                            className="quick-action"
                            onClick={() =>
                                navigate("employees")
                            }
                        >

                            <div className="quick-icon purple">
                                ♟
                            </div>

                            <div>

                                <strong>
                                    Manage Employees
                                </strong>

                                <span>
                                    View registered employees
                                    and their information.
                                </span>

                            </div>

                            <b>
                                →
                            </b>

                        </button>


                        <button
                            className="quick-action"
                            onClick={() =>
                                loadDashboard()
                            }
                        >

                            <div className="quick-icon green">
                                ↻
                            </div>

                            <div>

                                <strong>
                                    Refresh Dashboard
                                </strong>

                                <span>
                                    Get the latest employee and
                                    request information.
                                </span>

                            </div>

                            <b>
                                →
                            </b>

                        </button>

                    </div>

                </section>

            </div>


            {/* RECENT EMPLOYEES */}

            <section className="panel employee-preview-panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Recent Employees
                        </h3>

                        <p>
                            Employees registered in the system
                        </p>

                    </div>

                    <button
                        className="text-button"
                        onClick={() =>
                            navigate("employees")
                        }
                    >
                        View employees
                    </button>

                </div>


                {employees.length === 0 ? (

                    <div className="empty-state">
                        <p>
                            No employees found.
                        </p>
                    </div>

                ) : (

                    <div className="employee-preview-list">

                        {employees
                            .slice(0, 5)
                            .map((employee) => (

                                <div
                                    className="employee-preview"
                                    key={employee.id}
                                >

                                    <div className="employee-avatar">
                                        {employee.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "E"}
                                    </div>

                                    <div className="employee-info">

                                        <strong>
                                            {employee.name}
                                        </strong>

                                        <span>
                                            {employee.designation ||
                                                "Employee"}
                                        </span>

                                    </div>

                                    <div className="employee-department">
                                        {employee.department ||
                                            "—"}
                                    </div>

                                    <div className="employee-email">
                                        {employee.email}
                                    </div>

                                </div>

                            ))}

                    </div>

                )}

            </section>

        </>

    );


    /* =========================================
       REQUESTS PAGE
    ========================================= */

    const requestsPage = (

        <>

            <div className="dashboard-heading">

                <div>

                    <div className="page-eyebrow">
                        MANAGEMENT
                    </div>

                    <h2>
                        Leave Requests
                    </h2>

                    <p>
                        Review and manage employee leave
                        applications.
                    </p>

                </div>

            </div>


            <section className="panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Pending Requests
                        </h3>

                        <p>
                            {pendingRequests.length} request(s)
                            waiting for approval
                        </p>

                    </div>

                </div>


                {pendingRequests.length === 0 ? (

                    <div className="manager-empty large">

                        <div className="empty-check">
                            ✓
                        </div>

                        <h4>
                            No pending requests
                        </h4>

                        <p>
                            All employee leave requests have
                            been reviewed.
                        </p>

                    </div>

                ) : (

                    <div className="full-request-list">

                        {pendingRequests.map((request) => (

                            <div
                                className="full-request-card"
                                key={request.id}
                            >

                                <div className="full-request-top">

                                    <div className="request-avatar large-avatar">
                                        {request.employee?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "E"}
                                    </div>

                                    <div>

                                        <h3>
                                            {request.employee?.name ||
                                                "Employee"}
                                        </h3>

                                        <p>
                                            {request.employee?.department ||
                                                "Department"}
                                        </p>

                                    </div>

                                    <span className="status-badge pending">
                                        PENDING
                                    </span>

                                </div>


                                <div className="request-information">

                                    <div>
                                        <span>
                                            Leave Type
                                        </span>

                                        <strong>
                                            {request.leaveType?.name ||
                                                "—"}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Start Date
                                        </span>

                                        <strong>
                                            {request.startDate ||
                                                "—"}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            End Date
                                        </span>

                                        <strong>
                                            {request.endDate ||
                                                "—"}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Days
                                        </span>

                                        <strong>
                                            {request.numberOfDays ||
                                                0}
                                        </strong>
                                    </div>

                                </div>


                                {request.reason && (

                                    <div className="request-reason">

                                        <span>
                                            Reason
                                        </span>

                                        <p>
                                            {request.reason}
                                        </p>

                                    </div>

                                )}


                                <div className="full-request-actions">

                                    <button
                                        className="reject-button"
                                        onClick={() =>
                                            rejectRequest(
                                                request.id
                                            )
                                        }
                                    >
                                        Reject
                                    </button>

                                    <button
                                        className="approve-button"
                                        onClick={() =>
                                            approveRequest(
                                                request.id
                                            )
                                        }
                                    >
                                        Approve Request
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </>

    );


    /* =========================================
       EMPLOYEES PAGE
    ========================================= */

    const employeesPage = (

        <>

            <div className="dashboard-heading">

                <div>

                    <div className="page-eyebrow">
                        MANAGEMENT
                    </div>

                    <h2>
                        Employees
                    </h2>

                    <p>
                        View employees registered in the
                        leave management system.
                    </p>

                </div>

            </div>


            <section className="panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Employee Directory
                        </h3>

                        <p>
                            {employees.length} registered
                            employee(s)
                        </p>

                    </div>

                    <button
                        className="secondary-button"
                        onClick={loadDashboard}
                    >
                        ↻ Refresh
                    </button>

                </div>


                {employees.length === 0 ? (

                    <div className="empty-state">

                        <p>
                            No employees registered.
                        </p>

                    </div>

                ) : (

                    <div className="employee-directory">

                        {employees.map((employee) => (

                            <div
                                className="employee-directory-card"
                                key={employee.id}
                            >

                                <div className="employee-avatar large">
                                    {employee.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "E"}
                                </div>

                                <div className="directory-main">

                                    <h3>
                                        {employee.name}
                                    </h3>

                                    <span>
                                        {employee.designation ||
                                            "Employee"}
                                    </span>

                                </div>

                                <div className="directory-details">

                                    <div>
                                        <small>
                                            Email
                                        </small>

                                        <strong>
                                            {employee.email}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>
                                            Department
                                        </small>

                                        <strong>
                                            {employee.department ||
                                                "—"}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </>

    );


    /* =========================================
       SELECT PAGE
    ========================================= */

    let pageContent = dashboardPage;

    if (activePage === "requests") {
        pageContent = requestsPage;
    }

    if (activePage === "employees") {
        pageContent = employeesPage;
    }


    /* =========================================
       MAIN
    ========================================= */

    return (

        <div className="dashboard-layout">

            <Sidebar
                isOpen={menuOpen}
                onOpen={openMenu}
                onClose={closeMenu}
                role={user?.role}
                activePage={activePage}
                onNavigate={navigate}
                onLogout={onLogout}
            />


            <main className="main-content">

                <header className="topbar">

                    <div className="topbar-title">

                        <h1>
                            WorkLeave
                        </h1>

                        <p>
                            Employee Leave Management
                        </p>

                    </div>


                    <div className="topbar-user">

                        <div className="topbar-user-info">

                            <strong>
                                {user?.name || "Manager"}
                            </strong>

                            <small>
                                Manager
                            </small>

                        </div>

                        <div className="avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "M"}
                        </div>

                    </div>

                </header>


                <div className="dashboard-content">

                    {pageContent}

                </div>

            </main>

        </div>
    );
}

export default ManagerDashboard;