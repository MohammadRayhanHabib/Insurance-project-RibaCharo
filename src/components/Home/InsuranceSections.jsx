import React from "react";
import { ShieldCheck, Users, HandCoins, TrendingUp, HeartHandshake, FileText, Car, Home, Activity } from "lucide-react";

const InsuranceSections = () => {
    return (
        <div className="mt-40  bg-background text-foreground transition-colors duration-300">

            {/* About / Why Choose Us */}
            <section className="py-16 max-w-[1660px] mx-auto  mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
                    With over <span className="font-semibold text-primary">25+ years</span> of expertise,
                    we provide trusted insurance solutions to protect your health, family,
                    and future. Our customer-first approach ensures safety, security, and support.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl shadow-lg bg-card hover:shadow-xl transition">
                        <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Trusted Protection</h3>
                        <p className="text-muted-foreground">
                            Covering <b>2M+ clients</b> with reliable policies worldwide.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl shadow-lg bg-card hover:shadow-xl transition">
                        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                        <p className="text-muted-foreground">
                            24/7 support and a <b>98% satisfaction rate</b>.
                        </p>
                    </div>
                    <div className="p-6 rounded-2xl shadow-lg bg-card hover:shadow-xl transition">
                        <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Secure Partnerships</h3>
                        <p className="text-muted-foreground">
                            Partnered with <b>50+ global insurers</b> for stronger coverage.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sales Promotion */}
            <section className="py-16  bg-muted/50">
                <div className="  text-center">
                    <h2 className="text-3xl font-bold mb-4">Current Promotions</h2>
                    <p className="text-muted-foreground mb-10">
                        Save more with our special insurance offers and family plans.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-card shadow-lg hover:shadow-xl transition">
                            <HandCoins className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Health Plan Discount</h3>
                            <p className="text-muted-foreground">Up to <b>30% off</b> on family health packages.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-card shadow-lg hover:shadow-xl transition">
                            <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Life Insurance Bonus</h3>
                            <p className="text-muted-foreground">Get <b>$500 bonus</b> coverage on select policies.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-card shadow-lg hover:shadow-xl transition">
                            <FileText className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Student Protection</h3>
                            <p className="text-muted-foreground"><b>20% discount</b> for students under 25.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories / Services */}
            <section className="py-16  mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Our Insurance Services</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
                    Choose from a wide range of tailored insurance solutions to fit your lifestyle.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl bg-card shadow-lg hover:shadow-xl transition">
                        <Activity className="w-10 h-10 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">Health Insurance</h3>
                        <p className="text-muted-foreground">Comprehensive health & medical coverage.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card shadow-lg hover:shadow-xl transition">
                        <Car className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">Car Insurance</h3>
                        <p className="text-muted-foreground">Affordable plans for vehicles & accidents.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card shadow-lg hover:shadow-xl transition">
                        <Home className="w-10 h-10 text-teal-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">Home Insurance</h3>
                        <p className="text-muted-foreground">Protect your property & belongings.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card shadow-lg hover:shadow-xl transition">
                        <ShieldCheck className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold">Life Insurance</h3>
                        <p className="text-muted-foreground">Secure your family’s financial future.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InsuranceSections;
