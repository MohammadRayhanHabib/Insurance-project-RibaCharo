import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { axiosSecure } from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const ApplicationFormPage = () => {
    const { id } = useParams()
    const { data: policy, isLoading, refetch } = useQuery({
        queryKey: ['policy', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/policies/${id}`);
            return res.data;
        },
    });
    // console.log(policy);

    const navigate = useNavigate();
    const { user } = useAuth()

    // console.log(policy?.image, policy?.title, policy?._id);

    const [formData, setFormData] = useState({
        policyId: '',
        policyTitle: '',
        policyImg: '',
        personal: {
            name: '',
            email: user?.email,
            userImg: user?.photoURL,
            address: '',
            nid: ''
        },
        nominee: { name: '', relationship: '' },
        healthDisclosure: [],
    });

    // Update formData when policy data is loaded
    useEffect(() => {
        if (policy) {
            setFormData((prev) => ({
                ...prev,
                policyId: policy?._id,
                policyTitle: policy?.title,
                policyImg: policy?.image,
            }));
        }
    }, [policy]);

    // console.log(formData.policyId); //policyId == undefined

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');
        setFormData((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };

    const handleHealthChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            healthDisclosure: checked
                ? [...prev.healthDisclosure, value]
                : prev.healthDisclosure.filter((item) => item !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const { personal, nominee } = formData;


        if (
            !personal.name ||

            !personal.address ||
            !personal.nid ||
            !nominee.name ||
            !nominee.relationship
        ) {
            setError('Please fill in all required fields.');
            setIsSubmitting(false);
            return;
        }


        try {
            await axiosSecure.post('/applications', {
                ...formData,
                createdAt: new Date().toISOString(),
            });


            Swal.fire({
                title: 'Application Submitted!',
                text: 'Your Takaful application has been received. Status: Pending.',
                icon: 'success',
                confirmButtonColor: '#10B981',
                confirmButtonText: 'OK'
            }).then(() => {
                // navigate('/dashboard');
            });

        } catch (err) {
            setError('Error submitting application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }


    };

    // console.log(policy)
    console.log(formData);

    return (
        <div className="min-h-screen bg-white py-16 px-4">


            <motion.div
                className="max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >


                <h1 className="text-center text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 text-transparent bg-clip-text mb-8">
                    Apply for {policy?.title} Plan
                </h1>
                <p className="text-center text-gray-600 text-lg mb-10 ">
                    Fill the form below to apply for a halal, interest-free insurance plan.
                </p>

                <form

                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-8 space-y-10"
                >
                    {error && <p className="text-red-600 font-medium text-sm">{error}</p>}

                    {/* Personal Info */}
                    <section>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">👤 Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-600">Full Name *</label>
                                <input
                                    type="text"
                                    name="personal.name"
                                    defaultValue={user?.displayName}
                                    // value={user?.displayName}
                                    onChange={handleChange}
                                    className="input-style"
                                    placeholder="Your full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Email *</label>
                                <input
                                    type="email"
                                    disabled

                                    name="personal.email"
                                    value={user?.email}
                                    onChange={handleChange}
                                    className="input-style cursor-not-allowed"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600">Address *</label>
                                <textarea
                                    name="personal.address"
                                    rows={3}
                                    value={formData.personal.address}
                                    onChange={handleChange}
                                    className="input-style"
                                    placeholder="Your address"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">NID / Aadhaar Number *</label>
                                <input
                                    type="text"
                                    name="personal.nid"
                                    value={formData.personal.nid}
                                    onChange={handleChange}
                                    className="input-style"
                                    placeholder="National ID"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Nominee Info */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">👥 Nominee Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-600">Nominee Name *</label>
                                <input
                                    type="text"
                                    name="nominee.name"
                                    value={formData.nominee.name}
                                    onChange={handleChange}
                                    className="input-style"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Relationship *</label>
                                <select
                                    name="nominee.relationship"
                                    value={formData.nominee.relationship}
                                    onChange={handleChange}
                                    className="input-style"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="spouse">Spouse</option>
                                    <option value="child">Child</option>
                                    <option value="parent">Parent</option>
                                    <option value="sibling">Sibling</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Health Disclosure */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🩺 Health Conditions</h2>
                        <p className="text-gray-500 text-sm mb-2">Select if you have any of the following:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {['Diabetes', 'Heart Disease', 'Hypertension', 'Cancer', 'Respiratory Issues', 'None'].map((cond) => (
                                <label key={cond} className="inline-flex items-center gap-2 text-gray-700">
                                    <input
                                        type="checkbox"
                                        value={cond}
                                        checked={formData.healthDisclosure.includes(cond)}
                                        onChange={handleHealthChange}
                                        className="text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    {cond}
                                </label>
                            ))}
                            <div className="max-w-md mx-auto my-12 p-6 bg-gray-300 rounded-xl shadow-lg flex items-center gap-6">

                                {/* Policy Image */}
                                <img
                                    src={policy?.image}
                                    alt={policy?.title}
                                    className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                                />

                                {/* Title & Category */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{policy?.title}</h2>
                                    <p className="mt-2 text-sm font-semibold uppercase text-green-600">{policy?.category}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full mt-6 px-6 py-3 text-white font-bold rounded-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600 shadow-lg ${isSubmitting && 'opacity-60 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ApplicationFormPage;
