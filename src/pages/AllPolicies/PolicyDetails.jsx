import React from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { axiosSecure } from '../../hooks/useAxiosSecure';

const PolicyDetails = () => {
    const { id } = useParams();

    const { data: policy, isLoading, error } = useQuery({
        queryKey: ['policy', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/policies/${id}`);
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
                <span className="ml-4 text-xl font-semibold text-gray-700">Loading policy details...</span>
            </div>
        );
    }

    if (error || !policy) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl font-semibold text-red-600">Error loading policy details. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                {policy.title}
            </h1>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Image Section */}
                <div className="lg:col-span-1">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                        <img
                            src={policy.image || 'https://via.placeholder.com/400x300?text=Policy+Image'}
                            alt={policy.title}
                            className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Category and Description */}
                    <div className="bg-white shadow-xl rounded-2xl p-6">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full uppercase tracking-wide mb-4">
                            {policy.category}
                        </span>
                        <p className="text-gray-600 text-base leading-relaxed">{policy.description}</p>
                    </div>

                    {/* Placeholder for Additional Info */}
                    <div className="bg-white shadow-xl rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">More Information</h2>
                        <p className="text-gray-600 text-base leading-relaxed">
                            For detailed eligibility criteria, benefits, premium calculations, and term options, please contact our team or book a consultation with one of our agents.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to={`/quote`}
                            aria-label={`Get a quote for ${policy.title}`}
                            className="w-full sm:w-auto text-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-teal-500 rounded-lg hover:from-green-700 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Get Quote
                        </Link>
                        <Link
                            to="/consultation"
                            aria-label="Book a consultation with an agent"
                            className="w-full sm:w-auto text-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Book Agent Consultation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetails;