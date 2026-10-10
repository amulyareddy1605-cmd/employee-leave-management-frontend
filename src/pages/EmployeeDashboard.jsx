import { useEffect, useState } from "react";
import api from "../api";

import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";

function EmployeeDashboard({ user, onLogout }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const [activePage, setActivePage] =
        useState("dashboard");

    const [balances, setBalances] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        leaveTypeId: "",
        startDate: "",
        endDate: "",
        reason: ""
    });

    const employeeId = user?.employeeId;


    /* =====================================================
       MENU
    ===================================================== */

    const openMenu = () => {
        setMenuOpen(true);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const navigate = (page) => {

        setActivePage(page);

        setMenuOpen(false);

        setError("");
        setSuccess("");
    };


    /* =====================================================
       LOAD DATA
    ===================================================== */

    const loadData = async () => {

        if (!employeeId) {

            setError(
                "Employee ID not found. Please login again."
            );

            setLoading(false);

            return;
        }

        try {

            setLoading(true);
            setError("");

            const [
                balanceResponse,
                typeResponse,
                requestResponse
            ] = await Promise.all([

                api.get(
                    `/leave-balance/employee/${employeeId}`
                ),

                api.get("/leave-types"),

                api.get(
                    `/leave/employee/${employeeId}`
                )
            ]);


            setBalances(
                Array.isArray(balanceResponse.data)
                    ? balanceResponse.data
                    : []
            );


            setLeaveTypes(
                Array.isArray(typeResponse.data)
                    ? typeResponse.data
                    : []
            );


            setRequests(
                Array.isArray(requestResponse.data)
                    ? requestResponse.data
                    : []
            );

        } catch (err) {

            console.error(
                "EMPLOYEE DASHBOARD ERROR:",
                err
            );

            setError(
                "Unable to load employee data."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadData();

    }, [employeeId]);


    /* =====================================================
       FORM CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    /* =====================================================
       APPLY LEAVE
    ===================================================== */

    const handleApplyLeave = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.leaveTypeId) {

            setError(
                "Please select a leave type."
            );

            return;
        }


        if (
            !formData.startDate ||
            !formData.endDate
        ) {

            setError(
                "Please select start and end dates."
            );

            return;
        }


        if (
            formData.endDate <
            formData.startDate
        ) {

            setError(
                "End date cannot be before start date."
            );

            return;
        }


        if (!formData.reason.trim()) {

            setError(
                "Please enter a reason for your leave."
            );

            return;
        }


        try {

            setSubmitting(true);

            await api.post(
                `/leave/apply?employeeId=${employeeId}&leaveTypeId=${formData.leaveTypeId}`,
                {
                    startDate:
                        formData.startDate,

                    endDate:
                        formData.endDate,

                    reason:
                        formData.reason
                }
            );


            setSuccess(
                "Leave application submitted successfully."
            );


            setFormData({
                leaveTypeId: "",
                startDate: "",
                endDate: "",
                reason: ""
            });


            await loadData();

        } catch (err) {

            console.error(
                "LEAVE APPLICATION ERROR:",
                err
            );


            if (
                typeof err.response?.data ===
                "string"
            ) {

                setError(
                    err.response.data
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Failed to apply for leave."
                );
            }

        } finally {

            setSubmitting(false);

        }
    };


    /* =====================================================
       DATE FORMAT
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    const getStatusClass = (status) => {

        if (status === "APPROVED") {
            return "status-badge approved";
        }

        if (status === "REJECTED") {
            return "status-badge rejected";
        }

        return "status-badge pending";
    };


    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalAvailable =
        balances.reduce(
            (total, balance) =>
                total +
                Number(
                    balance.remainingDays || 0
                ),
            0
        );


    const totalUsed =
        balances.reduce(
            (total, balance) =>
                total +
                Number(
                    balance.usedDays || 0
                ),
            0
        );


    const pendingCount =
        requests.filter(
            (request) =>
                request.status === "PENDING"
        ).length;


    const approvedCount =
        requests.filter(
            (request) =>
                request.status === "APPROVED"
        ).length;


    /* =====================================================
       LOADING
    ===================================================== */

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
                        text="Loading employee dashboard..."
                    />

                </main>

            </div>
        );
    }


    /* =====================================================
       DASHBOARD PAGE
    ===================================================== */

    const dashboardPage = (

        <>

            <div className="dashboard-heading">

                <div>

                    <div className="page-eyebrow">
                        EMPLOYEE PORTAL
                    </div>

                    <h2>
                        Good day, {user?.name || "Employee"}
                    </h2>

                    <p>
                        Here's what's happening with your leave.
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={() =>
                        navigate("apply")
                    }
                >
                    + Apply Leave
                </button>

            </div>


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* STATISTICS */}

            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon green">
                        ✓
                    </div>

                    <div className="stat-content">

                        <span>
                            Available Leave
                        </span>

                        <strong>
                            {totalAvailable}
                        </strong>

                        <small>
                            Days remaining
                        </small>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon blue">
                        ◷
                    </div>

                    <div className="stat-content">

                        <span>
                            Used Leave
                        </span>

                        <strong>
                            {totalUsed}
                        </strong>

                        <small>
                            Days used
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
                            {pendingCount}
                        </strong>

                        <small>
                            Awaiting approval
                        </small>

                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon purple">
                        ✓
                    </div>

                    <div className="stat-content">

                        <span>
                            Approved
                        </span>

                        <strong>
                            {approvedCount}
                        </strong>

                        <small>
                            Approved requests
                        </small>

                    </div>

                </div>

            </div>


            {/* TWO COLUMNS */}

            <div className="two-column-grid">


                {/* LEAVE BALANCE */}

                <section className="panel">

                    <div className="panel-header">

                        <div>

                            <h3>
                                Leave Balance
                            </h3>

                            <p>
                                Your available leave for this year
                            </p>

                        </div>

                    </div>


                    {balances.length === 0 ? (

                        <div className="empty-state">

                            <p>
                                No leave balance available.
                            </p>

                        </div>

                    ) : (

                        <div className="balance-list">

                            {balances.map((balance) => (

                                <div
                                    className="balance-item"
                                    key={balance.id}
                                >

                                    <div>

                                        <strong>
                                            {balance.leaveType?.name ||
                                                "Leave"}
                                        </strong>

                                        <small>
                                            Used{" "}
                                            {balance.usedDays || 0}
                                            {" "}of{" "}
                                            {balance.allocatedDays || 0}
                                            {" "}days
                                        </small>

                                    </div>


                                    <div className="balance-right">

                                        <strong>
                                            {balance.remainingDays || 0}
                                        </strong>

                                        <small>
                                            remaining
                                        </small>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* RECENT REQUESTS */}

                <section className="panel">

                    <div className="panel-header">

                        <div>

                            <h3>
                                Recent Requests
                            </h3>

                            <p>
                                Your latest leave applications
                            </p>

                        </div>

                        <button
                            className="text-button"
                            onClick={() =>
                                navigate("history")
                            }
                        >
                            View all
                        </button>

                    </div>


                    {requests.length === 0 ? (

                        <div className="empty-state">

                            <p>
                                No leave requests yet.
                            </p>

                            <small>
                                Your submitted requests will appear here.
                            </small>

                        </div>

                    ) : (

                        <div className="request-list">

                            {requests
                                .slice(0, 4)
                                .map((request) => (

                                    <div
                                        className="request-item"
                                        key={request.id}
                                    >

                                        <div>

                                            <strong>
                                                {request.leaveType?.name ||
                                                    "Leave"}
                                            </strong>

                                            <small>
                                                {formatDate(
                                                    request.startDate
                                                )}
                                                {" "}—{" "}
                                                {formatDate(
                                                    request.endDate
                                                )}
                                            </small>

                                        </div>


                                        <span
                                            className={
                                                getStatusClass(
                                                    request.status
                                                )
                                            }
                                        >
                                            {request.status}
                                        </span>

                                    </div>

                                ))}

                        </div>

                    )}

                </section>

            </div>


            {/* PROFILE */}

            <section className="panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            My Profile
                        </h3>

                        <p>
                            Employee information
                        </p>

                    </div>

                </div>


                <div className="profile-grid">

                    <div className="profile-item">

                        <span>
                            Full Name
                        </span>

                        <strong>
                            {user?.name || "-"}
                        </strong>

                    </div>


                    <div className="profile-item">

                        <span>
                            Email
                        </span>

                        <strong>
                            {user?.email || "-"}
                        </strong>

                    </div>


                    <div className="profile-item">

                        <span>
                            Employee ID
                        </span>

                        <strong>
                            #{user?.employeeId || "-"}
                        </strong>

                    </div>


                    <div className="profile-item">

                        <span>
                            Role
                        </span>

                        <strong>
                            Employee
                        </strong>

                    </div>

                </div>

            </section>

        </>

    );


    /* =====================================================
       APPLY LEAVE PAGE
    ===================================================== */

    const applyLeavePage = (

        <>

            <div className="dashboard-heading">

                <div>

                    <div className="page-eyebrow">
                        LEAVE MANAGEMENT
                    </div>

                    <h2>
                        Apply for Leave
                    </h2>

                    <p>
                        Submit a new leave request for approval.
                    </p>

                </div>

            </div>


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}


            <section className="panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            New Leave Request
                        </h3>

                        <p>
                            Select your leave type and dates.
                        </p>

                    </div>

                </div>


                <form
                    onSubmit={handleApplyLeave}
                >

                    <div className="form-row">


                        {/* LEAVE TYPE */}

                        <div className="form-group">

                            <label>
                                Leave Type
                            </label>

                            <select
                                name="leaveTypeId"
                                value={
                                    formData.leaveTypeId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select leave type
                                </option>

                                {leaveTypes.map(
                                    (leaveType) => (

                                        <option
                                            key={
                                                leaveType.id
                                            }
                                            value={
                                                leaveType.id
                                            }
                                        >
                                            {leaveType.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* START DATE */}

                        <div className="form-group">

                            <label>
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={
                                    formData.startDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                    </div>


                    <div className="form-row">


                        {/* END DATE */}

                        <div className="form-group">

                            <label>
                                End Date
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={
                                    formData.endDate
                                }
                                onChange={
                                    handleChange
                                }
                                min={
                                    formData.startDate ||
                                    undefined
                                }
                                required
                            />

                        </div>


                        {/* AVAILABLE DAYS */}

                        <div className="form-group">

                            <label>
                                Available Days
                            </label>

                            <input
                                type="text"
                                value={
                                    formData.leaveTypeId
                                        ? (
                                            balances.find(
                                                (balance) =>
                                                    String(
                                                        balance.leaveType?.id
                                                    ) ===
                                                    String(
                                                        formData.leaveTypeId
                                                    )
                                            )?.remainingDays ??
                                            "Balance will be checked"
                                        )
                                        : "Select leave type"
                                }
                                readOnly
                            />

                        </div>

                    </div>


                    {/* REASON */}

                    <div className="form-group">

                        <label>
                            Reason
                        </label>

                        <textarea
                            name="reason"
                            placeholder="Enter the reason for your leave..."
                            value={
                                formData.reason
                            }
                            onChange={
                                handleChange
                            }
                            rows="5"
                            required
                        />

                    </div>


                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate("dashboard")
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={submitting}
                        >

                            {submitting
                                ? "Submitting..."
                                : "Submit Leave Request"}

                        </button>

                    </div>

                </form>

            </section>


            {/* LEAVE BALANCE INFORMATION */}

            <section className="panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Your Leave Balance
                        </h3>

                        <p>
                            Check your available days before applying.
                        </p>

                    </div>

                </div>


                <div className="balance-list">

                    {balances.length === 0 ? (

                        <div className="empty-state">

                            <p>
                                No leave balances available.
                            </p>

                        </div>

                    ) : (

                        balances.map((balance) => (

                            <div
                                className="balance-item"
                                key={balance.id}
                            >

                                <div>

                                    <strong>
                                        {balance.leaveType?.name ||
                                            "Leave"}
                                    </strong>

                                    <small>
                                        Allocated:{" "}
                                        {balance.allocatedDays || 0}
                                        {" "}days
                                    </small>

                                </div>

                                <div className="balance-right">

                                    <strong>
                                        {balance.remainingDays || 0}
                                    </strong>

                                    <small>
                                        remaining
                                    </small>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </section>

        </>

    );


    /* =====================================================
       LEAVE HISTORY PAGE
    ===================================================== */

    const historyPage = (

        <>

            <div className="dashboard-heading">

                <div>

                    <div className="page-eyebrow">
                        LEAVE MANAGEMENT
                    </div>

                    <h2>
                        Leave History
                    </h2>

                    <p>
                        View all your submitted leave requests.
                    </p>

                </div>


                <button
                    className="secondary-button"
                    onClick={loadData}
                >
                    ↻ Refresh
                </button>

            </div>


            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            <section className="panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            All Leave Requests
                        </h3>

                        <p>
                            {requests.length} request(s)
                            in your history
                        </p>

                    </div>

                </div>


                {requests.length === 0 ? (

                    <div className="manager-empty">

                        <div className="empty-check">
                            ✓
                        </div>

                        <h4>
                            No leave history
                        </h4>

                        <p>
                            You have not submitted any leave requests yet.
                        </p>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("apply")
                            }
                        >
                            Apply for Leave
                        </button>

                    </div>

                ) : (

                    <div className="table-container">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>
                                        Leave Type
                                    </th>

                                    <th>
                                        Start Date
                                    </th>

                                    <th>
                                        End Date
                                    </th>

                                    <th>
                                        Days
                                    </th>

                                    <th>
                                        Reason
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {requests.map(
                                    (request) => (

                                        <tr
                                            key={
                                                request.id
                                            }
                                        >

                                            <td>
                                                <strong>
                                                    {request.leaveType?.name ||
                                                        "-"}
                                                </strong>
                                            </td>


                                            <td>
                                                {formatDate(
                                                    request.startDate
                                                )}
                                            </td>


                                            <td>
                                                {formatDate(
                                                    request.endDate
                                                )}
                                            </td>


                                            <td>
                                                {request.numberOfDays ||
                                                    0}
                                            </td>


                                            <td>
                                                {request.reason ||
                                                    "-"}
                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        getStatusClass(
                                                            request.status
                                                        )
                                                    }
                                                >
                                                    {request.status}
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </>

    );


    /* =====================================================
       SELECT ACTIVE PAGE
    ===================================================== */

    let pageContent = dashboardPage;


    if (activePage === "apply") {
        pageContent = applyLeavePage;
    }


    if (activePage === "history") {
        pageContent = historyPage;
    }


    /* =====================================================
       MAIN LAYOUT
    ===================================================== */

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


                {/* TOPBAR */}

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
                                {user?.name || "Employee"}
                            </strong>

                            <small>
                                Employee
                            </small>

                        </div>


                        <div className="avatar">

                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "E"}

                        </div>

                    </div>

                </header>


                {/* CONTENT */}

                <div className="dashboard-content">

                    {pageContent}

                </div>

            </main>

        </div>
    );
}

export default EmployeeDashboard;
