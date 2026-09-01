import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./shared.css";

function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((previousState) => !previousState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Navbar onMenuClick={toggleSidebar} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <main className="app-layout__content">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;