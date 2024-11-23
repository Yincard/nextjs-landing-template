'use client'

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import LoadingScreen from '../../components/ui/LoadingScreen';

// Dynamically import UserProfile with no SSR
const UserProfile = dynamic(
  () => import('../../components/auth/UserProfile'),
  { ssr: false }
);

export default function DashboardPage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    const handleProfileUpdate = () => {
        update();
    };

    // Show loading screen while checking authentication
    if (status === 'loading') {
        return <LoadingScreen />;
    }

    // Redirect if not authenticated
    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    return (
        <div className="py-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                {session?.user && (
                    <UserProfile 
                        user={session.user} 
                        onUpdate={handleProfileUpdate}
                    />
                )}

               
            </motion.div>
        </div>
    );
}