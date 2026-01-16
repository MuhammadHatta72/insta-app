import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PostForm({ onClose, auth }) {
    const [caption, setCaption] = useState('');
    const [media, setMedia] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);

        if (media.length + files.length > 10) {
            Swal.fire({
                icon: 'warning',
                title: 'Too Many Files',
                text: 'Maximum 10 files allowed',
            });
            return;
        }

        setMedia([...media, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, {
                    url: reader.result,
                    type: file.type.startsWith('video/') ? 'video' : 'image'
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeMedia = (index) => {
        setMedia(media.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (media.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Media Selected',
                text: 'Please select at least one media file',
            });
            return;
        }

        setLoading(true);
        const loadingAlert = Swal.fire({
            title: 'Uploading...',
            html: '<p>Please wait while your post is being created</p>',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const formData = new FormData();
        formData.append('caption', caption);

        media.forEach((file, index) => {
            formData.append(`media[${index}]`, file);
        });

        try {
            const response = await axios.post(route('posts.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
            });

            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your post has been created successfully',
                timer: 2000,
                timerProgressBar: true,
            });

            router.visit(route('posts.index'));
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create post';
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Caption
                    </label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        maxLength={2200}
                    />
                    <p className="text-xs text-gray-500 mt-1">{caption.length}/2200</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Media (Photos/Videos) - Max 10 files
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleMediaChange}
                        className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    dark:file:bg-gray-700 dark:file:text-blue-400
                                    disabled:opacity-50"
                    />
                </div>

                {previews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative">
                                {preview.type === 'video' ? (
                                    <video src={preview.url} className="w-full h-32 object-cover rounded" />
                                ) : (
                                    <img src={preview.url} alt={`preview-${index}`} className="w-full h-32 object-cover rounded" />
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeMedia(index)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
