import React, {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../api";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Loading from "../components/Loading";


function ApplyLeave() {

    const navigate =
        useNavigate();


    const userString =
        localStorage.getItem("user");

    const user =
        userString
            ? JSON.parse(userString)
            : null;


    const employeeId =
        user?.employeeId;


    const [leaveTypes, setLeaveTypes] =
        useState([]);

    const [leaveTypeId, setLeaveTypeId] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const [reason, setReason] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [menuOpen, setMenuOpen] =
        useState(false);


    useEffect(() => {

        if (!employeeId) {
            navigate("/login");
            return;
        }

        loadLeaveTypes();

    }, [employeeId]);


    const loadLeaveTypes =
        async () => {

            try {

                const response =
                    await api.get(
                        "/leave-types"
                    );

                setLeaveTypes(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Leave types error:",
                    error
                );

                setError(
                    "Unable to load leave types."
                );

            } finally {

                setLoading(false);

            }
        };


    const handleSubmit =
        async (e) => {

            e.preventDefault();

            setError("");
            setMessage("");


            if (!leaveTypeId) {

                setError(
                    "Please select a leave type."
                );

                return;
            }


            if (
                endDate <
                startDate
            ) {

                setError(
                    "End date cannot be before start date."
                );

                return;
            }


            setSubmitting(true);


            try {

                await api.post(
                    `/leave/apply?employeeId=${employeeId}&leaveTypeId=${leaveTypeId}`,
                    {
                        startDate,
                        endDate,
                        reason,
                    }
                );


                setMessage(
                    "Leave application submitted successfully."
                );


                setLeaveTypeId("");
                setStartDate("");
                setEndDate("");
                setReason("");


            } catch (error) {

                console.error(
                    "Apply leave error:",
                    error
                );

                setError(
                    error.response?.data ||
                    "Failed to apply for leave."
                );

            } finally {

                setSubmitting(false);

            }
        };


    if (loading) {

        return (
            <Loading text="Loading leave types..." />
        );

    }


    return (
        <div className="dashboard-layout">

            <Sidebar
                role="EMPLOYEE"
                open={menuOpen}
                setOpen={setMenuOpen}
            />


            <main className="main-content">

                <Topbar
                    title="Apply Leave"
                    user={user}
                />


                <section className="dashboard-content">

                    <div className="page-title">

                        <div>

                            <h2>
                                Apply for Leave
                            </h2>

                            <p>
                                Submit a new leave
                                application.
                            </p>

                        </div>


                        <button
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    "/employee"
                                )
                            }
                        >
                            ← Dashboard
                        </button>

                    </div>


                    <div className="form-panel">

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Leave Type
                                    </label>

                                    <select
                                        value={
                                            leaveTypeId
                                        }
                                        onChange={(e) =>
                                            setLeaveTypeId(
                                                e.target.value
                                            )
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select leave type
                                        </option>

                                        {leaveTypes.map(
                                            (type) => (

                                                <option
                                                    key={
                                                        type.id
                                                    }
                                                    value={
                                                        type.id
                                                    }
                                                >
                                                    {
                                                        type.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            startDate
                                        }
                                        onChange={(e) =>
                                            setStartDate(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            endDate
                                        }
                                        onChange={(e) =>
                                            setEndDate(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Reason
                                </label>

                                <textarea
                                    rows="5"
                                    placeholder="Enter reason for leave..."
                                    value={
                                        reason
                                    }
                                    onChange={(e) =>
                                        setReason(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>


                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}


                            {message && (
                                <div className="success-message">
                                    {message}
                                </div>
                            )}


                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        navigate(
                                            "/employee"
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        submitting
                                    }
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Leave Request"}
                                </button>

                            </div>

                        </form>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default ApplyLeave;