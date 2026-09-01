function Navbar({ onMenuClick }) {
  return (
    <header className="app-navbar">
      <div className="app-navbar__left">
        <button
          type="button"
          className="app-navbar__menu"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className="app-navbar__brand">
          <div className="app-navbar__logo">
            TH
          </div>

          <div>
            <h1 className="app-navbar__title">
              TransitHub JU
            </h1>

            <p className="app-navbar__subtitle">
              Campus Transport System
            </p>
          </div>
        </div>
      </div>

      <div className="app-navbar__right">
        <span className="app-navbar__welcome">
          Welcome, Passenger
        </span>

        <div className="app-navbar__profile">
          P
        </div>
      </div>
    </header>
  );
}

export default Navbar;