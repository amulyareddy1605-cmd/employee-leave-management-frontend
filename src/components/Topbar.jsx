import React from "react";


function Topbar({
    title,
    user,
}) {

    const name =
        user?.name ||
        "User";

    const role =
        user?.role ||
        "EMPLOYEE";


    return (
        <header className="topbar">

            <div className="topbar-left">

                <h1>
                    {title}
                </h1>

                <p>
                    Welcome back, {name}
                </p>

            </div>


            <div className="topbar-user">

                <div className="notification">
                    ◇
                </div>

                <div className="avatar">
                    {name
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div className="user-details">

                    <strong>
                        {name}
                    </strong>

                    <span>
                        {role}
                    </span>

                </div>

            </div>

        </header>
    );
}

export default Topbar;