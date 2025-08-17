import { ShieldCheck, Truck, Headphones } from "lucide-react";



const WhyChooseUs = () => {
    return (


        <section className="py-16 mt-50 rounded-2xl px-6 lg:px-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Why Choose Us</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                    We provide premium products with unmatched service — trusted by thousands of customers worldwide.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition">
                        <ShieldCheck className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Quality Guaranteed</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Every product passes a 5-step quality check before reaching you.
                        </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition">
                        <Truck className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Fast Delivery</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Get your orders within 48 hours in most major cities.
                        </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition">
                        <Headphones className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">24/7 Support</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Our support team is always available to assist you anytime.
                        </p>
                    </div>
                </div>
            </div>
        </section>

    )
};

export default WhyChooseUs;
