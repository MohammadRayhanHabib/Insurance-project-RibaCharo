import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import {
    FaShieldAlt,
    FaUsers,
    FaClock,
    FaGlobeAsia,
    FaBalanceScale,
    FaHandHoldingHeart,
    FaHandshake,
} from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
    {
        image: 'https://i.pinimg.com/736x/fe/c1/cf/fec1cf72dac0760b5e8e380bcb4a2188.jpg',
        title: 'Secure Your Tomorrow Today',
        time: '24/7 Online Support',
        location: 'Global | Shariah-Compliant',
        opening: 'Easy Online Enrollment',
        startingPoint: 'Instant Coverage Approval',
        method: 'Built on Trust & Transparency',
        buttonLabel: 'Get a Free Quote',
    },
    {
        image: 'https://i.pinimg.com/736x/ca/95/57/ca9557b4571252daad1a527137fddfbb.jpg ',
        title: 'Family Protection the Halal Way',
        time: 'Flexible Monthly Plans',
        location: 'Worldwide Accessibility',
        opening: 'Zero Interest Policy',
        startingPoint: 'Begin in 2 Minutes',
        method: 'Ethical | Transparent | Mutual',
        buttonLabel: 'Explore Takaful Plans',
    },
    {
        image: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810?auto=format&fit=crop&w=1500&q=80',
        title: 'Peace of Mind, Powered by Faith',
        time: 'Real-Time Claim Assistance',
        location: 'Digital Platform',
        opening: 'Trusted by Thousands',
        startingPoint: 'Start with Consultation',
        method: 'Mutual Support System',
        buttonLabel: 'Join Now',
    },
];

const BannerSlider = () => {
    return (
        <div className="w-full h-[70vh] relative mt-10">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{ delay: 5000 }}
                loop={true}
                pagination={{ clickable: true }}
                navigation
                className="h-full "
            >
                {slides.map((slide, idx) => (
                    <SwiperSlide key={idx}>
                        <div
                            className="mb-10 w-full h-full bg-cover bg-center flex items-center justify-center rounded-3xl "
                            style={{ backgroundImage: `url(${slide.image})` }}

                        >
                            <div className="bg-white/1 mx-2  backdrop-blur-3xl lg:h-8/12 p-6 md:p-10 rounded-2xl lg:w-11/12 xl:w-9/12 text-black text-left border border-white/30 shadow-2xl transition duration-500 ease-in-out transform hover:scale-105 space-y-4">
                                <div className=" flex items-center gap-2 text-black text-2xl font-semibold">
                                    <FaShieldAlt />
                                    <h2>
                                        <Typewriter
                                            words={[slide.title]}
                                            loop={false}
                                            cursor
                                            cursorStyle="_"
                                            typeSpeed={80}
                                            deleteSpeed={50}
                                            delaySpeed={1500}
                                        />
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 text-base ">
                                    <div className="flex items-center gap-2">
                                        <FaClock className="text-yellow-300" />
                                        <span><strong>Availability:</strong> {slide.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaGlobeAsia className="text-blue-300" />
                                        <span><strong>Coverage:</strong> {slide.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaHandshake className="text-red-300" />
                                        <span><strong>Enrollment:</strong> {slide.opening}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="text-purple-300" />
                                        <span><strong>Community:</strong> {slide.startingPoint}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaBalanceScale className="text-green-300" />
                                        <span><strong>Ethics:</strong> {slide.method}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaHandHoldingHeart className="text-pink-300" />
                                        <span><strong>Values:</strong> Mutual Care & Support</span>
                                    </div>
                                </div>

                                <p className="mt-4 text-black/90 font-medium leading-relaxed">
                                    We believe in protecting lives the halal way — with transparency, fairness, and faith-based integrity. Join our Takaful system to secure your future and your family.
                                </p>

                                <button className="mt-4  bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 transition px-8 py-3 rounded-full text-black font-semibold shadow-lg">
                                    {slide.buttonLabel}
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BannerSlider;

