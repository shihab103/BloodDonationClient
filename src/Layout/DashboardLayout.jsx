import React, { useState } from "react";
import { Outlet } from "react-router";
import { FiMenu } from "react-icons/fi";
import DashboardSidebar from "../Component/DashboardSidebar/DashboardSidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for large devices (unchanged) */}
      <aside className="hidden md:block w-64 bg-white shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 pt-3 pl-8">
          📊 Dashboard
        </h2>
        <div>
          <DashboardSidebar />
        </div>
      </aside>

      {/* Sidebar for small devices (toggleable) */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <h2 className="text-2xl font-bold text-blue-600 pt-3 pl-8">
          📊 Dashboard
        </h2>
        <div>
          <DashboardSidebar closeSidebar={closeSidebar} />
        </div>
      </aside>

      {/* Overlay when sidebar open on small devices */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center md:hidden">
          {/* Toggle button only on small devices */}
          <button
            onClick={toggleSidebar}
            className="text-2xl text-blue-600 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <FiMenu />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome to Dashboard
          </h1>
        </header>

        {/* Desktop header */}
        <header className="hidden md:flex bg-white shadow-md p-4 justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome to Dashboard
          </h1>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;