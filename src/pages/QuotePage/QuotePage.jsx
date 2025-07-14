import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router';
import { axiosSecure } from '../../hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
// import { FaSpinner } from 'react-icons/fa';
// import { Loader2 } from 'lucide-react';
import LoadingSpinner from '../../components/Shared/Spinner/LoadingSpinner';
const QuotePage = () => {
    const { id } = useParams();

    const { data: policy = {}, isLoading, error } = useQuery({
        queryKey: ['policy', id],
        queryFn: () => axiosSecure.get(`/policies/${id}`).then(res => res.data),
    });

    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        coverageAmount: '',
        duration: policy.durationOptions ? policy.durationOptions[0] : 10,
        smoker: 'non-smoker',
    });

    const [contribution, setContribution] = useState(null);
    const [errors, setErrors] = useState({});

    // Parse coverage range into min and max numbers
    const parseCoverageRange = (rangeStr) => {
        if (!rangeStr) return { min: 0, max: Infinity };
        const parts = rangeStr.split('–').map(s => s.trim().replace(/,/g, ''));
        return {
            min: Number(parts[0]) || 0,
            max: Number(parts[1]) || Infinity,
        };
    };

    const coverageLimits = parseCoverageRange(policy.coverageRange);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const newErrors = {};
        const age = Number(formData.age);
        const coverage = Number(formData.coverageAmount) * 1; // rupees assumed

        if (!age || age < policy.minAge || age > policy.maxAge) {
            newErrors.age = `Age must be between ${policy.minAge} and ${policy.maxAge}`;
        }
        if (!coverage || coverage < coverageLimits.min || coverage > coverageLimits.max) {
            newErrors.coverageAmount = `Coverage must be between ${coverageLimits.min.toLocaleString()} and ${coverageLimits.max.toLocaleString()}`;
        }
        if (!policy.durationOptions?.includes(Number(formData.duration))) {
            newErrors.duration = 'Invalid duration selected';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateContribution = () => {
        if (!validate()) {
            setContribution(null);
            return;
        }
        const coverage = Number(formData.coverageAmount);
        const ageFactor = Number(formData.age) / 100;
        const durationFactor = Number(formData.duration) / 10;
        const smokerFactor = formData.smoker === 'smoker' ? 1.4 : 1;
        const baseRate = policy.basePremiumRate || 0.00008;

        // Calculate monthly and annual contribution (assuming coverageAmount in lakhs)
        const coverageInRupees = coverage * 100000;
        const monthlyContribution = (coverageInRupees * baseRate * ageFactor * durationFactor * smokerFactor).toFixed(2);
        const annualContribution = (monthlyContribution * 12).toFixed(2);

        setContribution({ monthly: monthlyContribution, annual: annualContribution });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateContribution();
    };

    if (isLoading) {
        return <LoadingSpinner></LoadingSpinner>
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-red-600 text-xl">Error loading policy: {error.message}</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>NeoTakaful | {policy.title} Quote</title>
            </Helmet>
            <motion.div
                className="max-w-4xl mx-auto p-8 bg-white rounded-3xl shadow-2xl my-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500 mb-4">
                    {policy.title} - Takaful Quote
                </h1>
                <p className="mb-8 text-gray-600 text-lg">{policy.description}</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Age */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Age (Between {policy.minAge} and {policy.maxAge}) *
                        </label>
                        <motion.input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min={policy.minAge}
                            max={policy.maxAge}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-green-600 to-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 placeholder-gray-400"
                            placeholder="Enter your age"
                            required
                            whileFocus={{ scale: 1.02 }}
                        />
                        {errors.age && <p className="text-red-600 text-sm mt-2">{errors.age}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                        <motion.select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-green-600 to-teal-500 transition-all duration-300 bg-gray-50 text-gray-800"
                            whileFocus={{ scale: 1.02 }}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </motion.select>
                    </div>

                    {/* Coverage Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Coverage Amount (Between {coverageLimits.min.toLocaleString()} and {coverageLimits.max.toLocaleString()}) *
                        </label>
                        <motion.input
                            type="number"
                            name="coverageAmount"
                            value={formData.coverageAmount}
                            onChange={handleChange}
                            min={coverageLimits.min}
                            max={coverageLimits.max}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-green-600 to-teal-500 transition-all duration-300 bg-gray-50 text-gray-800 placeholder-gray-400"
                            placeholder="Enter coverage amount"
                            required
                            whileFocus={{ scale: 1.02 }}
                        />
                        {errors.coverageAmount && <p className="text-red-600 text-sm mt-2">{errors.coverageAmount}</p>}
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Years)</label>
                        <motion.select
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-green-600 to-teal-500 transition-all duration-300 bg-gray-50 text-gray-800"
                            whileFocus={{ scale: 1.02 }}
                        >
                            {policy.durationOptions?.map((dur) => (
                                <option key={dur} value={dur}>
                                    {dur} Years
                                </option>
                            ))}
                        </motion.select>
                        {errors.duration && <p className="text-red-600 text-sm mt-2">{errors.duration}</p>}
                    </div>

                    {/* Smoker */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Smoker Status</label>
                        <motion.select
                            name="smoker"
                            value={formData.smoker}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-green-600 to-teal-500 transition-all duration-300 bg-gray-50 text-gray-800"
                            whileFocus={{ scale: 1.02 }}
                        >
                            <option value="non-smoker">Non-Smoker</option>
                            <option value="smoker">Smoker</option>
                        </motion.select>
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-xl font-semibold text-lg hover:bg-gradient-to-r hover:from-green-700 hover:to-teal-600 transition-all duration-300 shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Calculate Contribution
                    </motion.button>
                </form>

                {contribution && (
                    <motion.div
                        className="mt-8 p-8 bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Estimated Takaful Contribution</h2>
                        <p className="text-lg">
                            Monthly: <span className="font-bold text-green-600">৳{contribution.monthly}</span>
                        </p>
                        <p className="text-lg">
                            Annual: <span className="font-bold text-green-600">৳{contribution.annual}</span>
                        </p>
                        <p className="mt-4 text-sm text-gray-600">
                            This is a Shariah-compliant estimate based on your inputs, contributing to a mutual Takaful pool with no riba.
                        </p>
                        <Link
                            to={`/apply/${id}`}
                            className="inline-block mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all duration-300"
                        >
                            Apply for this Plan
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </>
    );
};

export default QuotePage;
