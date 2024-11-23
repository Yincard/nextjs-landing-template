'use client'

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess(false);
		setIsLoading(true);

		try {
			await sendPasswordResetEmail(auth, email);
			setSuccess(true);
			setEmail('');
		} catch (error) {
			console.error('Password reset error:', error);
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-md w-full space-y-8"
			>
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
						Reset your password
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
						Enter your email address and we'll send you a link to reset your password.
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email" className="sr-only">
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
							placeholder="Email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					{error && (
						<div className="text-red-500 text-sm text-center">{error}</div>
					)}

					{success && (
						<div className="text-green-500 text-sm text-center">
							Password reset link has been sent to your email address.
						</div>
					)}

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							{isLoading ? 'Sending...' : 'Send reset link'}
						</button>
					</div>

					<div className="text-center text-sm">
						<Link
							href="/login"
							className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
						>
							Back to sign in
						</Link>
					</div>
				</form>
			</motion.div>
		</div>
	);
}