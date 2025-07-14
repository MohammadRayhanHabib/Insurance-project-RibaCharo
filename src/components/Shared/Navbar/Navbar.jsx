import React, { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../Spinner/LoadingSpinner';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { user, logOut, loading } = useAuth();

    // Fallback image for missing photoURL
    const fallbackImage = 'https://via.placeholder.com/32?text=User';

    // Navigation links
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'All Policies', path: '/policies' },
        { name: 'Agents', path: '/agents' },
        { name: 'FAQs', path: '/faqs' },
    ];

    // Animation variants
    const mobileMenuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    };

    if (loading) return <LoadingSpinner />;

    return (
        <nav className="bg-white shadow-2xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-3xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500"
                >
                    RibaCharo
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 items-center">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `text-base font-medium transition-colors duration-300 ${isActive
                                    ? 'text-teal-500 border-b-2 border-teal-500'
                                    : 'text-gray-700 hover:text-teal-500'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}

                    {/* Conditional Links */}
                    {user ? (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `text-base font-medium transition-colors duration-300 ${isActive ? 'text-teal-500' : 'text-gray-700 hover:text-teal-500'
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                            <div className="group relative">
                                <NavLink to="/profile" className="flex items-center space-x-2">
                                    <motion.img
                                        src={user?.photoURL || fallbackImage}
                                        alt={user?.displayName || 'User'}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </NavLink>
                                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm font-medium px-3 py-1 rounded-lg -bottom-10 left-1/2 transform -translate-x-1/2">
                                    {user?.displayName?.split(' ')[0] || 'User'}
                                </div>
                            </div>
                            <motion.button
                                onClick={logOut}
                                className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Logout
                            </motion.button>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-4 py-2 rounded-xl font-medium hover:from-green-700 hover:to-teal-600 transition-all duration-300"
                        >
                            Login
                        </NavLink>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden text-2xl text-gray-700">
                    <motion.button onClick={() => setOpen(!open)} whileTap={{ scale: 0.9 }}>
                        {open ? <FaTimes /> : <FaBars />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="md:hidden bg-white shadow-lg px-4 pb-4"
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `block py-3 text-base font-medium ${isActive ? 'text-teal-500' : 'text-gray-700 hover:text-teal-500'
                                    }`
                                }
                                onClick={() => setOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        {user ? (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className="block py-3 text-base font-medium text-gray-700 hover:text-teal-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="/profile"
                                    className="block py-3 text-base font-medium text-gray-700 hover:text-teal-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Profile
                                </NavLink>
                                <button
                                    onClick={() => {
                                        logOut();
                                        setOpen(false);
                                    }}
                                    className="block py-3 text-base font-medium text-red-500 hover:text-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="block py-3 text-base font-medium text-gray-700 hover:text-teal-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="block py-3 text-base font-medium text-gray-700 hover:text-teal-500"
                                    onClick={() => setOpen(false)}
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
