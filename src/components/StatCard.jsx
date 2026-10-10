import React from "react";


function StatCard({
    icon,
    label,
    value,
    description,
    type = "blue",
}) {

    return (
        <div className="stat-card">

            <div
                className={`stat-icon ${type}`}
            >
                {icon}
            </div>


            <div className="stat-content">

                <span>
                    {label}
                </span>

                <strong>
                    {value}
                </strong>

                <small>
                    {description}
                </small>

            </div>

        </div>
    );
}

export default StatCard;