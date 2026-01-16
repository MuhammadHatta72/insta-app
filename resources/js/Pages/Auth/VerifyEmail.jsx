import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="h-screen w-full flex flex-row">
                <div className="hidden md:flex md:w-1/2 lg:w-2/3 justify-center items-center rounded-l-lg">
                    <img
                        src="/assets/img/img-login.png"
                        alt="InstaApp Logo"
                        className="w-full h-auto p-4"
                    />
                    <p className="absolute bottom-4 text-gray-400 text-sm">
                        By Instagram clone app
                    </p>
                </div>

                <div className="w-full md:w-1/2 lg:w-1/3 bg-white flex flex-col justify-center p-6">
                    <div className="flex flex-col items-start mb-8">
                        <img src="/assets/img/logo-insta.svg" alt="InstaApp" className="h-24 w-24 mb-2" />
                        <h1 className="text-2xl font-bold text-gray-900">InstaApp</h1>
                    </div>

                    <h2 className="mb-6 text-left font-semibold text-3xl">Verify Email</h2>

                    <div className="mb-4 text-sm text-gray-600">
                        Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just emailed to you.
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            A new verification link has been sent to your email address.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mt-4 flex items-center justify-between gap-2">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Log Out
                            </Link>

                            <PrimaryButton disabled={processing}>
                                Resend Verification Email
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </GuestLayout>
    );
}
