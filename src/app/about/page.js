'use client'

import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                <article className="prose prose-lg dark:prose-invert mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        About Us
                    </h1>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            Welcome to our corner of the internet.
                        </p>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        ●
                        </p>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        ●

                        </p>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        ●

                        </p>
                    </div>
                </article>
            </motion.div>
        </div>
    );
}