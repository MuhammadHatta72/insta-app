import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function UpdateProfileInformationForm({
    user,
    mustVerifyEmail,
    status,
    className = '',
}) {
    const [preview, setPreview] = useState(
        user.avatar_path ? `/storage/${user.avatar_path}` : null
    );
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        avatar: null,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        if (formData.avatar) {
            data.append('avatar', formData.avatar);
        }
        data.append('_method', 'PATCH');

        try {
            const response = await axios.post(route('profile.update'), data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 2000);

            if (formData.avatar) {
                setPreview(URL.createObjectURL(formData.avatar));
                setFormData({ ...formData, avatar: null });
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
            console.error('Error:', error);
        } finally {
            setProcessing(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAvatar = async () => {
        const result = await Swal.fire({
            title: 'Delete Avatar?',
            text: 'Are you sure you want to delete your avatar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                setProcessing(true);
                await axios.post(route('profile.delete-avatar'), {
                    _method: 'DELETE',
                });
                setPreview(null);
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your avatar has been deleted.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                });
            } catch (error) {
                console.error('Error deleting avatar:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete avatar.',
                    icon: 'error',
                });
            } finally {
                setProcessing(false);
            }
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="avatar" value="Avatar" />

                    <div className="mt-2 flex items-center gap-4">
                        {preview && (
                            <img
                                src={preview}
                                alt={formData.name}
                                className="h-20 w-20 rounded-full object-cover border border-gray-300"
                            />
                        )}
                        <div className="flex gap-2">
                            <label
                                htmlFor="avatar"
                                className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                            >
                                Choose Image
                            </label>
                            {preview && (
                                <button
                                    type="button"
                                    onClick={handleDeleteAvatar}
                                    disabled={processing}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    Delete Avatar
                                </button>
                            )}
                        </div>
                    </div>

                    <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />

                    {errors.avatar && (
                        <InputError message={errors.avatar[0]} className="mt-2" />
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        className="mt-1 block w-full"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        autoComplete="name"
                    />

                    {errors.name && (
                        <InputError message={errors.name[0]} className="mt-2" />
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        autoComplete="username"
                    />

                    {errors.email && (
                        <InputError message={errors.email[0]} className="mt-2" />
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email
                                address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
