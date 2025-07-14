import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const QuotePage = () => {
    // Form state
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        coverageAmount: '',
        duration: '10',
        smoker: 'non-smoker',
    });
    const [contribution, setContribution] = useState(null);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Mock contribution calculation (Shariah-compliant, no interest)
    const calculateContribution = () => {
        const { age, coverageAmount, duration, smoker } = formData;
        // Convert coverage amount from lakhs to rupees
        const coverageInRupees = parseFloat(coverageAmount) * 100000;
        const baseRate = 0.00008; // Adjusted base rate for Takaful pool contribution
        const ageFactor = parseInt(age) / 100; // Scales with age
        const durationFactor = parseInt(duration) / 10; // Scales with term length
        const smokerFactor = smoker === 'smoker' ? 1.4 : 1; // Higher contribution for smokers
        // Shariah-compliant: Contribution to Takaful pool, no riba
        const monthlyContribution = (coverageInRupees * baseRate * ageFactor * durationFactor * smokerFactor).toFixed(2);
        const annualContribution = (monthlyContribution * 12).toFixed(2);
        return { monthly: monthlyContribution, annual: annualContribution };
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate form
        if (!formData.age || !formData.coverageAmount) {
            alert('Please fill in all required fields.');
            return;
        }
        if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
            alert('Age must be between 18 and 100.');
            return;
        }
        if (parseFloat(formData.coverageAmount) <= 0) {
            alert('Coverage amount must be greater than 0.');
            return;
        }
        // Calculate and set contribution
        const result = calculateContribution();
        setContribution(result);
    };

    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    return (
        <div className="min-h-screen bg-white">
            <motion.div
                className="max-w-7xl mx-auto px-4 py-16"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                    Get Your Takaful Contribution Quote
                </h1>
                <p className="text-center text-gray-600 text-lg mb-12">
                    Estimate your Shariah-compliant contribution for Takaful coverage, free of riba (interest).
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <motion.div
                        className="bg-white shadow-2xl rounded-3xl p-8 transform hover:shadow-3xl transition-shadow duration-500"
                        variants={cardVariants}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Takaful Quote Estimator</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                    Age <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    id="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="18"
                                    max="100"
                                    required
                                    className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                                    placeholder="Enter your age"
                                />
                                {formData.age && (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) && (
                                    <p className="text-red-600 text-sm mt-2">Age must be between 18 and 100.</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    id="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-700">
                                    Coverage Amount (in Lakhs) <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="coverageAmount"
                                    id="coverageAmount"
                                    value={formData.coverageAmount}
                                    onChange={handleChange}
                                    min="0.1"
                                    step="0.1"
                                    required
                                    className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                                    placeholder="e.g., 20"
                                />
                                {formData.coverageAmount && parseFloat(formData.coverageAmount) <= 0 && (
                                    <p className="text-red-600 text-sm mt-2">Coverage amount must be greater than 0.</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                    Duration (Years)
                                </label>
                                <select
                                    name="duration"
                                    id="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                                >
                                    <option value="10">10 Years</option>
                                    <option value="20">20 Years</option>
                                    <option value="30">30 Years</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="smoker" className="block text-sm font-medium text-gray-700">
                                    Smoker Status
                                </label>
                                <select
                                    name="smoker"
                                    id="smoker"
                                    value={formData.smoker}
                                    onChange={handleChange}
                                    className="mt-2 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                                >
                                    <option value="ettiva。non-smoker">Non-Smoker</option>
                                    <option value="smoker">Smoker</option>
                                </select>
                            </div>
                            <motion.button
                                type="submit"
                                className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-teal-500 rounded-xl hover:from-green-700 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Calculate Contribution
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Contribution Result */}
                    {contribution && (
                        <motion.div
                            className="bg-white shadow-2xl rounded-3xl p-8"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Estimated Takaful Contribution</h2>
                            <p className="text-gray-600 text-base">
                                <span className="font-semibold">Monthly Contribution:</span> ${contribution.monthly}
                            </p>
                            <p className="text-gray-600 text-base">
                                <span className="font-semibold">Annual Contribution:</span> ${contribution.annual}
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                This is a Shariah-compliant estimate based on your inputs, contributing to a mutual Takaful pool with no riba.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/apply"
                                    aria-label="Apply for this Takaful plan"
                                    className="mt-6 inline-block w-full sm:w-auto text-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Apply for Takaful
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default QuotePage;