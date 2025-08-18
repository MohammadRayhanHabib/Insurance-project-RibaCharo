import React from 'react';
import { Tag, Gift, Truck as FreeTruck } from "lucide-react";

const SalesPromotion = () => {
    return (


        <section className="py-16 mt-10 rounded-2xl px-6 lg:px-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white dark:from-indigo-700 dark:to-purple-800 transition-colors duration-300">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">🔥 Ongoing Sales & Promotions</h2>
                <p className="mb-10 text-lg">Don’t miss out on our hottest deals of the season!</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl p-6 shadow-lg hover:scale-105 transition">
                        <Tag className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Summer Sale</h3>
                        <p>Up to <b>50% OFF</b> on electronics until <b>Aug 30</b>.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl p-6 shadow-lg hover:scale-105 transition">
                        <Gift className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">New User Offer</h3>
                        <p>Flat <b>20% discount</b> with code <b>WELCOME20</b>.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl p-6 shadow-lg hover:scale-105 transition">
                        <FreeTruck className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
                        <p>Enjoy free delivery on orders above <b>$100</b>.</p>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default SalesPromotion;