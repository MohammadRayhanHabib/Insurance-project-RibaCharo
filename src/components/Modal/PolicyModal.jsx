// src/components/Modal/PolicyModal.jsx
import React, { useState } from 'react'; // No need for `useEffect` here anymore
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogPanel, DialogOverlay, DialogTitle } from '@headlessui/react';
import { X, PlusCircle, Loader2 } from 'lucide-react';

const PolicyModal = ({ isOpen, onClose, policyData, onSubmit, isMutating }) => {
    // Initialize formData directly from policyData or empty object.
    // The function ensures this runs only on initial mount (or re-mount due to key change).
    const [formData, setFormData] = useState(() => policyData ? {
        ...policyData,
        durationOptions: policyData.durationOptions || [],
        imageUrl: policyData.image || '', // For displaying existing image
        benefits: policyData.benefits && policyData.benefits.length > 0 ? policyData.benefits : [''],
    } : {
        title: '',
        category: '',
        description: '',
        minAge: '',
        maxAge: '',
        coverageRange: '',
        durationOptions: [],
        basePremiumRate: '',
        imageUrl: '',
        benefits: [''],
        eligibility: '',
        premiumLogicNote: ''
    });

    // Initialize imageFile to null, it will be handled on change
    const [imageFile, setImageFile] = useState(null);

    // No useEffect needed here for state reset, as the `key` prop in the parent
    // will force a re-mount and re-initialization of useState.

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'minAge' || name === 'maxAge' || name === 'basePremiumRate') {
            setFormData({ ...formData, [name]: Number(value) });
        } else if (name === 'durationOptions') {
            const durations = value.split(',').map(d => Number(d.trim())).filter(d => !isNaN(d) && d > 0);
            setFormData({ ...formData, [name]: durations });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file); // Store the actual file object
        if (file) {
            setFormData({ ...formData, imageUrl: URL.createObjectURL(file) }); // Create a URL for preview
        } else {
            // If no file selected, revert to previous image or empty.
            // This logic is important because clearing the input should reflect the original image.
            setFormData({ ...formData, imageUrl: policyData?.image || '' });
        }
    };

    const handleBenefitChange = (index, value) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData({ ...formData, benefits: newBenefits });
    };

    const addBenefitField = () => {
        setFormData({ ...formData, benefits: [...formData.benefits, ''] });
    };

    const removeBenefitField = (index) => {
        const newBenefits = formData.benefits.filter((_, i) => i !== index);
        setFormData({ ...formData, benefits: newBenefits.length > 0 ? newBenefits : [''] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSubmit = {
            ...formData,
            minAge: Number(formData.minAge),
            maxAge: Number(formData.maxAge),
            basePremiumRate: Number(formData.basePremiumRate),
            durationOptions: formData.durationOptions.map(Number),
            benefits: formData.benefits.filter(b => b.trim() !== '')
        };

        onSubmit({
            ...dataToSubmit,
            imageFile: imageFile, // Pass the File object
            image: policyData?.image // Pass existing image URL if no new file
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 py-8">
                        <DialogOverlay className="fixed inset-0 bg-black opacity-50" />

                        <DialogPanel
                            className="relative bg-white w-full max-w-2xl p-6 rounded-2xl shadow-xl transform transition-all"
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                            >
                                <X size={24} />
                            </button>

                            <DialogTitle className="text-3xl font-extrabold text-gray-800 mb-6">
                                {policyData ? 'Edit Policy' : 'Add New Policy'}
                            </DialogTitle>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Policy Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Term Life">Term Life</option>
                                        <option value="Senior">Senior</option>
                                        <option value="Family">Family</option>
                                        <option value="Health">Health</option>
                                        <option value="Education">Education</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-1">Minimum Age</label>
                                        <input
                                            type="number"
                                            id="minAge"
                                            name="minAge"
                                            value={formData.minAge}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700 mb-1">Maximum Age</label>
                                        <input
                                            type="number"
                                            id="maxAge"
                                            name="maxAge"
                                            value={formData.maxAge}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                            min={formData.minAge || 0}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="coverageRange" className="block text-sm font-medium text-gray-700 mb-1">Coverage Range (e.g., 100000 – 5000000)</label>
                                    <input
                                        type="text"
                                        id="coverageRange"
                                        name="coverageRange"
                                        value={formData.coverageRange}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        placeholder="e.g., 100000 – 5000000"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="durationOptions" className="block text-sm font-medium text-gray-700 mb-1">Duration Options (comma-separated years, e.g., 5,10,15)</label>
                                    <input
                                        type="text"
                                        id="durationOptions"
                                        name="durationOptions"
                                        value={formData.durationOptions.join(', ')}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        placeholder="e.g., 5,10,15"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="basePremiumRate" className="block text-sm font-medium text-gray-700 mb-1">Base Premium Rate (e.g., 0.0003)</label>
                                    <input
                                        type="number"
                                        step="0.000001"
                                        id="basePremiumRate"
                                        name="basePremiumRate"
                                        value={formData.basePremiumRate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="policyImage" className="block text-sm font-medium text-gray-700 mb-1">Policy Image</label>
                                    <input
                                        type="file"
                                        id="policyImage"
                                        name="policyImage"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {formData.imageUrl && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600 mb-1">Current/New Image Preview:</p>
                                            <img src={formData.imageUrl} alt="Policy Preview" className="w-32 h-32 object-cover rounded-lg shadow-md" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                                    {formData.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={benefit}
                                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder={`Benefit ${index + 1}`}
                                            />
                                            {formData.benefits.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeBenefitField(index)}
                                                    className="p-2 rounded-full text-red-500 hover:bg-red-100 transition"
                                                >
                                                    <X size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addBenefitField}
                                        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <PlusCircle className="mr-2 h-5 w-5" /> Add Benefit
                                    </button>
                                </div>

                                <div>
                                    <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                                    <textarea
                                        id="eligibility"
                                        name="eligibility"
                                        value={formData.eligibility}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="premiumLogicNote" className="block text-sm font-medium text-gray-700 mb-1">Premium Logic Note</label>
                                    <textarea
                                        id="premiumLogicNote"
                                        name="premiumLogicNote"
                                        value={formData.premiumLogicNote}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    ></textarea>
                                </div>

                                <motion.button
                                    type="submit"
                                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isMutating}
                                >
                                    {isMutating && <Loader2 className="h-5 w-5 mr-3 animate-spin" />}
                                    {policyData ? (isMutating ? 'Updating Policy...' : 'Update Policy') : (isMutating ? 'Adding Policy...' : 'Add Policy')}
                                </motion.button>
                            </form>
                        </DialogPanel>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
};
export default PolicyModal;