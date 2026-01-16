import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { url } = usePage();
    const isAuthPage = url.includes('login') || url.includes('register');

    return (
        <>
            {!isAuthPage && (
                <nav className="bg-white dark:bg-gray-800 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link href={route('posts.index')} className="text-xl font-bold text-gray-900 dark:text-white">
                                    <img src="/assets/img/logo-insta.svg" alt="InstaApp" className="h-8 w-8 inline-block mr-2" />
                                    InstaApp
                                </Link>
                            </div>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={route('login')}
                                    className="bg-[#4a5ef9] hover:bg-[#3b4ac1] text-white font-bold py-1 px-4 rounded-md"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="text-[#4a5ef9] font-bold py-1.5 px-1.5 rounded"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            <main className="bg-gray-100 dark:bg-gray-900 flex-grow">
                {children}
            </main>

            {!isAuthPage && (
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} InstaApp. All rights reserved.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
