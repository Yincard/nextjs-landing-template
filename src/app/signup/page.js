'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signIn } from 'next-auth/react';
import { auth, storage, db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import LoadingScreen from '../../components/ui/LoadingScreen';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleRemoveImage = () => {
        setProfileImage(null);
        setProfileImageUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const fileInputRef = useRef(null);

    // Password validation states
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasNumber: false,
        hasSpecial: false,
        hasUppercase: false,
        hasLowercase: false
    });
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    // Username availability check states
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);

    const validatePassword = (password) => {
        setPasswordValidation({
            minLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password)
        });
    };

    // Modified checkUsername function to prevent spaces in username
    const checkUsername = async (username) => {
        // Prevent checking username if it contains spaces or is too short
        if (username.length < 3 || /\s/.test(username)) {
            setUsernameAvailable(null); // Invalid if spaces are found or too short
            return;
        }

        setIsCheckingUsername(true);
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', username.toLowerCase()));
            const querySnapshot = await getDocs(q);
            setUsernameAvailable(querySnapshot.empty);
        } catch (error) {
            console.error('Error checking username:', error);
            setUsernameAvailable(false);
        } finally {
            setIsCheckingUsername(false);
        }
    };

    useEffect(() => {
        if (formData.username) {
            const timeoutId = setTimeout(() => {
                checkUsername(formData.username);
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [formData.username]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setProfileImageUrl(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Prevent spaces in the username input
        if (name === 'username') {
            const valueWithoutSpaces = value.replace(/\s/g, ''); // Remove all spaces
            setFormData(prev => ({
                ...prev,
                [name]: valueWithoutSpaces
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (name === 'password') {
            validatePassword(value);
            setPasswordsMatch(value === formData.confirmPassword);
        }
        if (name === 'confirmPassword') {
            setPasswordsMatch(value === formData.password);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Check password requirements
        const isPasswordValid = Object.values(passwordValidation).every(Boolean);
        if (!isPasswordValid) {
            setError('Please meet all password requirements');
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters');
            setIsLoading(false);
            return;
        }

        if (!usernameAvailable) {
            setError('Username is already taken');
            setIsLoading(false);
            return;
        }


        try {
            // Create user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Upload profile image if selected
            let photoURL = '';
            if (profileImage) {
                const imageRef = ref(storage, `profileImages/${userCredential.user.uid}`);
                await uploadBytes(imageRef, profileImage);
                photoURL = await getDownloadURL(imageRef);
            }

            // Add user to Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                username: formData.username.toLowerCase(),
                email: formData.email.toLowerCase(),
                photoURL: photoURL,
                createdAt: serverTimestamp(),
            });

            // Update profile
            await updateProfile(userCredential.user, {
                displayName: formData.username,
                photoURL: photoURL
            });

            // Sign in the user with NextAuth
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError('Account created but failed to sign in automatically. Please try logging in.');
                router.push('/login');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setError('Email is already registered');
            } else {
                setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <LoadingScreen />}
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full space-y-8"
                >
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                            Create your account
                        </h2>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-24 h-24 mb-4">
                                {profileImageUrl ? (
                                    <>
                                        <Image
                                            src={profileImageUrl}
                                            alt="Profile preview"
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                {profileImageUrl ? 'Change profile picture' : 'Upload profile picture'}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Username
                        </label>
                        <div className="relative mt-1">
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                autoComplete="username"
                                required
                                className={`block w-full px-3 py-2 border ${formData.username.length >= 3
                                    ? usernameAvailable
                                        ? 'border-green-500'
                                        : 'border-red-500'
                                    : 'border-gray-300'
                                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
                            />
                            {formData.username && (
                                <div className="mt-1 text-sm">
                                    {
                                        formData.username.length < 3 ? (
                                            <p className="text-gray-500">Username must be at least 3 characters</p>
                                        ) : isCheckingUsername ? (
                                            <p className="text-gray-500">Checking availability...</p>
                                        ) : (
                                            <p className={usernameAvailable ? "text-green-600" : "text-red-600"}>
                                                {usernameAvailable ? "Username is available" : "Username is already taken"}
                                            </p>
                                        )
                                    }
                                </div>
                            )}
                        </div>


                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            />
                        </div>

                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                                className={`block w-full px-3 py-2 border ${formData.confirmPassword
                                    ? passwordsMatch
                                        ? 'border-green-500'
                                        : 'border-red-500'
                                    : 'border-gray-300'
                                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                )}
                            </button>
                        </div>

                        {/* Compact password requirements */}
                        <div className="mt-2 grid grid-cols-5 gap-1.5 text-xs">
                            <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-500' : 'text-gray-500'}`}>
                                <span className="mr-1">{passwordValidation.minLength ? '✓' : '○'}</span>
                                8+ chars
                            </div>
                            <div className={`flex items-center ${passwordValidation.hasUppercase ? 'text-green-500' : 'text-gray-500'}`}>
                                <span className="mr-1">{passwordValidation.hasUppercase ? '✓' : '○'}</span>
                                Uppercase
                            </div>
                            <div className={`flex items-center ${passwordValidation.hasLowercase ? 'text-green-500' : 'text-gray-500'}`}>
                                <span className="mr-1">{passwordValidation.hasLowercase ? '✓' : '○'}</span>
                                Lowercase
                            </div>
                            <div className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-500' : 'text-gray-500'}`}>
                                <span className="mr-1">{passwordValidation.hasNumber ? '✓' : '○'}</span>
                                Number
                            </div>
                            <div className={`flex items-center ${passwordValidation.hasSpecial ? 'text-green-500' : 'text-gray-500'}`}>
                                <span className="mr-1">{passwordValidation.hasSpecial ? '✓' : '○'}</span>
                                Special char
                            </div>
                        </div>


                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                    className={`block w-full px-3 py-2 border ${formData.confirmPassword
                                        ? passwordsMatch
                                            ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                            : 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        } rounded-md shadow-sm sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white pr-10`}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    {formData.confirmPassword && (
                                        <span className="pr-3">
                                            {passwordsMatch ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-500" />
                                            )}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {formData.confirmPassword && !passwordsMatch && (
                                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {isLoading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </div>

                        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                        <div className="text-sm text-center">
                            <p>   <span className="text-gray-500 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Login
                                </Link>
                            </span>
                            </p>

                        </div>
                    </form>
                </motion.div>
            </div>
        </>
    );
}
