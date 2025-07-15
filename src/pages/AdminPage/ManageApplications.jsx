import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Helmet } from 'react-helmet';
import { Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { axiosSecure } from '../../hooks/useAxiosSecure';

const ManageApplications = () => {
    const queryClient = useQueryClient();
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedAppId, setSelectedAppId] = useState(null);

    // Fetch applications
    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications');
            return res.data;
        },
    });

    // Fetch agents for dropdown
    const { data: agents = [] } = useQuery({
        queryKey: ['agents'],
        queryFn: async () => {
            const res = await axiosSecure.get('/agents');
            return res.data;
        },
    });

    // Mutation for updating application status or agent assignment
    const updateApplication = useMutation({
        mutationFn: async ({ id, updates }) => {
            const res = await axiosSecure.patch(`/applications/${id}`, updates);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            Swal.fire({
                title: 'Success!',
                text: 'Application updated successfully.',
                icon: 'success',
                confirmButtonColor: '#10B981',
                confirmButtonText: 'OK',
            });
        },
        onError: (error) => {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to update application.',
                icon: 'error',
                confirmButtonColor: '#EF4444',
                confirmButtonText: 'OK',
            });
        },
    });

    const handleAssignAgent = (id) => {
        if (!selectedAgent) {
            Swal.fire({
                title: 'Warning!',
                text: 'Please select an agent.',
                icon: 'warning',
                confirmButtonColor: '#F59E0B',
                confirmButtonText: 'OK',
            });
            return;
        }
        updateApplication.mutate({ id, updates: { agentId: selectedAgent, status: 'Assigned' } });
        setSelectedAppId(null);
    };

    const handleReject = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will reject the application.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#D1D5DB',
            confirmButtonText: 'Yes, reject it!',
        }).then((result) => {
            if (result.isConfirmed) {
                updateApplication.mutate({ id, updates: { status: 'Rejected' } });
            }
        });
    };

    const handleViewDetails = (application) => {
        Swal.fire({
            title: `${application.personal.name}'s Application`,
            html: `
        <div className="text-left">
          <p><strong>Email:</strong> ${application.personal.email}</p>
          <p><strong>Address:</strong> ${application.personal.address}</p>
          <p><strong>NID:</strong> ${application.personal.nid}</p>
          <p><strong>Nominee:</strong> ${application.nominee.name} (${application.nominee.relationship})</p>
          <p><strong>Health Disclosure:</strong> ${application.healthDisclosure.join(', ') || 'None'}</p>
          <img src="${application.personal.userImg}" alt="${application.personal.name}'s photo" className="w-32 h-32 object-cover rounded-lg mt-2" />
        </div>
      `,
            icon: 'info',
            confirmButtonColor: '#10B981',
            confirmButtonText: 'Close',
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
            </div>
        );
    }

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
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 md:px-6">Applicant Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 md:px-6">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 md:px-6">Policy Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 md:px-6">Application Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 md:px-6">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 md:px-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap md:px-6">
                                        <div className="flex items-center">
                                            <img
                                                src={app.personal.userImg}
                                                alt={`${app.personal.name}'s photo`}
                                                className="w-10 h-10 rounded-full mr-2 object-cover"
                                            />
                                            {app.personal.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap md:px-6">{app.personal.email}</td>
                                    <td className="px-4 py-4 whitespace-nowrap md:px-6">{app.policyTitle}</td>
                                    <td className="px-4 py-4 whitespace-nowrap md:px-6">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap md:px-6">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${app.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : app.status === 'Approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap md:px-6">
                                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                                            <motion.button
                                                onClick={() => {
                                                    setSelectedAppId(app._id);
                                                    setSelectedAgent(app.agentId || '');
                                                }}
                                                className="w-full sm:w-auto px-3 py-1 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Assign Agent
                                            </motion.button>
                                            {selectedAppId === app._id && (
                                                <select
                                                    value={selectedAgent}
                                                    onChange={(e) => setSelectedAgent(e.target.value)}
                                                    className="w-full sm:w-auto p-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                                >
                                                    <option value="">Select Agent</option>
                                                    {agents.map((agent) => (
                                                        <option key={agent._id} value={agent._id}>
                                                            {agent.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {selectedAppId === app._id && (
                                                <motion.button
                                                    onClick={() => handleAssignAgent(app._id)}
                                                    className="w-full sm:w-auto px-3 py-1 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Confirm
                                                </motion.button>
                                            )}
                                            <motion.button
                                                onClick={() => handleReject(app._id)}
                                                className="w-full sm:w-auto px-3 py-1 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Reject
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleViewDetails(app)}
                                                className="w-full sm:w-auto px-3 py-1 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                View Details
                                            </motion.button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
};

export default ManageApplications;