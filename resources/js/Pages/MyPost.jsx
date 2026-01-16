import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PostGridCard from '@/Components/PostGridCard';
import PostModal from '@/Components/PostModal';

export default function MyPost({ posts }) {
    const { auth } = usePage().props;
    const [selectedPost, setSelectedPost] = useState(null);

    return (
        <AuthenticatedLayout
            header="My Posts"
            showCreateButton={true}
        >
            <Head title="My Posts" />

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
                            <p className="text-gray-600 dark:text-gray-400">
                                You haven't created any posts yet. Be the first to create one!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
