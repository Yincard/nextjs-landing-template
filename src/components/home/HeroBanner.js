'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

export default function HeroBanner() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const handleGetStarted = async () => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        } else {
            router.push('/signup');
        }
    };

    const handleLearnMore = () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If we're not on the home page, go to home page features section
            router.push('/#features');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl font-bold mb-6">
                            Template Page for Future Websites
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                            NodeJS, ReactJS, NextJS, Firebase
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={handleGetStarted}
                                className="btn-primary hover:scale-105 transition-transform"
                            >
                                Get Started
                            </button>
                            <button 
                                onClick={handleLearnMore}
                                className="btn-secondary hover:scale-105 transition-transform"
                            >
                                Learn More
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative h-[500px]"
                    >
                        <Image
                            src="/assets/images/hero/hero-image.jpg" 
                            alt="Platform Preview"
                            fill
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}