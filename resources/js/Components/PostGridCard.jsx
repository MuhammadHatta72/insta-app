import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function PostGridCard({ post, auth, onPostClick }) {
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [liked, setLiked] = useState(post.is_liked);

    const media = post.media || [];
    const currentMedia = media[currentMediaIndex];

    return (
        <div
            onClick={() => onPostClick(post)}
            className="relative bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer"
        >
            {media.length > 0 && (
                <div className="relative bg-gray-100 dark:bg-black aspect-square overflow-hidden">
                    {currentMedia && currentMedia.media_type == 'video' ? (
                        <video
                            src={currentMedia.media_path}
                            className="w-full h-full object-cover"
                        />
                    ) : currentMedia ? (
                        <img
                            src={currentMedia.media_path}
                            alt="Post media"
                            className="w-full h-full object-cover"
                        />
                    ) : null}

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-4 text-white text-center">
                            <div className="flex flex-col items-center">
                                <span className="text-2xl">{liked ? (
                                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                                    </svg>
                                )}</span>
                                <span className="text-sm font-bold">{post.likes_count}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-2xl">
                                    <svg className="w-6 h-6 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M3 5.983C3 4.888 3.895 4 5 4h14c1.105 0 2 .888 2 1.983v8.923a1.992 1.992 0 0 1-2 1.983h-6.6l-2.867 2.7c-.955.899-2.533.228-2.533-1.08v-1.62H5c-1.105 0-2-.888-2-1.983V5.983Zm5.706 3.809a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Zm2.585.002a1 1 0 1 1 .003 1.414 1 1 0 0 1-.003-1.414Zm5.415-.002a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Z" clipRule="evenodd" />
                                    </svg>

                                </span>
                                <span className="text-sm font-bold">{post.comments_count}</span>
                            </div>
                        </div>
                    </div>

                    {media.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentMediaIndex((currentMediaIndex - 1 + media.length) % media.length);
                                }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-700 px-1.5 py-0.5 rounded-full hover:bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12l4-4m-4 4 4 4" />
                                </svg>

                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentMediaIndex((currentMediaIndex + 1) % media.length);
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-gray-700 px-1.5 py-0.5 rounded-full hover:bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                                </svg>
                            </button>

                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-50 text-gray-700 px-2 py-0.5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                {currentMediaIndex + 1} / {media.length}
                            </div>

                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                                {media.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all ${currentMediaIndex === index
                                            ? 'bg-white'
                                            : 'bg-white bg-opacity-50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
