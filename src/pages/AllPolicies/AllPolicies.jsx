import React from 'react';
import { axiosSecure } from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

const AllPolicies = () => {
    const { data: policies, isLoading } = useQuery({
        queryKey: ['policies'],
        queryFn: async () => {
            const res = await axiosSecure.get('/policies');
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
                <span className="ml-4 text-xl font-semibold text-gray-700">Loading policies...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500">
                All Life Insurance Policies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {policies.map((policy) => (
                    <div
                        key={policy._id}
                        className="relative bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
                    >
                        {/* Image with gradient overlay */}
                        <div className="relative">
                            <img
                                src={policy.image}
                                alt={policy.title}
                                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full uppercase tracking-wide">
                                    {policy.category}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                {policy.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                {policy.description}
                            </p>
                            <Link
                                to={`/policyDetails/${policy._id}`}
                                className="inline-block mt-4 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-teal-500 rounded-lg hover:from-green-700 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllPolicies;
