import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PostModal({ post, auth, onClose }) {
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState(post.is_liked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editCaption, setEditCaption] = useState(post.caption || '');
    const [editLoading, setEditLoading] = useState(false);
    const [editMediaFiles, setEditMediaFiles] = useState([]);
    const [editMediaPreviews, setEditMediaPreviews] = useState(post.media || []);
    const [oldMediaIds, setOldMediaIds] = useState(post.media.map(m => m.id) || []);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);

    const isUserLoggedIn = auth.user !== null && auth.user !== undefined;
    const postComments = comments;

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

    const handleEditPost = async () => {
        if (!editCaption.trim()) {
            Swal.fire({
                title: 'Error!',
                text: 'Caption cannot be empty.',
                icon: 'error',
            });
            return;
        }

        if (editMediaPreviews.length === 0) {
            Swal.fire({
                title: 'Error!',
                text: 'Post must have at least one media file.',
                icon: 'error',
            });
            return;
        }

        setEditLoading(true);

        try {
            const formData = new FormData();
            formData.append('caption', editCaption);
            formData.append('keep_media_ids', JSON.stringify(oldMediaIds));

            // Add new media files if any
            if (editMediaFiles.length > 0) {
                editMediaFiles.forEach((file) => {
                    formData.append('media[]', file);
                });
            }

            const response = await axios.post(route('posts.update', post.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-HTTP-Method-Override': 'PUT',
                },
            });

            if (response.data.post) {
                post.caption = response.data.post.caption;
                post.media = response.data.post.media;
                post.comments = response.data.post.comments;
                post.likes_count = response.data.post.likes_count;
                post.comments_count = response.data.post.comments_count;
            }

            setEditMediaPreviews(post.media);
            setOldMediaIds(post.media.map(m => m.id));
            setCurrentMediaIndex(0);
            setEditMediaFiles([]);

            Swal.fire({
                title: 'Success!',
                text: 'Post updated successfully.',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
            });

            setShowEditModal(false);
            setShowDropdown(false);
        } catch (error) {
            console.error('Error updating post:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update post.',
                icon: 'error',
            });
        } finally {
            setEditLoading(false);
        }
    };

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);

        const newPreviews = files.map((file) => ({
            media_path: URL.createObjectURL(file),
            media_type: file.type.startsWith('video/') ? 'video' : 'image',
            id: null,
            isNew: true,
        }));

        const currentOldMedia = editMediaPreviews.filter(m => m.id !== null);
        setEditMediaPreviews([...currentOldMedia, ...newPreviews]);
        setEditMediaFiles([...editMediaFiles, ...files]);
    };

    const removeMediaPreview = (index) => {
        const removedMedia = editMediaPreviews[index];

        if (removedMedia.id !== null && removedMedia.id !== undefined) {
            setOldMediaIds(oldMediaIds.filter(id => id !== removedMedia.id));
        } else {
            const newMediaIndex = editMediaPreviews
                .filter(m => m.isNew)
                .findIndex(m => m.media_path === removedMedia.media_path);

            if (newMediaIndex !== -1) {
                setEditMediaFiles(editMediaFiles.filter((_, i) => i !== newMediaIndex));
            }
        }

        setEditMediaPreviews(editMediaPreviews.filter((_, i) => i !== index));
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
                onClose();
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete post.',
                    icon: 'error',
                });
            }
        }
    };

    const handleReply = async (e, commentId) => {
        e.preventDefault();

        if (!replyText.trim()) return;

        setReplyLoading(true);

        try {
            const response = await axios.post(
                route('comments.reply', commentId),
                { content: replyText }
            );

            setComments(comments.map(comment =>
                comment.id === commentId
                    ? {
                        ...comment,
                        replies: [...(comment.replies || []), response.data.reply]
                    }
                    : comment
            ));

            setReplyText('');
            setReplyingTo(null);
        } catch (error) {
            console.error('Error posting reply:', error);
        } finally {
            setReplyLoading(false);
        }
    };

    const media = post.media || [];
    const currentMedia = media[currentMediaIndex];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Post</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Caption</label>
                            <textarea
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                                placeholder="Write a caption..."
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                                rows="4"
                                disabled={editLoading}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Media</label>

                            {editMediaPreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {editMediaPreviews.map((m, index) => (
                                        <div key={index} className="relative group">
                                            {m.media_type === 'video' ? (
                                                <video
                                                    src={m.media_path}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <img
                                                    src={m.media_path}
                                                    alt={`preview-${index}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                            )}
                                            {m.id && (
                                                <span className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                    Existing
                                                </span>
                                            )}
                                            <button
                                                onClick={() => removeMediaPreview(index)}
                                                disabled={editLoading}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleMediaChange}
                                disabled={editLoading}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    dark:file:bg-gray-700 dark:file:text-blue-400
                                    disabled:opacity-50"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Add new media to existing ones, or remove items individually. Supported: JPEG, PNG, GIF, MP4, MOV, AVI
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditMediaFiles([]);
                                }}
                                disabled={editLoading}
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditPost}
                                disabled={editLoading}
                                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                            >
                                {editLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                {media.length > 0 && (
                    <div className="relative bg-gray-100 dark:bg-black w-full md:w-1/2 flex items-center justify-center">
                        {currentMedia && currentMedia.media_type === 'video' ? (
                            <video
                                src={currentMedia.media_path}
                                controls
                                className="w-full h-auto max-h-[90vh] md:max-h-[90vh] object-contain"
                            />
                        ) : currentMedia ? (
                            <img
                                src={currentMedia.media_path}
                                alt="Post media"
                                className="w-full h-auto max-h-[90vh] md:max-h-[90vh] object-contain"
                            />
                        ) : null}

                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentMediaIndex((currentMediaIndex - 1 + media.length) % media.length)}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-700 px-2 py-0.5 rounded-full hover:bg-opacity-75"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
                                    </svg>

                                </button>
                                <button
                                    onClick={() => setCurrentMediaIndex((currentMediaIndex + 1) % media.length)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-700 px-2 py-0.5 rounded-full hover:bg-opacity-75"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                    </svg>

                                </button>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-50 text-gray-700 px-3 py-1 rounded-full text-xs">
                                    {currentMediaIndex + 1} / {media.length}
                                </div>
                            </>
                        )}

                        {media.length > 1 && (
                            <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2 bg-gray-100 dark:bg-gray-900 overflow-x-auto">
                                {media.map((m, index) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setCurrentMediaIndex(index)}
                                        className={`flex-shrink-0 w-12 h-12 rounded ${currentMediaIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        {m.media_type === 'video' ? (
                                            <video src={m.media_path} className="w-full h-full object-cover rounded" />
                                        ) : (
                                            <img src={m.media_path} alt={`thumbnail-${index}`} className="w-full h-full object-cover rounded" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                                {post.user.avatar_path ? (
                                    <img
                                        src={`/storage/${post.user.avatar_path}`}
                                        alt={post.user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-bold">
                                        {post.user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{post.user.name}</p>
                                <p className="text-xs text-gray-500">{post.created_at}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 relative">
                            <div>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-bold text-lg p-1"
                                >
                                    ⋮
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
                                        {isUserLoggedIn && auth.user.id === post.user.id && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setShowEditModal(true);
                                                        setShowDropdown(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDropdown(false);
                                                        handleDeletePost();
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={onClose}
                                            className={`block w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 ${isUserLoggedIn && auth.user.id === post.user.id ? 'last:rounded-b-lg' : 'first:rounded-t-lg last:rounded-b-lg'}`}
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {post.caption && (
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-gray-900 dark:text-white">
                                <span className="font-bold">{post.user.name}</span> {post.caption}
                            </p>
                        </div>
                    )}

                    <div className="px-4 py-2 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={handleLike}
                                disabled={!isUserLoggedIn}
                                className={`font-bold transition-opacity ${!isUserLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={!isUserLoggedIn ? 'Login to like' : ''}
                            >
                                {liked ? (
                                    <svg className="w-6 h-6 text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                                    </svg>
                                )}
                            </button>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {postComments.length === 0 ? (
                            <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
                        ) : (
                            postComments.map((comment) => (
                                <div key={comment.id} className="space-y-2">
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold overflow-hidden">
                                            {comment.user.avatar_path ? (
                                                <img
                                                    src={`/storage/${comment.user.avatar_path}`}
                                                    alt={comment.user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                comment.user.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{comment.user.name}</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                                            </div>
                                            <div className="flex gap-3 mt-1 text-xs text-gray-500 px-3">
                                                <span>{comment.created_at}</span>
                                                {isUserLoggedIn && (
                                                    <button
                                                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-semibold"
                                                    >
                                                        Reply
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="ml-8 space-y-2">
                                            {comment.replies.map((reply) => (
                                                <div key={reply.id} className="flex gap-2">
                                                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs overflow-hidden">
                                                        {reply.user.avatar_path ? (
                                                            <img
                                                                src={`/storage/${reply.user.avatar_path}`}
                                                                alt={reply.user.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            reply.user.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1.5">
                                                            <p className="text-xs font-bold text-gray-900 dark:text-white">{reply.user.name}</p>
                                                            <p className="text-xs text-gray-700 dark:text-gray-300">{reply.content}</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-0.5 px-3">{reply.created_at}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {replyingTo === comment.id && isUserLoggedIn && (
                                        <form onSubmit={(e) => handleReply(e, comment.id)} className="ml-8 flex gap-2 mt-2">
                                            <input
                                                type="text"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder={`Reply to ${comment.user.name}...`}
                                                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                                disabled={replyLoading}
                                            />
                                            <button
                                                type="submit"
                                                disabled={replyLoading || !replyText.trim()}
                                                className="text-blue-500 font-bold text-xs hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {replyLoading ? '...' : 'Reply'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {isUserLoggedIn ? (
                        <form onSubmit={handleComment} className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !commentText.trim()}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-500 text-sm">
                                <a href={route('login')} className="text-blue-500 hover:underline">
                                    Log in
                                </a>{' '}
                                to like or comment
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
