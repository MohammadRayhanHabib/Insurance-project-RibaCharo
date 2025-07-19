import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Star } from 'lucide-react'; // Ensure Star is imported
import { axiosSecure } from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

export default function MyPoliciesPage() {
    const { user } = useAuth();
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const { data: applications = [], isLoading: isLoadingApplications } = useQuery({
        queryKey: ['myPolicies', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/user/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // Fetch individual policy details based on policyId from applications
    const { data: policies = {}, isLoading: isLoadingPolicies } = useQuery({
        queryKey: ['policies', applications.map(app => app.policyId)], // Use policy IDs as part of the query key
        queryFn: async () => {
            const policyDetails = {};
            for (const app of applications) {
                if (app.policyId && !policyDetails[app.policyId]) { // Fetch only if not already fetched
                    try {
                        const res = await axiosSecure.get(`/policies/${app.policyId}`);
                        policyDetails[app.policyId] = res.data;
                    } catch (error) {
                        console.error(`Failed to fetch policy with ID ${app.policyId}:`, error);
                        policyDetails[app.policyId] = null; // Mark as null if fetch fails
                    }
                }
            }
            return policyDetails;
        },
        enabled: applications.length > 0, // Only enable if there are applications
    });

    const handleReview = (policy) => {
        setSelectedPolicy(policy);
        setIsOpen(true);
    };

    const submitReview = async () => {
        const reviewData = {
            userName: user?.displayName,
            userEmail: user?.email,
            userImg: user?.photoURL,
            policyId: selectedPolicy?.policyId,
            rating,
            feedback,
            date: new Date(),
        };
        try {
            await axiosSecure.post('/reviews', reviewData);

            setIsOpen(false);
            setRating(0);
            setFeedback('');
            Swal.fire({
                toast: 'true',
                position: "top-end",
                icon: "success",
                title: "Review added",
                showConfirmButton: false,
                timer: 1500
            });
            // Optionally, you might want to refetch applications to update the UI
            // queryClient.invalidateQueries(['myPolicies', user?.email]);
        } catch (err) {
            console.error('Review submission failed:', err);
            Swal.fire({
                position: "top-end",
                icon: "warning",
                title: "Failed to add",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const generatePDF = (application) => {
        const doc = new jsPDF();
        const policy = policies[application.policyId]; // Get the policy details

        doc.text('Life Insurance Policy', 14, 20);
        doc.setFontSize(12);

        doc.text(`Applicant: ${application?.personal?.name || 'N/A'}`, 14, 40);
        doc.text(`Email: ${application?.personal?.email || 'N/A'}`, 14, 50);
        doc.text(`Policy Title: ${application?.policyTitle || 'N/A'}`, 14, 60);
        doc.text(`Status: ${application?.status || 'N/A'}`, 14, 70);
        doc.text(
            `Nominee: ${application?.nominee?.name || 'N/A'} (${application?.nominee?.relationship || 'N/A'})`,
            14,
            80
        );
        doc.text(
            `Created At: ${application?.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}`,
            14,
            90
        );

        // Add policy details if available
        if (policy) {
            doc.text('--- Policy Details ---', 14, 110);
            doc.text(`Category: ${policy.category || 'N/A'}`, 14, 120);
            doc.text(`Description: ${policy.description || 'N/A'}`, 14, 130);
            doc.text(`Min Age: ${policy.minAge || 'N/A'}`, 14, 140);
            doc.text(`Max Age: ${policy.maxAge || 'N/A'}`, 14, 150);
            doc.text(`Coverage Range: ${policy.coverageRange || 'N/A'}`, 14, 160);
            doc.text(`Duration Options: ${policy.durationOptions?.join(', ') || 'N/A'}`, 14, 170);
            doc.text(`Base Premium Rate: ${policy.basePremiumRate || 'N/A'}`, 14, 180);
            doc.text(`Benefits: ${policy.benefits?.join(', ') || 'N/A'}`, 14, 190);
            doc.text(`Eligibility: ${policy.eligibility || 'N/A'}`, 14, 200);
            doc.text(`Premium Logic Note: ${policy.premiumLogicNote || 'N/A'}`, 14, 210);
        } else {
            doc.text('Policy details not available.', 14, 11);
        }

        doc.save(`${application?.policyTitle?.replace(/\s+/g, '_') || 'policy'}.pdf`);
    };

    if (isLoadingApplications || isLoadingPolicies) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
                <p className="text-gray-600 ml-3 text-lg">Loading your policies...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-7xl mx-auto p-6 bg-white rounded-3xl shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent mb-6">
                My Policies
            </h1>

            {/* Desktop Table */}
            <div className="overflow-x-auto rounded-xl border hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Headers */}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submit Review</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download Policy</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                            <motion.tr key={app._id} className="hover:bg-gray-50 transition-colors duration-300">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <motion.img
                                        src={app.policyImg || '/default-policy.jpg'}
                                        alt={app.policyTitle}
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-teal-500 hover:border-teal-600 transition-all duration-200"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-800">{app.personal?.name || 'N/A'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-800">{app.policyTitle}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-1 text-sm font-medium rounded-full ${app.status === 'Approved'
                                            ? 'bg-green-100 text-green-800'
                                            : app.status === 'Rejected'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <motion.button
                                        onClick={() => {
                                            setSelectedPolicy(app);
                                            setDetailsOpen(true);
                                        }}
                                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-sm"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Details
                                    </motion.button>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {/* Submit Review Button Logic */}
                                    {/* ✨ MODIFIED: Changed rendering condition to always show the button */}
                                    <motion.button
                                        onClick={() => handleReview(app)}
                                        className={`px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl shadow-lg transition-all duration-300 text-sm ${app.status === 'Pending' || app.status === 'Rejected' ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:from-purple-600 hover:to-indigo-600'
                                            }`}
                                        whileHover={app.status === 'Approved' ? { scale: 1.05 } : {}}
                                        whileTap={app.status === 'Approved' ? { scale: 0.95 } : {}}
                                        disabled={app.status === 'Pending' || app.status === 'Rejected'}
                                    >
                                        Submit Review
                                    </motion.button>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {/* Download Policy Button Logic */}
                                    <motion.button
                                        onClick={() => generatePDF(app)}
                                        className={`px-3 py-1.5 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-lg transition-all duration-300 text-sm ${app.status !== 'Approved' ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:from-green-600 hover:to-teal-600'
                                            }`}
                                        whileHover={app.status === 'Approved' ? { scale: 1.05 } : {}}
                                        whileTap={app.status === 'Approved' ? { scale: 0.95 } : {}}
                                        disabled={app.status !== 'Approved'}
                                    >
                                        Download Policy
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4">
                {applications.map((app) => (
                    <motion.div
                        key={app._id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex flex-col gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02, boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }}
                    >
                        <div className="flex items-center gap-4">
                            <motion.img
                                src={app.policyImg || '/default-policy.jpg'}
                                alt={app.policyTitle}
                                className="w-20 h-20 rounded-xl object-cover border-2 border-teal-500"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800">{app.policyTitle}</h3>
                                <p className="text-sm text-gray-600">Applicant: {app.personal?.name || 'N/A'}</p>
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full mt-1 inline-block ${app.status === 'Approved'
                                        ? 'bg-green-100 text-green-800'
                                        : app.status === 'Rejected'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {app.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <motion.button
                                onClick={() => {
                                    setSelectedPolicy(app);
                                    setDetailsOpen(true);
                                }}
                                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                                whileTap={{ scale: 0.95 }}
                            >
                                Details
                            </motion.button>

                            {/* Mobile Review Button Logic */}
                            {/* ✨ MODIFIED: Changed rendering condition to always show the button */}
                            <motion.button
                                onClick={() => handleReview(app)}
                                className={`px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-md transition-all duration-200 ${app.status === 'Pending' || app.status === 'Rejected' ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-600 hover:to-indigo-600'
                                    }`}
                                whileTap={app.status === 'Approved' ? { scale: 0.95 } : {}}
                                disabled={app.status === 'Pending' || app.status === 'Rejected'}
                            >
                                Review
                            </motion.button>

                            {/* Mobile Download Policy Button Logic */}
                            <motion.button
                                onClick={() => generatePDF(app)}
                                className={`px-3 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md transition-all duration-200 col-span-2 ${app.status !== 'Approved' ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-600 hover:to-teal-600'
                                    }`}
                                whileTap={app.status === 'Approved' ? { scale: 0.95 } : {}}
                                disabled={app.status !== 'Approved'}
                            >
                                Download Policy
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedPolicy && detailsOpen && (
                    <Dialog
                        open={true}
                        onClose={() => setDetailsOpen(false)}
                        className="fixed z-50 inset-0 overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Dialog.Panel className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl transform transition-all duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                                        {selectedPolicy.policyTitle} Details
                                    </Dialog.Title>
                                    <motion.button
                                        onClick={() => setDetailsOpen(false)}
                                        className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X size={24} />
                                    </motion.button>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        <strong>Applicant:</strong> {selectedPolicy.personal?.name || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {selectedPolicy.personal?.email || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Address:</strong> {selectedPolicy.personal?.address || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>NID:</strong> {selectedPolicy.personal?.nid || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Nominee:</strong> {selectedPolicy.nominee?.name || 'N/A'} (
                                        {selectedPolicy.nominee?.relationship || 'N/A'})
                                    </p>
                                    <p>
                                        <strong>Health Disclosure:</strong>{' '}
                                        {selectedPolicy.healthDisclosure?.length
                                            ? selectedPolicy.healthDisclosure.join(', ')
                                            : 'None'}
                                    </p>
                                    <p>
                                        <strong>Created At:</strong>{' '}
                                        {selectedPolicy.createdAt
                                            ? new Date(selectedPolicy.createdAt).toLocaleDateString()
                                            : 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {selectedPolicy.status || 'N/A'}
                                    </p>
                                    <motion.img
                                        src={selectedPolicy.policyImg || '/default-policy.jpg'}
                                        alt={selectedPolicy.policyTitle}
                                        className="w-full h-48 object-cover rounded-xl border-2 border-teal-500 hover:border-teal-600 transition-all duration-200"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.9 }}
                                    />
                                    {/* Display additional policy details in the modal */}
                                    {policies[selectedPolicy.policyId] && (
                                        <>
                                            <h3 className="text-xl font-bold mt-4">Policy Plan Details:</h3>
                                            <p>
                                                <strong>Category:</strong> {policies[selectedPolicy.policyId].category || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Description:</strong> {policies[selectedPolicy.policyId].description || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Min Age:</strong> {policies[selectedPolicy.policyId].minAge || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Max Age:</strong> {policies[selectedPolicy.policyId].maxAge || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Coverage Range:</strong> {policies[selectedPolicy.policyId].coverageRange || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Duration Options:</strong> {policies[selectedPolicy.policyId].durationOptions?.join(', ') || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Base Premium Rate:</strong> {policies[selectedPolicy.policyId].basePremiumRate || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Benefits:</strong> {policies[selectedPolicy.policyId].benefits?.join(', ') || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Eligibility:</strong> {policies[selectedPolicy.policyId].eligibility || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Premium Logic Note:</strong> {policies[selectedPolicy.policyId].premiumLogicNote || 'N/A'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {selectedPolicy && isOpen && (
                    <Dialog
                        open={true}
                        onClose={() => setIsOpen(false)}
                        className="fixed z-50 inset-0 overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl transform transition-all duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                                        Submit Review for {selectedPolicy.policyTitle}
                                    </Dialog.Title>
                                    <motion.button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X size={24} />
                                    </motion.button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.div key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                                <Star
                                                    onClick={() => setRating(star)}
                                                    className={`cursor-pointer w-8 h-8 ${rating >= star ? 'text-yellow-400 ' : 'text-gray-300'
                                                        } transition-colors duration-200`}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 "
                                        rows={4}
                                        placeholder="Share your thoughts..."
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <motion.button
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-2 bg-gray-400 text-white rounded-xl shadow-md hover:shadow-lg hover:bg-gray-500 transition-all duration-200"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            onClick={submitReview}
                                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            disabled={!rating || !feedback}
                                        >
                                            Submit Review
                                        </motion.button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
