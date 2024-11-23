'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            setIsNavigating(true);
            router.push('/login');
        }
    }, [status, router]);

    // Show loading screen during initial session check or navigation
    if (status === 'loading' || isNavigating) {
        return (
            <AnimatePresence>
                <LoadingScreen />
            </AnimatePresence>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <CodeBracketIcon className="h-6 w-6" />
                                    Template
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-400"
                                >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content with padding for fixed header */}
            <main className="pt-16 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
