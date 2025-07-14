import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { FaBars, FaTimes, FaFileAlt, FaUsers, FaShieldAlt, FaCreditCard, FaUserCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Sidebar navigation links
    const navLinks = [
        { name: 'Applications', path: '/dashboard/admin/applications', icon: <FaFileAlt className="text-xl" /> },
        { name: 'Users', path: '/dashboard/admin/users', icon: <FaUsers className="text-xl" /> },
        { name: 'Policies', path: '/dashboard/admin/policies', icon: <FaShieldAlt className="text-xl" /> },
        { name: 'Transactions', path: '/dashboard/admin/transactions', icon: <FaCreditCard className="text-xl" /> },
        { name: 'Agents', path: '/dashboard/admin/agents', icon: <FaUserCheck className="text-xl" /> },
    ];

    // Animation variants
    const sidebarVariants = {
        open: { x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        closed: { x: '-100%', transition: { duration: 0.3, ease: 'easeIn' } },
    };

    return (
        <>
            <Helmet>
                <title>NeoTakaful | Admin Dashboard</title>
            </Helmet>
            <div className="min-h-screen bg-white flex">
                {/* Mobile Toggle Button */}
                <motion.button
                    className="md:hidden fixed top-4 left-4 z-50 text-2xl text-gray-700"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    whileTap={{ scale: 0.9 }}
                >
                    {isSidebarOpen ? <FaTimes /> : <FaBars />}
                </motion.button>

                {/* Sidebar */}
                <AnimatePresence>
                    <motion.aside
                        className={`w-64 bg-gray-50 shadow-lg p-6 fixed h-full z-40 md:static md:flex md:flex-col ${isSidebarOpen ? 'block' : 'hidden'
                            } md:block`}
                        variants={sidebarVariants}
                        initial="closed"
                        animate={isSidebarOpen || window.innerWidth >= 768 ? 'open' : 'closed'}
                    >
                        <h2 className="text-2xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500 mb-6">
                            NeoTakaful Admin
                        </h2>
                        <nav className="space-y-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 p-3 rounded-lg text-base font-medium transition-colors duration-300 ${isActive
                                            ? 'bg-teal-500 text-white'
                                            : 'text-gray-700 hover:bg-teal-100 hover:text-teal-500'
                                        }`
                                    }
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    {link.icon}
                                    <span>{link.name}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </motion.aside>
                </AnimatePresence>

                {/* Backdrop for Mobile */}
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-3xl shadow-2xl p-8"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default DashboardLayout;