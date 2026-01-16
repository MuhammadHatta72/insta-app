import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PostCard({ post, auth }) {
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const handleLike = async () => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }

        try {
            await axios.post(route('likes.store', post.id));
            setLiked(!liked);
            setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) return;

        setLoading(true);

        try {
            const response = await axios.post(
                route('comments.store', post.id),
                { content: commentText }
            );

            setComments([...comments, response.data.comment]);
            setCommentText('');
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async () => {
        const result = await Swal.fire({
            title: 'Delete Post?',
            text: 'Are you sure you want to delete this post? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await router.delete(route('posts.destroy', post.id));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your post has been deleted.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete post.',
                    icon: 'error',
                });
            }
        }
    };

    const media = post.media || [];
    const currentMedia = media[currentMediaIndex];

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        {post.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{post.user.name}</p>
                        <p className="text-xs text-gray-500">{post.created_at}</p>
                    </div>
                </div>
                {auth.user && auth.user.id === post.user.id && (
                    <button
                        onClick={handleDeletePost}
                        className="text-red-600 hover:text-red-700 font-bold"
                    >
                        Delete
                    </button>
                )}
            </div>

            {/* Media Carousel */}
            {media.length > 0 && (
                <div className="relative bg-black">
                    {currentMedia && currentMedia.media_type === 'video' ? (
                        <video
                            src={currentMedia.media_path}
                            controls
                            className="w-full h-auto max-h-96 object-cover"
                        />
                    ) : currentMedia ? (
                        <img
                            src={currentMedia.media_path}
                            alt="Post media"
                            className="w-full h-auto max-h-96 object-cover"
                        />
                    ) : null}

                    {/* Media Navigation */}
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentMediaIndex((currentMediaIndex - 1 + media.length) % media.length)}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setCurrentMediaIndex((currentMediaIndex + 1) % media.length)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                            >
                                →
                            </button>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
                                {currentMediaIndex + 1} / {media.length}
                            </div>
                        </>
                    )}

                    {/* Media Thumbnails */}
                    {media.length > 1 && (
                        <div className="flex gap-1 p-2 bg-gray-900 overflow-x-auto">
                            {media.map((m, index) => (
                                <button
                                    key={m.id}
                                    onClick={() => setCurrentMediaIndex(index)}
                                    className={`flex-shrink-0 w-12 h-12 rounded ${currentMediaIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                                >
                                    {m.media_type === 'video' ? (
                                        <video src={m.media_path} className="w-full h-full object-cover rounded" onerror="this.style.display='none'" />
                                    ) : (
                                        <img src={m.media_path} alt={`thumbnail-${index}`} className="w-full h-full object-cover rounded" onError={(e) => console.error('Image load error:', e)} />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Caption */}
            {post.caption && (
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-gray-900 dark:text-white">
                        <span className="font-bold">{post.user.name}</span> {post.caption}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="px-4 py-2 flex justify-between border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleLike}
                    disabled={!auth.user}
                    className={`font-bold transition-opacity ${!auth.user ? 'opacity-50 cursor-not-allowed' : ''} ${liked ? 'text-red-600' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    title={!auth.user ? 'Login to like' : ''}
                >
                    {liked ? '❤️' : '🤍'} Like ({likesCount})
                </button>
                <div className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold">
                    💬 Comments ({post.comments_count})
                </div>
            </div>

            {/* Comments Preview */}
            <div className="px-4 py-3">
                {comments.length > 0 && (
                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                        {comments.map((comment) => (
                            <div key={comment.id} className="text-sm">
                                <span className="font-bold text-gray-900 dark:text-white">{comment.user.name}</span>
                                <span className="text-gray-700 dark:text-gray-300"> {comment.content}</span>
                                <p className="text-xs text-gray-500">{comment.created_at}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Comment Form or Login Prompt */}
                {auth.user ? (
                    <form onSubmit={handleComment} className="flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm focus:ring-blue-500 focus:border-blue-500"
                            maxLength={500}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-3 py-1 rounded text-sm font-bold"
                        >
                            Post
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <a href={route('login')} className="text-blue-600 hover:text-blue-700 font-bold">
                                Login
                            </a>
                            {' '}to comment on posts
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
