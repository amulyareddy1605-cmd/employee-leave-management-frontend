
import React from "react";
import "./Home.css";

export default function Home({ onNavigate }) {
  const features = [
    {
      icon: "◷",
      title: "Clear leave balances",
      text: "Know exactly how many leave days you have available.",
    },
    {
      icon: "✓",
      title: "Faster approvals",
      text: "Managers can review and respond to leave requests easily.",
    },
    {
      icon: "▦",
      title: "One shared view",
      text: "Keep leave requests, history, and team schedules organized.",
    },
  ];

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <a href="#home" className="home-brand">
          <span className="brand-icon">W</span>
          <span>
            <strong>WorkLeave</strong>
            <small>PEOPLE &amp; WORK, SIMPLIFIED</small>
          </span>
        </a>

        <div className="home-nav-links">
          <a href="#home">Overview</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <div className="home-nav-actions">
          <button
            className="nav-signin"
            onClick={() => onNavigate?.("login")}
          >
            Sign in
          </button>

          <button
            className="nav-get-started"
            onClick={() => onNavigate?.("register")}
          >
            Get started <span>↗</span>
          </button>
        </div>
      </nav>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              SMARTER PEOPLE OPERATIONS
            </div>

            <h1>
              Time off,
              <br />
              without the
              <br />
              <span className="hero-highlight">
                back-and-forth.
              </span>
            </h1>

            <p className="hero-description">
              A simpler way to manage employee leave. Request time
              off, track your balance, and get approvals without
              the paperwork.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-hero-btn"
                onClick={() => onNavigate?.("login")}
              >
                Explore the workspace <span>→</span>
              </button>

              <a
                className="secondary-hero-btn"
                href="#how-it-works"
              >
                See how it works <span>↘</span>
              </a>
            </div>

            <div className="hero-note">
              <div className="avatar-stack">
                <span>A</span>
                <span>M</span>
                <span>R</span>
              </div>

              <p>
                <strong>One organized workspace.</strong>
                <br />
                Less admin. More clarity.
              </p>
            </div>
          </div>

          <div className="hero-right">
            <div className="dashboard-window">
              <div className="dashboard-topbar">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <span className="preview-label">
                  WORKSPACE PREVIEW
                </span>

                <span className="preview-avatar">M</span>
              </div>

              <div className="dashboard-layout">
                <aside className="preview-sidebar">
                  <div className="preview-logo">W</div>

                  <p className="preview-menu-label">WORKSPACE</p>

                  <div className="preview-menu-item active">
                    <span>⌂</span> Overview
                  </div>

                  <div className="preview-menu-item">
                    <span>◷</span> My leave
                  </div>

                  <div className="preview-menu-item">
                    <span>▦</span> Team calendar
                  </div>

                  <div className="preview-menu-item">
                    <span>✓</span> Requests
                  </div>

                  <div className="sidebar-bottom">
                    <span className="online-dot"></span>
                    All systems ready
                  </div>
                </aside>

                <div className="preview-content">
                  <div className="preview-heading">
                    <div>
                      <span className="preview-date">
                        YOUR WORKSPACE
                      </span>

                      <h3>
                        Good morning, Maya <span>✳</span>
                      </h3>

                      <p>Here is your leave overview.</p>
                    </div>

                    <div className="today-pill">Today ↗</div>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-card stat-blue">
                      <div className="stat-top">
                        <span>Available days</span>
                        <span className="stat-icon">◷</span>
                      </div>

                      <strong>18 <small>days</small></strong>
                      <div className="stat-foot">
                        Ready when you are
                      </div>
                    </div>

                    <div className="stat-card stat-purple">
                      <div className="stat-top">
                        <span>Pending requests</span>
                        <span className="stat-icon">⌛</span>
                      </div>

                      <strong>02</strong>
                      <div className="stat-foot">
                        Awaiting review
                      </div>
                    </div>

                    <div className="stat-card stat-orange">
                      <div className="stat-top">
                        <span>Days taken</span>
                        <span className="stat-icon">✓</span>
                      </div>

                      <strong>06 <small>days</small></strong>
                      <div className="stat-foot">
                        This calendar year
                      </div>
                    </div>
                  </div>

                  <div className="preview-lower">
                    <div className="calendar-card">
                      <div className="card-heading">
                        <strong>Leave overview</strong>
                        <span>2026 ↗</span>
                      </div>

                      <div className="calendar-month">
                        October
                      </div>

                      <div className="calendar-days">
                        {["M", "T", "W", "T", "F", "S", "S"].map(
                          (day, index) => (
                            <span key={index}>{day}</span>
                          )
                        )}
                      </div>

                      <div className="calendar-dates">
                        {Array.from({ length: 35 }, (_, i) => {
                          const day = i - 2;
                          const valid = day >= 1 && day <= 31;

                          return (
                            <span
                              key={i}
                              className={[
                                !valid ? "empty-date" : "",
                                day === 9 ? "selected-date" : "",
                                [13, 14].includes(day)
                                  ? "leave-date"
                                  : "",
                              ].join(" ")}
                            >
                              {valid ? day : ""}
                            </span>
                          );
                        })}
                      </div>

                      <div className="calendar-legend">
                        <span><i></i> Today</span>
                        <span><i></i> Planned leave</span>
                      </div>
                    </div>

                    <div className="requests-card">
                      <div className="card-heading">
                        <strong>Recent requests</strong>
                        <span>View all →</span>
                      </div>

                      <div className="request-row">
                        <div className="request-icon sick">✚</div>

                        <div className="request-info">
                          <strong>Personal leave</strong>
                          <span>Oct 13 – Oct 14</span>
                        </div>

                        <span className="status-chip pending">
                          Pending
                        </span>
                      </div>

                      <div className="request-row">
                        <div className="request-icon vacation">
                          ☀
                        </div>

                        <div className="request-info">
                          <strong>Annual leave</strong>
                          <span>Sep 21 – Sep 22</span>
                        </div>

                        <span className="status-chip approved">
                          Approved
                        </span>
                      </div>

                      <div className="request-row">
                        <div className="request-icon personal">
                          ♡
                        </div>

                        <div className="request-info">
                          <strong>Personal leave</strong>
                          <span>Sep 04</span>
                        </div>

                        <span className="status-chip approved">
                          Approved
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="preview-footer">
                    <span>
                      <i></i> Leave data at a glance
                    </span>
                    <span>WorkLeave workspace</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-note">
              <div className="floating-check">✓</div>

              <div>
                <strong>One less thing to worry about.</strong>
                <span>Leave tracking, made simple.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="benefits-section" id="features">
          <div className="benefits-intro">
            <span>BUILT FOR BETTER WORKDAYS</span>

            <h2>Goodbye admin chaos.</h2>

            <p>
              Everything your team needs to make leave management
              feel effortless.
            </p>
          </div>

          <div className="benefits-grid">
            {features.map((feature, index) => (
              <article className="benefit-card" key={feature.title}>
                <div className={`benefit-icon benefit-icon-${index}`}>
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.text}</p>

                <span className="benefit-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div>
            <span className="how-eyebrow">
              SIMPLE BY DESIGN
            </span>

            <h2>
              From request
              <br />
              to resolution.
            </h2>
          </div>

          <div className="how-steps">
            <div className="how-step">
              <span>01</span>
              <div>
                <h3>Request</h3>
                <p>
                  Employees submit leave requests in a few clicks.
                </p>
              </div>
            </div>

            <div className="how-step">
              <span>02</span>
              <div>
                <h3>Review</h3>
                <p>
                  Managers review requests and make decisions.
                </p>
              </div>
            </div>

            <div className="how-step">
              <span>03</span>
              <div>
                <h3>Stay informed</h3>
                <p>
                  Everyone can check leave status and history.
                </p>
              </div>
            </div>
          </div>

          <button
            className="how-cta"
            onClick={() => onNavigate?.("register")}
          >
            Get started with WorkLeave <span>→</span>
          </button>
        </section>
      </main>

      <footer className="home-footer">
        <a href="#home" className="footer-brand">
          <span className="brand-icon">W</span>
          WorkLeave
        </a>

        <span>
          Leave management, thoughtfully simplified.
        </span>

        <button onClick={() => onNavigate?.("login")}>
          Sign in →
        </button>
      </footer>
    </div>
  );
}
