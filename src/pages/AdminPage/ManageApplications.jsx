import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Loader2, UserRound, MessageCircleMore, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { axiosSecure } from '../../hooks/useAxiosSecure';
import { MessageCircle } from 'lucide-react'; // Optional icon
import LoadingSpinner from '../../components/Shared/Spinner/LoadingSpinner';
const ManageApplications = () => {
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');

    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications');
            return res.data;
        },
    });

    const { data: agents = [] } = useQuery({
        queryKey: ['agents'],
        queryFn: async () => {
            const res = await axiosSecure.get('/agents');
            return res.data;
        },
    });

    const updateApplication = useMutation({
        mutationFn: async ({ id, updates }) => {
            const res = await axiosSecure.patch(`/applications/${id}`, updates);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            setSelectedApp(null);
        },
    });

    const handleAssignAgent = () => {
        if (!selectedApp || !selectedAgent) return;
        updateApplication.mutate({ id: selectedApp._id, updates: { agentId: selectedAgent, status: 'Assigned' } });
    };

    const handleReject = () => {
        if (!selectedApp) return;
        updateApplication.mutate({ id: selectedApp._id, updates: { status: 'Rejected' } });
    };

    // if (isLoading) {
    //     return <LoadingSpinner>

    //     </LoadingSpinner>
    // }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-red-600 text-xl">Error loading applications: {error.message}</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>NeoTakaful | Manage Applications</title>
            </Helmet>
            <motion.div
                className="max-w-7xl mx-auto p-6 bg-white rounded-3xl shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent mb-6">
                    Manage Applications
                </h1>

                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Applicant</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Policy</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center">
                                            <img src={app.personal.userImg} alt={app.personal.name} className="w-10 h-10 rounded-full mr-2" />
                                            {app.personal.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">{app.personal.email}</td>
                                    <td className="px-4 py-4">{app.policyTitle}</td>
                                    <td className="px-4 py-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded-full text-sm ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : app.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{app.status}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <motion.button
                                            onClick={() => setSelectedApp(app)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                                        >
                                            View Details
                                        </motion.button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile icon list */}
                <div className="md:hidden flex flex-wrap gap-3">
                    {applications.map(app => (
                        <motion.button
                            key={app._id}
                            onClick={() => setSelectedApp(app)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full text-left px-4 py-3 bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 transition-all flex items-center gap-4"
                        >
                            {/* Avatar with green ring */}
                            <div className="relative w-14 h-14 rounded-full">
                                <img
                                    src={app?.personal?.userImg}
                                    alt={app?.personal?.name}
                                    className="w-full h-full object-cover rounded-full border-2 border-green-500"
                                />
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                    {app?.personal?.name}
                                    <span className="text-xs text-gray-500 ml-1">sent an application</span>
                                </p>
                                <p className="text-xs text-gray-500 truncate">{app?.personal?.email}</p>
                            </div>

                            {/* Optional Status Badge */}
                            <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${app.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : app.status === 'Approved'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                {app.status}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Modal */}
                <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Dialog.Panel className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <Dialog.Title className="text-2xl font-bold text-gray-800">
                                    {selectedApp?.personal.name}'s Application
                                </Dialog.Title>
                                <button onClick={() => setSelectedApp(null)}><X className="text-gray-500" /></button>
                            </div>

                            <div className="space-y-2">
                                <p><strong>Email:</strong> {selectedApp?.personal.email}</p>
                                <p><strong>Address:</strong> {selectedApp?.personal.address}</p>
                                <p><strong>NID:</strong> {selectedApp?.personal.nid}</p>
                                <p><strong>Nominee:</strong> {selectedApp?.nominee.name} ({selectedApp?.nominee.relationship})</p>
                                <p><strong>Health Disclosure:</strong> {selectedApp?.healthDisclosure?.join(', ') || 'None'}</p>
                                <p><strong>Policy:</strong> {selectedApp?.policyTitle}</p>
                                <img src={selectedApp?.policyImg} alt="Policy" className="rounded-xl h-32 object-cover mt-2" />

                                <select
                                    value={selectedAgent}
                                    onChange={(e) => setSelectedAgent(e.target.value)}
                                    className="w-full border mt-4 px-2 py-1 rounded-xl"
                                >
                                    <option value=''>Select Agent</option>
                                    {agents.map(agent => (
                                        <option key={agent._id} value={agent._id}>{agent.name}</option>
                                    ))}
                                </select>

                                <div className="flex gap-3 mt-4">
                                    <button onClick={handleAssignAgent} className="px-4 py-2 bg-green-600 text-white rounded-xl">Assign</button>
                                    <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded-xl">Reject</button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </motion.div>
        </>
    );
};

export default ManageApplications;