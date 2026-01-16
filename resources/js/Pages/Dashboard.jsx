import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import PostStatistics from '@/Components/PostStatistics';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;
    return (
        <AuthenticatedLayout
            header="Dashboard"
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome {auth.user.name} to your Dashboard!</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Here you can find an overview of your post statistics.</p>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <PostStatistics stats={stats} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
