// DashboardLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-6 space-y-4">
                <h2 className="text-2xl font-bold text-green-600">Admin Dashboard</h2>
                <nav className="space-y-2">
                    <NavLink to="/dashboard/admin/applications" className="block hover:text-green-500">🧾 Applications</NavLink>
                    <NavLink to="/dashboard/admin/users" className="block hover:text-green-500">👥 Users</NavLink>
                    <NavLink to="/dashboard/admin/policies" className="block hover:text-green-500">📄 Policies</NavLink>
                    <NavLink to="/dashboard/admin/transactions" className="block hover:text-green-500">💳 Transactions</NavLink>
                    <NavLink to="/dashboard/admin/agents" className="block hover:text-green-500">🧑‍💼 Agents</NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
