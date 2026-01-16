import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

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

                    <h2 className="mb-6 text-left font-semibold text-3xl">Confirm Password</h2>

                    <div className="mb-4 text-sm text-gray-600">
                        This is a secure area of the application. Please confirm your password before continuing.
                    </div>

                    <form onSubmit={submit}>
                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <PrimaryButton className="ms-4" disabled={processing}>
                                Confirm
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>

        </GuestLayout>
    );
}
