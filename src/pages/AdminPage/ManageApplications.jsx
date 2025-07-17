import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { axiosSecure } from '../../hooks/useAxiosSecure';
import LoadingSpinner from '../../components/Shared/Spinner/LoadingSpinner';

const ManageApplications = () => {
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications');
            return res.data || [];
        },
    });

    const { data: agents = [] } = useQuery({
        queryKey: ['agents'],
        queryFn: async () => {
            const res = await axiosSecure.get('/agents');
            return res.data || [];
        },
    });

    const updateApplication = useMutation({
        mutationFn: async ({ id, updates }) => {
            const res = await axiosSecure.patch(`/applications/${id}`, updates);

            // Optional logic to update policy purchase count
            if (updates.status === 'Approved' && res.data.policyId) {
                await axiosSecure.patch(`/policies/${res.data.policyId}`, {
                    purchaseCount: (res.data.purchaseCount || 0) + 1,
                });
            }

            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            setSelectedApp(null);
            setSelectedAgent('');
            setSelectedStatus('');
        },
        onError: (error) => {
            console.error('Mutation error:', error.message);
        },
    });

    const handleAssignAgent = () => {
        if (!selectedApp || !selectedAgent) return;
        updateApplication.mutate({
            id: selectedApp._id,
            updates: { agentId: selectedAgent, status: selectedStatus || 'Assigned' },
        });
    };

    const handleReject = () => {
        if (!selectedApp) return;
        updateApplication.mutate({ id: selectedApp._id, updates: { status: 'Rejected' } });
    };

    const handleStatusChange = () => {
        if (!selectedApp || !selectedStatus) return;
        updateApplication.mutate({
            id: selectedApp._id,
            updates: { status: selectedStatus },
        });
    };

    if (isLoading) return <LoadingSpinner />;
    if (error) return <p className="text-red-600 text-center">Error: {error.message}</p>;

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

                {/* Table for desktop */}
                <div className="overflow-x-auto">
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
                            {applications.map(app => (
                                <tr key={app._id} className="hover:bg-gray-50 transition-all">
                                    <td className="px-4 py-4 flex items-center gap-2">
                                        <img src={app.personal?.userImg} alt="" className="w-10 h-10 rounded-full border border-teal-500" />
                                        {app.personal?.name}
                                    </td>
                                    <td className="px-4 py-4">{app.personal?.email}</td>
                                    <td className="px-4 py-4">{app.policyTitle}</td>
                                    <td className="px-4 py-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={`px-3 py-1 text-sm font-medium rounded-full ${app.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : app.status === 'Approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <motion.button
                                            onClick={() => setSelectedApp(app)}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow hover:from-blue-600 hover:to-cyan-600"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            View Details
                                        </motion.button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modal for application details */}
                {selectedApp && (
                    <Dialog open={true} onClose={() => setSelectedApp(null)} className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-2xl font-bold text-gray-800">
                                        {selectedApp?.personal?.name}'s Application
                                    </Dialog.Title>
                                    <button onClick={() => setSelectedApp(null)}>
                                        <X className="text-gray-500 hover:text-red-500 transition" />
                                    </button>
                                </div>

                                <div className="space-y-3 text-gray-700">
                                    <p><strong>Email:</strong> {selectedApp?.personal?.email}</p>
                                    <p><strong>Address:</strong> {selectedApp?.personal?.address}</p>
                                    <p><strong>NID:</strong> {selectedApp?.personal?.nid}</p>
                                    <p><strong>Nominee:</strong> {selectedApp?.nominee?.name} ({selectedApp?.nominee?.relationship})</p>
                                    <p><strong>Health:</strong> {selectedApp?.healthDisclosure?.join(', ') || 'None'}</p>
                                    <p><strong>Policy:</strong> {selectedApp?.policyTitle}</p>
                                    <img src={selectedApp?.policyImg} alt="Policy" className="rounded-xl w-full h-32 object-cover border mt-2" />

                                    <select
                                        value={selectedAgent}
                                        onChange={(e) => setSelectedAgent(e.target.value)}
                                        className="w-full mt-4 px-3 py-2 border rounded-xl"
                                    >
                                        <option value="">Select Agent</option>
                                        {agents.map(agent => (
                                            <option key={agent._id} value={agent._id}>{agent.name}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full mt-2 px-3 py-2 border rounded-xl"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>

                                    <div className="flex flex-wrap gap-3 mt-4">
                                        <motion.button
                                            onClick={handleAssignAgent}
                                            disabled={!selectedAgent}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow hover:from-green-600 hover:to-teal-600"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Assign
                                        </motion.button>
                                        <motion.button
                                            onClick={handleReject}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white shadow hover:from-red-600 hover:to-rose-600"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Reject
                                        </motion.button>
                                        <motion.button
                                            onClick={handleStatusChange}
                                            disabled={!selectedStatus}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow hover:from-blue-600 hover:to-cyan-600"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Update Status
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </motion.div>
        </>
    );
};

export default ManageApplications;
