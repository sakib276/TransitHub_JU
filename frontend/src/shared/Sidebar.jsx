import { NavLink } from "react-router-dom";

const navigationItems = [
  ["View Available Vehicles", "/available-vehicles"],
  ["Request a Ride", "/request-a-ride"],
  ["Passenger Queue System", "/passenger-queue"],
  ["View Fare", "/view-fare"],
  ["Join Shared Ride", "/join-shared-ride"],
  ["Update Vehicle Status", "/vehicle-status"],
  ["Submit a Complaint", "/submit-a-complaint"],
  ["View Trip History", "/trip-history"],
  ["Manage Vehicles & Drivers", "/manage-vehicles-drivers"],
  ["Report Emergency", "/report-emergency"],
];

function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`app-sidebar ${
        isOpen ? "app-sidebar--open" : ""
      }`}
    >
      <div className="app-sidebar__header">
        <span>Navigation</span>

        <button
          type="button"
          className="app-sidebar__close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          ×
        </button>
      </div>

      <nav className="app-sidebar__nav">
        {navigationItems.map(([label, path]) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `app-sidebar__link ${
                isActive
                  ? "app-sidebar__link--active"
                  : ""
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;