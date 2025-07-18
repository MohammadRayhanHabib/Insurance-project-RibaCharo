import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';

import { Loader2, X } from 'lucide-react'; // Assuming Loader2 is your spinner
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { axiosSecure } from '../../hooks/useAxiosSecure';


const ManageApplications = () => {
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null); // State for the application opened in the modal

    // Query to fetch all applications
    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const res = await axiosSecure.get('/applications'); // Fetch all applications
            return res.data || [];
        },
    });

    // Query to fetch all agents (for the assign agent dropdown)
    const { data: agents = [] } = useQuery({
        queryKey: ['agents'],
        queryFn: async () => {
            const res = await axiosSecure.get('/agents'); // Fetch all agents
            console.log(res.data);
            return res.data || [];

        },
    });

    // Mutation to update an application (status, and trigger dataForAgents)
    const updateApplication = useMutation({
        mutationFn: async ({ id, updatesForApplicationUpdate, agentIdForDataForAgents }) => {
            // Send patch request to update the application status ONLY.
            // This endpoint remains EXACTLY as you specified, it only takes 'status'.
            const res = await axiosSecure.patch(`/applicationUpdate/${id}`, updatesForApplicationUpdate);

            // We are NOT relying on 'res.data' from this patch for full application details.
            // We will fetch the full data separately in onSuccess.
            return {
                patchResult: res.data,
                originalUpdates: updatesForApplicationUpdate, // Store original updates (e.g., status)
                applicationId: id,
                agentIdForDataForAgents: agentIdForDataForAgents // Pass agentId separately for dataForAgents
            };
        },
        onSuccess: async (data) => {
            // Invalidate 'applications' query to refetch data and update UI
            queryClient.invalidateQueries(['applications']);

            const { originalUpdates, applicationId, agentIdForDataForAgents } = data;
            // console.log(data);

            // --- IMPORTANT: Fetch the full application data AFTER the patch operation ---
            // This is necessary because your /applicationUpdate/:id endpoint does not return the full document.
            let fullApplicationData = null;
            try {
                // This GET request is crucial to get all the personal, nominee, policy details.
                const fetchRes = await axiosSecure.get(`/applications/${applicationId}`);
                fullApplicationData = fetchRes.data;
                // console.log("Fetched full application data for dataForAgents:", fullApplicationData); // Debugging: Check this log!
            } catch (fetchError) {
                console.error('Error fetching full application data after update:', fetchError.message);
                // If we can't get the full data, we cannot proceed with dataForAgents.
                setSelectedApp(null); // Close modal even on error
                return; // Exit if we can't get the full data
            }

            // --- Logic to create/update entry in dataForAgents if an agent was assigned ---
            // This will only run if an agentId was provided for dataForAgents AND we successfully fetched full data.
            if (agentIdForDataForAgents && fullApplicationData) {
                // Find the agent's name and email from the 'agents' query data
                const assignedAgent = agents.find(agent => agent._id === agentIdForDataForAgents);

                // Prepare data for the dataForAgents collection with ALL required fields
                const agentAssignmentData = {
                    applicationId: fullApplicationData._id, // Use ID from the fetched full data
                    agentId: agentIdForDataForAgents, // Use the agentId passed specifically for this purpose
                    agentName: assignedAgent?.name || 'Unknown Agent', // Include agent's name
                    agentEmail: assignedAgent?.email || 'Unknown Email', // Include agent's email
                    customerName: fullApplicationData.personal?.name,
                    customerEmail: fullApplicationData.personal?.email,
                    policyTitle: fullApplicationData.policyTitle,
                    // Initial status for the agent's view is 'Pending'
                    status: 'Pending', // This is the status for the agent's view
                    assignedAt: new Date().toISOString(), // Timestamp of assignment
                    // Include full personal and nominee details for agent's 'View Details' modal
                    personal: fullApplicationData.personal,
                    nominee: fullApplicationData.nominee,
                    healthDisclosure: fullApplicationData.healthDisclosure,
                    policyImg: fullApplicationData.policyImg,
                };

                try {
                    // Send POST request to create/update the agent assignment record
                    await axiosSecure.post('/dataForAgents', agentAssignmentData);
                    console.log(`Agent assignment for application ${applicationId} recorded in dataForAgents.`);
                } catch (assignError) {
                    console.error('Error recording agent assignment in dataForAgents:', assignError.message);
                    // You might want to add a user-friendly toast notification here
                }
            }

            // --- Optional: Logic to increment policy purchase count if status becomes 'Approved' ---
            // This logic was previously here but has been removed as per your request.
            // if (originalUpdates.status === 'Approved' && fullApplicationData?.policyId) {
            //     try {
            //         await axiosSecure.patch(`/policies/${fullApplicationData.policyId}`, {
            //             purchaseCount: (fullApplicationData.purchaseCount || 0) + 1,
            //         });
            //         console.log(`Policy purchase count for policy ${fullApplicationData.policyId} incremented.`);
            //     } catch (policyError) {
            //         console.error('Error incrementing policy purchase count:', policyError.message);
            //     }
            // }

            // Close modal if it was open
            setSelectedApp(null);
        },
        onError: (mutationError) => {
            console.error('Mutation error:', mutationError.message);
            // You might want to add a user-friendly toast notification here
        },
    });

    // Handler for assigning an agent directly from the table row/card
    const handleAssignAgentInRow = (appId, agentId, currentStatus) => {
        if (!agentId) return; // If "Assign Agent" (empty value) is selected

        // Prevent action if application is already Approved or Rejected
        if (currentStatus === 'Approved' || currentStatus === 'Rejected') {
            console.warn(`Cannot assign agent to application ${appId}: status is ${currentStatus}.`);
            return;
        }

        // --- CRITICAL CHANGE HERE: ONLY send status to /applicationUpdate/:id ---
        // Pass agentId separately so it's available in onSuccess for dataForAgents.
        updateApplication.mutate({
            id: appId,
            updatesForApplicationUpdate: { status: 'Approved' }, // Only status sent to your patch endpoint
            agentIdForDataForAgents: agentId // AgentId passed separately for dataForAgents
        });
    };

    // Handler for rejecting an application directly from the table row/card
    const handleRejectInRow = (appId, currentStatus) => {
        // Prevent action if application is already Approved or Rejected
        if (currentStatus === 'Approved' || currentStatus === 'Rejected') {
            console.warn(`Cannot reject application ${appId}: status is ${currentStatus}.`);
            return;
        }
        // Only status is sent for rejection
        updateApplication.mutate({
            id: appId,
            updatesForApplicationUpdate: { status: 'Rejected' },
            agentIdForDataForAgents: null // No agent assigned on rejection
        });
    };

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
                <p className="text-gray-600 ml-3 text-lg">Loading applications...</p>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-600 text-center">Error fetching applications: {error.message}</p>;
    }

    return (
        <>
            <Helmet>
                <title>NeoTakaful | Manage Applications</title>
            </Helmet>

            <motion.div
                className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-2xl" // Adjusted padding for smaller screens
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent mb-6">
                    Manage Applications
                </h1>

                {/* Desktop Table */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {/* Responsive padding and font size for headers */}
                                <th className="px-3 py-3 text-left text-xs sm:px-4 sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Applicant</th>
                                <th className="px-3 py-3 text-left text-xs sm:px-4 sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Email</th>
                                <th className="px-3 py-3 text-left text-xs sm:px-4 sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Policy</th>
                                <th className="px-3 py-3 text-left text-xs sm:px-4 sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Date</th>
                                <th className="px-3 py-3 text-left text-xs sm:px-4 sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Status</th>
                                <th className="px-3 py-3 text-left text-xs sm:px-4 sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map(app => (
                                <tr key={app._id} className="hover:bg-gray-50 transition-all">
                                    <td className="px-3 py-4 flex items-center gap-2 sm:px-4">
                                        <img src={app.personal?.userImg || `https://placehold.co/40x40/E0F2F7/000?text=${app.personal?.name?.charAt(0) || 'U'}`} alt={app.personal?.name || 'User'} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-teal-500" />
                                        <span className="text-sm sm:text-base whitespace-nowrap">{app.personal?.name}</span>
                                    </td>
                                    <td className="px-3 py-4 text-xs sm:px-4 sm:text-sm truncate">{app.personal?.email}</td>
                                    <td className="px-3 py-4 text-xs sm:px-4 sm:text-sm whitespace-nowrap">{app.policyTitle}</td>
                                    <td className="px-3 py-4 text-xs sm:px-4 sm:text-sm whitespace-nowrap">{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td className="px-3 py-4 sm:px-4">
                                        <span
                                            className={`px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm font-medium rounded-full ${app.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : app.status === 'Approved' || app.status === 'Assigned'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {app.status}
                                        </span>
                                    </td>
                                    {/* Actions Column - Now with inline controls and responsive layout */}
                                    <td className="px-3 py-4 sm:px-4">
                                        <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center">
                                            {/* Assign Agent Dropdown */}
                                            <select
                                                value={app.agentId || ''} // Display currently assigned agent
                                                onChange={(e) => handleAssignAgentInRow(app._id, e.target.value, app.status)}
                                                className="flex-grow px-2 py-1 border rounded-md text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500 min-w-[100px] sm:min-w-[120px]"
                                                disabled={app.status === 'Approved' || app.status === 'Rejected' || updateApplication.isLoading}
                                            >
                                                <option value="">
                                                    {app.agentId ? `Assigned: ${agents.find(a => a._id === app.agentId)?.name || 'Unknown Agent'}` : 'Assign Agent'}
                                                </option>
                                                {agents.map(agent => (
                                                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                                                ))}
                                            </select>

                                            {/* Reject Button */}
                                            <motion.button
                                                onClick={() => handleRejectInRow(app._id, app.status)}
                                                className="flex-grow px-2 py-1 rounded-md bg-red-500 text-white text-xs sm:text-sm shadow hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                disabled={app.status === 'Approved' || app.status === 'Rejected' || updateApplication.isLoading}
                                            >
                                                Reject
                                            </motion.button>

                                            {/* View Details Button */}
                                            <motion.button
                                                onClick={() => setSelectedApp(app)} // Still opens the modal
                                                className="flex-grow px-2 py-1 rounded-md bg-blue-500 text-white text-xs sm:text-sm shadow hover:bg-blue-600 whitespace-nowrap"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Details
                                            </motion.button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden flex flex-col gap-3">
                    {applications.map(app => {
                        const isApprovedOrRejected = app.status === 'Approved' || app.status === 'Rejected';

                        return (
                            <motion.div
                                key={app._id}
                                whileHover={!isApprovedOrRejected ? { scale: 1.02 } : {}} // Slightly less aggressive hover for cards
                                whileTap={!isApprovedOrRejected ? { scale: 0.98 } : {}} // Slightly less aggressive tap for cards
                                onClick={!isApprovedOrRejected ? () => setSelectedApp(app) : undefined} // Open modal on card click
                                className={`w-full p-4 rounded-2xl shadow-md border flex flex-col gap-2 transition-all ${isApprovedOrRejected
                                    ? 'bg-gray-100 cursor-not-allowed opacity-80'
                                    : 'bg-white hover:shadow-lg'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={app.personal?.userImg || `https://placehold.co/56x56/E0F2F7/000?text=${app.personal?.name?.charAt(0) || 'U'}`}
                                        alt={app.personal?.name || 'User'}
                                        className="w-14 h-14 rounded-full border-2 border-green-500 shadow-md"
                                    />
                                    <div className="flex-1 text-left">
                                        <p className="font-semibold text-lg text-gray-800">{app.personal?.name}</p>
                                        <p className="text-sm text-gray-500 break-all">{app.personal?.email}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                    <span
                                        className={`text-sm px-3 py-1 rounded-full capitalize font-medium ${app.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : app.status === 'Approved' || app.status === 'Assigned'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {app.status}
                                    </span>
                                    <span className="text-sm text-gray-500 whitespace-nowrap">
                                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {/* Actions for Mobile Card */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <select
                                        value={app.agentId || ''}
                                        onChange={(e) => handleAssignAgentInRow(app._id, e.target.value, app.status)}
                                        className="flex-grow px-2 py-1 border rounded-md text-xs focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isApprovedOrRejected || updateApplication.isLoading}
                                        onClick={(e) => e.stopPropagation()} // Prevent card click when dropdown is interacted
                                    >
                                        <option value="">
                                            {app.agentId ? `Assigned: ${agents.find(a => a._id === app.agentId)?.name || 'Unknown Agent'}` : 'Assign Agent'}
                                        </option>
                                        {agents.map(agent => (
                                            <option key={agent._id} value={agent._id}>{agent.name}</option>
                                        ))}
                                    </select>

                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); handleRejectInRow(app._id, app.status); }} // Stop propagation
                                        className="flex-grow px-2 py-1 rounded-md bg-red-500 text-white text-xs shadow hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={isApprovedOrRejected || updateApplication.isLoading}
                                    >
                                        Reject
                                    </motion.button>

                                    <motion.button
                                        onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }} // Stop propagation
                                        className="flex-grow px-2 py-1 rounded-md bg-blue-500 text-white text-xs shadow hover:bg-blue-600 whitespace-nowrap"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Details
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Modal for application details (no longer contains action buttons) */}
                {selectedApp && (
                    <Dialog open={true} onClose={() => setSelectedApp(null)} className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
                            >
                                <X size={24} />
                            </button>

                            <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">
                                {selectedApp?.personal?.name}'s Application
                            </Dialog.Title>

                            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                                <p><strong>Email:</strong> {selectedApp?.personal?.email}</p>
                                <p><strong>Address:</strong> {selectedApp?.personal?.address}</p>
                                <p><strong>NID:</strong> {selectedApp?.personal?.nid}</p>
                                <p><strong>Nominee:</strong> {selectedApp?.nominee?.name} ({selectedApp?.nominee?.relationship})</p>
                                <p><strong>Health:</strong> {selectedApp?.healthDisclosure?.join(', ') || 'None'}</p>
                                <p><strong>Policy:</strong> {selectedApp?.policyTitle}</p>
                                {selectedApp?.policyImg && (
                                    <img src={selectedApp.policyImg} alt="Policy" className="rounded-xl w-full h-32 object-cover border mt-2" />
                                )}
                                <p><strong>Current Status:</strong> <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full ${selectedApp.status === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : selectedApp.status === 'Approved' || selectedApp.status === 'Assigned'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {selectedApp.status}
                                </span></p>
                                {selectedApp.agentId && <p><strong>Assigned Agent:</strong> {agents.find(a => a._id === selectedApp.agentId)?.name || selectedApp.agentId}</p>}
                            </div>
                        </motion.div>
                    </Dialog>
                )}
            </motion.div>
        </>
    );
};

export default ManageApplications;
