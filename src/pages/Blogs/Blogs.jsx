import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Link } from 'react-router';
import { axiosSecure } from '../../hooks/useAxiosSecure';



const Blogs = () => {
    const queryClient = useQueryClient();
    const [selectedBlog, setSelectedBlog] = useState(null);

    const { data: blogs = [], isLoading, error } = useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const res = await axiosSecure.get('/blogs');
            return res.data || [];
        },
    });

    const updateVisitCount = useMutation({
        mutationFn: async (blogId) => {
            const res = await axiosSecure.patch(`/blogs/${blogId}/visit`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['blogs']);
        },
    });

    const handleReadMore = (blog) => {
        setSelectedBlog(blog);
        updateVisitCount.mutate(blog._id);
    };

    // if (isLoading) return <LoadingSpinner />;
    if (error) return <p className="text-red-600 text-center">Error: {error.message}</p>;

    return (
        <>
            <Helmet>
                <title>NeoTakaful | Blogs</title>
            </Helmet>
            <motion.div
                className="max-w-7xl mx-auto p-6 bg-white rounded-3xl shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent mb-6">
                    Blogs & Articles
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <motion.div
                            key={blog._id}
                            className="bg-gray-50 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <img
                                src={blog.image || '/default-blog.jpg'}
                                alt={blog.title}
                                className="w-full h-48 object-cover rounded-t-xl"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-bold text-gray-800">{blog.title}</h2>
                                <p className="mt-2 text-gray-600">
                                    {blog.details?.slice(0, 80) || 'No details available.'}...
                                </p>
                                <div className="flex items-center mt-3">
                                    <img
                                        src={blog.authorImage || '/default-avatar.png'}
                                        alt={blog.author}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <span className="text-sm text-gray-700">{blog.author}</span>
                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        Author
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Published: {new Date(blog.publishedDate).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">Visits: {blog.visitCount || 0}</p>
                                <motion.button
                                    onClick={() => handleReadMore(blog)}
                                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Read More
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedBlog && (
                        <Dialog open={true} onClose={() => setSelectedBlog(null)} className="fixed z-50 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4">
                                <Dialog.Panel className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-2xl transform transition-all duration-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                                            {selectedBlog.title}
                                        </Dialog.Title>
                                        <motion.button
                                            onClick={() => setSelectedBlog(null)}
                                            className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <X size={24} />
                                        </motion.button>
                                    </div>

                                    <div className="space-y-4 text-gray-700">
                                        <img
                                            src={selectedBlog.image || '/default-blog.jpg'}
                                            alt={selectedBlog.title}
                                            className="w-full h-64 object-cover rounded-xl border-2 border-teal-500 hover:border-teal-600 transition-all duration-200"
                                        />
                                        <p>{selectedBlog.details || 'No details available.'}</p>
                                        <div className="flex items-center">
                                            <img
                                                src={selectedBlog.authorImage || '/default-avatar.png'}
                                                alt={selectedBlog.author}
                                                className="w-10 h-10 rounded-full mr-2"
                                            />
                                            <span className="text-sm text-gray-700">{selectedBlog.author}</span>
                                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Author
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Published: {new Date(selectedBlog.publishedDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Visits: {selectedBlog.visitCount || 0}
                                        </p>
                                        <Link
                                            to={`/blog/${selectedBlog._id}`}
                                            onClick={() => setSelectedBlog(null)}
                                            className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                                        >
                                            View Full Article
                                        </Link>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </Dialog>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
};

export default Blogs;
