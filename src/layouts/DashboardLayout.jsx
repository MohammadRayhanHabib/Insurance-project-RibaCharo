import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Loader2 } from 'lucide-react';
import useRole from '../hooks/useRole';
import Sidebar from '../components/Sidebar/Sidebar';
import LoadingSpinner from '../components/Shared/Spinner/LoadingSpinner';

const DashboardLayout = () => {
    const [role, loaderForRole] = useRole();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loaderForRole) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - Always visible on desktop, toggleable on mobile */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform md:translate-x-0 md:relative md:w-64 lg:w-72 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <Sidebar role={role} isOpen={isSidebarOpen} />
            </div>

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main content area */}
            <div className="flex-1 flex flex-col w-full">
                {/* Topbar for mobile toggle */}
                <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow-md sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-700 hover:text-green-600 focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                            />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
                </div>

                {/* Outlet content */}
                <main className="p-4 md:p-6 lg:p-8 transition-all duration-300">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
