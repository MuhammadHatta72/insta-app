import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import PostCard from '@/Components/PostCard';
import PostGridCard from '@/Components/PostGridCard';
import PostModal from '@/Components/PostModal';

export default function Index({ posts, auth }) {
    const [selectedPost, setSelectedPost] = useState(null);

    if (auth.user) {
        return (
            <AuthenticatedLayout
                header="Feed"
            >
                <Head title="Posts" />

                <div className="py-12">
                    <div className="mx-auto max-w-4xl">

                        {selectedPost && (
                            <PostModal
                                post={selectedPost}
                                auth={auth}
                                onClose={() => setSelectedPost(null)}
                            />

                        )}

                        {posts.data && posts.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {posts.data.map((post) => (
                                        <PostGridCard
                                            key={post.id}
                                            post={post}
                                            auth={auth}
                                            onPostClick={setSelectedPost}
                                        />
                                    ))}
                                </div>

                                <div className="flex justify-center gap-2 mt-4">
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
            </AuthenticatedLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Posts" />

            <div className="mx-auto max-w-4xl py-12">

                {selectedPost && (
                    <div className="w-full mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Post Detail
                            </h3>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-bold text-lg"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-800 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18 17.94 6M18 18 6.06 6"
                                    />
                                </svg>
                            </button>
                        </div>

                        <PostCard
                            post={selectedPost}
                            auth={auth}
                        />
                    </div>
                )}

                {posts.data && posts.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {posts.data.map((post) => (
                                <PostGridCard
                                    key={post.id}
                                    post={post}
                                    auth={auth}
                                    onPostClick={setSelectedPost}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center gap-2 mt-4">
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
        </GuestLayout>
    );
}
