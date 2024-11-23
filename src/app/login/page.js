'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function LoginPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (status === 'authenticated') {
			router.push('/dashboard');
		}
	}, [status, router]);
	console.log(status)
	if (status === 'loading') {
		return <LoadingScreen />;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError('Invalid credentials');
				setIsLoading(false);
			} else {
				// Keep loading state active during navigation
				router.push('/dashboard');
			}
		} catch (error) {
			setError('Something went wrong');
			setIsLoading(false);
		}
	};

	if (status === 'unauthenticated') {
		return (
			<>
			<AnimatePresence>
				{isLoading && <LoadingScreen />}
			</AnimatePresence>
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="max-w-md w-full space-y-8"
				>
					<div>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
							Sign in to your account
						</h2>
					</div>
					<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
						<div className="rounded-md shadow-sm -space-y-px">
							<div>
								<label htmlFor="email" className="sr-only">
									Email address
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="relative">
								<label htmlFor="password" className="sr-only">
									Password
								</label>
								<input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white pr-10"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
									) : (
										<EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="text-sm">
								<Link
									href="/forgot-password"
									className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
								>
									Forgot your password?
								</Link>
							</div>
						</div>

						<AnimatePresence mode='wait'>
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md"
								>
									{error}
								</motion.div>
							)}
						</AnimatePresence>

						<div>
							<button
								type="submit"
								disabled={isLoading}
								className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
							>
								{isLoading ? (
									<span className="flex items-center">
										<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Signing in...
									</span>
								) : (
									'Sign in'
								)}
							</button>
						</div>

						<div className="text-center text-sm">
							<span className="text-gray-500 dark:text-gray-400">
								Don't have an account?{' '}
							</span>
							<Link
								href="/signup"
								className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
							>
								Sign up
							</Link>
						</div>
					</form>
				</motion.div>
			</div>

		</>
	);
}
}