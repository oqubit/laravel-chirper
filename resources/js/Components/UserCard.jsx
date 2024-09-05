import { Link, router, useForm, usePage } from "@inertiajs/react";
import SecondaryButton from "./SecondaryButton";

export default function UseCard({ user }) {
    const { auth } = usePage().props;
    const { post } = useForm({
        id: user.id,
    });

    const submitFollow = (e) => {
        e.preventDefault();
        post(route("follow.store"), { only: ["following"], preserveScroll: true });
    };

    const submitUnfollow = (e) => {
        e.preventDefault();
        router.delete(route("follow.destroy", user.id), { only: ["following"], preserveScroll: true });
    };

    return (
        <div className="flex items-center justify-between space-x-6 p-6">
            <div className="flex gap-x-4">
                <div className="min-w-0 flex-auto">
                    <Link
                        href={route('profile.show', user.id)}
                        className="text-md font-semibold leading-6 text-gray-800 capitalize hover:text-gray-500 hover:underline focus:text-gray-500 active:text-gray-900"
                    >
                        {user.name}
                    </Link>
                </div>
            </div>
            {user.id !== auth.user.id && (
                <div className="my-0 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:mt-0 sm:flex-row sm:pr-3">
                    {user.following
                        ?
                        <form onSubmit={submitUnfollow} className="flex flex-col">
                            <SecondaryButton className="justify-center" type='submit'>Unfollow</SecondaryButton>
                        </form>
                        :
                        <form onSubmit={submitFollow} className="flex flex-col">
                            <button>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-blue-400 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-150 group-hover:duration-150" />
                                    <div className="relative px-4 py-2 bg-purple-50 border border-gray-300 text-gray-900 font-semibold text-xs uppercase tracking-widest rounded-md">
                                        Follow
                                    </div>
                                </div>
                            </button>
                        </form>
                    }
                </div>
            )}
        </div>
    );
}