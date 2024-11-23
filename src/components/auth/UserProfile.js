'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilIcon } from '@heroicons/react/24/outline';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, storage, db } from '../../lib/firebase';

export default function UserProfile({ user, onUpdate }) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [username, setUsername] = useState(auth.currentUser?.displayName || '');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(auth.currentUser?.photoURL || '');
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setUsername(auth.currentUser.displayName || '');
      setProfileImageUrl(auth.currentUser.photoURL || '');
    }
  }, [auth.currentUser]);

  const checkUsername = async (newUsername) => {
    if (newUsername === auth.currentUser?.displayName || newUsername.length < 3 || /\s/.test(newUsername)) {
      setUsernameAvailable(true);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', newUsername.toLowerCase()));
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
    if (isEditingUsername && username !== auth.currentUser?.displayName) {
      const timeoutId = setTimeout(() => {
        checkUsername(username);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [username, isEditingUsername]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setProfileImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdateUsername = async () => {
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!usernameAvailable && username !== auth.currentUser?.displayName) {
      setError('Username is already taken');
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: username
      });

      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        username: username.toLowerCase(),
      });

      setSuccessMessage('Username updated successfully!');
      onUpdate();
      setIsEditingUsername(false);
      setError('');
    } catch (error) {
      console.error('Username update error:', error);
      setError('Failed to update username: ' + error.message);
    }
  };

  const handleUpdatePhoto = async () => {
    try {
      let photoURL = profileImageUrl;

      if (profileImage) {
        const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, profileImage);
        photoURL = await getDownloadURL(imageRef);
      }

      await updateProfile(auth.currentUser, {
        photoURL: photoURL
      });

      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        photoURL: photoURL,
      });

      setSuccessMessage('Profile picture updated successfully!');
      onUpdate();
      setIsEditingPhoto(false);
      setError('');
    } catch (error) {
      console.error('Profile picture update error:', error);
      setError('Failed to update profile picture: ' + error.message);
    }
  };

  const handlePasswordChange = () => {
    router.push('/forgot-password');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="relative w-32 h-32 mb-4">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-r from-black-100 to-blue-50 dark:from-black-900 dark:to-black-800 flex items-center justify-center ring-4 ring-red-100 dark:ring-white-900">
                  <svg className="h-16 w-16 text-white-500 dark:text-white-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              {isEditingPhoto && profileImageUrl && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {isEditingPhoto ? (
              <div className="flex flex-col items-center space-y-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Choose Photo</span>
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdatePhoto}
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPhoto(false);
                      setProfileImageUrl(auth.currentUser?.photoURL || '');
                      setProfileImage(null);
                    }}
                    className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 transition-colors shadow-md"
                  >
                    Cancel
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsEditingPhoto(true)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center space-x-1 transition-colors"
              >
                <PencilIcon className="h-4 w-7" />
                <span>Edit Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* User Info Section */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-6">
          {/* Email Section */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </label>
              <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                {auth.currentUser?.email}
              </p>
            </div>
          </div>

          {/* Username Section */}
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Username
              </label>
              {isEditingUsername ? (
                <div className="mt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        const valueWithoutSpaces = e.target.value.replace(/\s/g, '');
                        setUsername(valueWithoutSpaces);
                      }}
                      className={`block w-full px-4 py-2 border ${
                        username.length >= 3
                          ? usernameAvailable || username === auth.currentUser?.displayName
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      } rounded-full shadow-sm focus:border-transparent sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors`}
                    />
                    <button
                      onClick={handleUpdateUsername}
                      disabled={!usernameAvailable && username !== auth.currentUser?.displayName}
                      className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false);
                        setUsername(auth.currentUser?.displayName || '');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 transition-colors shadow-md"
                    >
                      Cancel
                    </button>
                  </div>
                  {username && username !== auth.currentUser?.displayName && (
                    <div className="mt-2 text-sm">
                      {username.length < 3 ? (
                        <p className="text-gray-500">Username must be at least 3 characters</p>
                      ) : isCheckingUsername ? (
                        <p className="text-gray-500">Checking availability...</p>
                      ) : (
                        <p className={usernameAvailable ? "text-green-500" : "text-red-500"}>
                          {usernameAvailable ? "Username is available" : "Username is already taken"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center mt-1">
                  <p className="text-lg font-medium text-gray-900 dark:text-white mr-2">{username}</p>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Password
              </label>
              <div className="flex items-center mt-1">
                <p className="text-lg font-medium text-gray-900 dark:text-white mr-2">••••••••</p>
                <button
                  onClick={handlePasswordChange}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}