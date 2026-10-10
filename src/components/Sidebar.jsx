function Sidebar({
    isOpen,
    onClose,
    onOpen,
    role,
    activePage,
    onNavigate,
    onLogout
}) {

    const isManager =
        role &&
        role.toUpperCase() === "MANAGER";


    const handleNavigation = (page) => {

        onNavigate(page);

        onClose();
    };


    const handleLogout = () => {

        onClose();

        onLogout();
    };


    return (
        <>
            {/* MENU BUTTON */}

            {!isOpen && (
                <button
                    className="menu-button"
                    onClick={onOpen}
                    aria-label="Open menu"
                >
                    ☰
                </button>
            )}


            {/* OVERLAY */}

            {isOpen && (
                <div
                    className="sidebar-overlay show"
                    onClick={onClose}
                />
            )}


            {/* SIDEBAR */}

            <aside
                className={
                    isOpen
                        ? "sidebar open"
                        : "sidebar"
                }
            >

                {/* SIDEBAR HEADER */}

                <div className="sidebar-header">

                    <div className="sidebar-brand">

                        <div className="sidebar-brand-icon">
                            W
                        </div>

                        <span>
                            WorkLeave
                        </span>

                    </div>

                    <button
                        className="sidebar-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {/* MENU */}

                <div className="sidebar-menu">

                    <button
                        className={
                            activePage === "dashboard"
                                ? "sidebar-item active"
                                : "sidebar-item"
                        }
                        onClick={() =>
                            handleNavigation("dashboard")
                        }
                    >
                        <span>◇</span>
                        <span>Dashboard</span>
                    </button>


                    {/* EMPLOYEE */}

                    {!isManager && (
                        <>

                            <button
                                className={
                                    activePage === "apply"
                                        ? "sidebar-item active"
                                        : "sidebar-item"
                                }
                                onClick={() =>
                                    handleNavigation("apply")
                                }
                            >
                                <span>＋</span>
                                <span>Apply Leave</span>
                            </button>


                            <button
                                className={
                                    activePage === "history"
                                        ? "sidebar-item active"
                                        : "sidebar-item"
                                }
                                onClick={() =>
                                    handleNavigation("history")
                                }
                            >
                                <span>▤</span>
                                <span>Leave History</span>
                            </button>

                        </>
                    )}


                    {/* MANAGER */}

                    {isManager && (
                        <>

                            <button
                                className={
                                    activePage === "requests"
                                        ? "sidebar-item active"
                                        : "sidebar-item"
                                }
                                onClick={() =>
                                    handleNavigation("requests")
                                }
                            >
                                <span>✓</span>
                                <span>Leave Requests</span>
                            </button>


                            <button
                                className={
                                    activePage === "employees"
                                        ? "sidebar-item active"
                                        : "sidebar-item"
                                }
                                onClick={() =>
                                    handleNavigation("employees")
                                }
                            >
                                <span>♟</span>
                                <span>Employees</span>
                            </button>

                        </>
                    )}

                </div>


                {/* LOGOUT */}

                <div className="sidebar-footer">

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <span>→</span>
                        <span>Logout</span>
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;