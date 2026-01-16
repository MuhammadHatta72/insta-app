import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PostForm from '@/Components/PostForm';
import PostCard from '@/Components/PostCard';

export default function Index({ posts, auth }) {
    const [showForm, setShowForm] = useState(false);

    if (auth.user) {
        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Feed</h2>}
            >
                <Head title="Posts" />

                <div className="py-12">
                    <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        {/* Create Post Button */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {showForm ? 'Cancel' : 'Create Post'}
                            </button>
                        </div>

                        {/* Post Form */}
                        {showForm && (
                            <PostForm
                                onClose={() => setShowForm(false)}
                                auth={auth}
                            />
                        )}

                        {/* Posts List */}
                        {posts.data && posts.data.length > 0 ? (
                            <>
                                {posts.data.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        auth={auth}
                                    />
                                ))}

                                {/* Pagination */}
                                <div className="flex justify-center gap-2">
                                    {posts.links.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.url}
                                            className={`px-3 py-2 rounded ${link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                                <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to create one!</p>
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <div>
            <Head title="Posts" />

            <nav className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href={route('posts.index')} className="text-xl font-bold text-gray-900 dark:text-white">
                                <img src="/assets/img/logo-insta.svg" alt="InstaApp" className="h-8 w-8 inline-block mr-2" />
                                InstaApp
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('login')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Login
                            </Link>
                            <Link
                                href={route('register')}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            <Link href={route('login')} className="text-blue-600 hover:text-blue-700 font-bold">
                                Login
                            </Link>
                            {' '}or{' '}
                            <Link href={route('register')} className="text-blue-600 hover:text-blue-700 font-bold">
                                Register
                            </Link>
                            {' '}to create posts
                        </p>
                    </div>

                    {/* Posts List */}
                    {posts.data && posts.data.length > 0 ? (
                        <>
                            {posts.data.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    auth={auth}
                                />
                            ))}

                            {/* Pagination */}
                            <div className="flex justify-center gap-2">
                                {posts.links.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.url}
                                        className={`px-3 py-2 rounded ${link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
