import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

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

                    <h2 className="mb-6 text-left font-semibold text-3xl">Forgot Password</h2>

                    <div className="mb-4 text-sm text-gray-600">
                        Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.
                    </div>

                    {status === 'password-reset-link-sent' && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            A password reset link has been sent to your email address.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2">
                            <Link
                                href={route('login')}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Back to login
                            </Link>

                            <PrimaryButton className="ms-4" disabled={processing}>
                                Send Reset Link
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </GuestLayout>
    );
}
