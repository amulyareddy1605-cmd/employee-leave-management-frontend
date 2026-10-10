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


function LeaveHistory() {

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


    const [requests, setRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [menuOpen, setMenuOpen] =
        useState(false);


    useEffect(() => {

        if (!employeeId) {

            navigate("/login");

            return;
        }


        loadHistory();

    }, [employeeId]);


    const loadHistory =
        async () => {

            try {

                const response =
                    await api.get(
                        `/leave/employee/${employeeId}`
                    );

                setRequests(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Leave history error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };


    if (loading) {

        return (
            <Loading text="Loading leave history..." />
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
                    title="Leave History"
                    user={user}
                />


                <section className="dashboard-content">

                    <div className="page-title">

                        <div>

                            <h2>
                                Leave History
                            </h2>

                            <p>
                                View all your leave
                                applications.
                            </p>

                        </div>


                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate(
                                    "/employee/apply-leave"
                                )
                            }
                        >
                            + Apply Leave
                        </button>

                    </div>


                    <div className="table-panel">

                        {requests.length === 0 ? (

                            <div className="empty-state large">
                                <div className="empty-icon">
                                    ✓
                                </div>

                                <h3>
                                    No leave requests
                                </h3>

                                <p>
                                    You haven't submitted
                                    any leave applications.
                                </p>

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        navigate(
                                            "/employee/apply-leave"
                                        )
                                    }
                                >
                                    Apply for Leave
                                </button>

                            </div>

                        ) : (

                            <div className="table-wrapper">

                                <table>

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

                                            <th>
                                                Manager Comment
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
                                                            {
                                                                request.leaveType
                                                                    ?.name
                                                            }
                                                        </strong>
                                                    </td>


                                                    <td>
                                                        {
                                                            request.startDate
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            request.endDate
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            request.numberOfDays
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            request.reason
                                                        }
                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`status-badge ${String(
                                                                request.status
                                                            ).toLowerCase()}`}
                                                        >
                                                            {
                                                                request.status
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>
                                                        {
                                                            request.managerComment ||
                                                            "-"
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default LeaveHistory;