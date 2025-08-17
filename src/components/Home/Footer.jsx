import { FaGithub } from 'react-icons/fa';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gray-950 text-gray-300 mt-20">
            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />

            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Left text */}
                <p className="text-sm text-gray-400">
                    © {new Date().getFullYear()} Life Insurance Platform — Built with ❤️ by Your Name
                </p>

                {/* GitHub Link */}
                <a
                    href="https://github.com/MohammadRayhanHabib"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                    <FaGithub className="text-2xl" />
                    {/* <span className="text-sm">GitHub Repository</span> */}
                </a>

                {/* Scroll to Top */}
                <button
                    onClick={scrollToTop}
                    className="inline-flex items-center gap-2 px-3 py-1 border border-gray-700 rounded-md text-sm hover:bg-gray-800 transition"
                >
                    <ArrowUp className="w-4 h-4" />
                    Top
                </button>
            </div>
        </footer>
    );
};

export default Footer;
