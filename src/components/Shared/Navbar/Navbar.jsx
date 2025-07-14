import { Link, NavLink } from "react-router";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../Spinner/LoadingSpinner";


const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { user, logOut, loading } = useAuth(); // Assume this returns user info & logout function

    // const [userPic, setUserPic] = useState()

    // useEffect(() => {
    //     setUserPic(user?.photoURL)
    // }, [user])

    // console.log(photo);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "All Policies", path: "/policies" },
        { name: "Agents", path: "/agents" },
        { name: "FAQs", path: "/faqs" },
    ];

    if (loading) return <LoadingSpinner></LoadingSpinner>
    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-[1660px] mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    NeoLife
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `hover:text-blue-600 font-medium ${isActive ? "text-blue-600" : "text-gray-700"
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
                                className="text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Dashboard
                            </NavLink>

                            <div className="tooltip tooltip-bottom">
                                <div className="tooltip-content">
                                    <div className="animate-bounce text-orange-400  text-sm font-black"><span>{user?.displayName?.split(" ")[0]}</span></div>
                                </div>
                                <NavLink
                                    to={'profile'}
                                    className="tooltip tooltip-bottom flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                                >
                                    <img
                                        src={user?.photoURL}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />

                                </NavLink>
                            </div>



                            <button
                                onClick={logOut}
                                className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
                            >
                                Logout

                            </button>
                        </>
                    ) : (
                        <>
                            {/* <NavLink
                                to="/login"
                                className="text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Login
                            </NavLink> */}
                            <NavLink
                                to="/login"
                                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                            >
                                Login
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden text-2xl text-gray-700">
                    <button onClick={() => setOpen(!open)}>
                        {open ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden px-4 pb-4">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className="block py-2 text-gray-700 hover:text-blue-600"
                            onClick={() => setOpen(false)}
                        >
                            {link.name}
                        </NavLink>
                    ))}

                    {user ? (
                        <>
                            <NavLink to="/dashboard" className="block py-2" onClick={() => setOpen(false)}>
                                Dashboard
                            </NavLink>
                            <NavLink to="/profile" className="block py-2" onClick={() => setOpen(false)}>
                                Profile
                            </NavLink>
                            <button
                                onClick={() => {
                                    logOut();
                                    setOpen(false);
                                }}
                                className="block py-2 text-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="block py-2" onClick={() => setOpen(false)}>
                                Login
                            </NavLink>
                            <NavLink to="/register" className="block py-2" onClick={() => setOpen(false)}>
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
