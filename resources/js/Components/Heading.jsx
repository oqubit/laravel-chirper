import { Link, router, useForm, usePage } from "@inertiajs/react";
import dayjs from "dayjs";
import SecondaryButton from "./SecondaryButton";

export default function Heading({ user, following }) {
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
        <div className="bg-white transition-shadow ease-in-out duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-pink-200">
            <div className="max-w-7xl mx-auto pb-1 px-4 sm:px-6 lg:px-8 p-4 sm:py-6 lg:py-8 sm:flex sm:items-center sm:justify-between sm:space-x-5">
                <div className="flex items-start space-x-5">
                    <div className="pt-1.5">
                        <h1 className="text-2xl font-bold text-gray-900 capitalize">
                            {user.name}
                        </h1>
                        <p className="text-sm font-medium text-gray-500">
                            Joined:
                            {' '}
                            <time
                                dateTime={dayjs(user.created_at).format('YYYY-MM')}
                                className="relative after:absolute after:bg-gray-300 after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300"
                            >
                                {dayjs(user.created_at).format('MMMM YYYY')}
                            </time>
                        </p>
                    </div>
                </div>

                {user.id === auth.user.id
                    ?
                    <div className="my-3 flex flex-col-reverse justify-stretch sm:mt-1 sm:pr-3">
                        <Link
                            href={route('profile.edit')}
                        >
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-blue-400 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-150 group-hover:duration-150" />
                                <div className="relative px-4 py-1 bg-white text-gray-900 rounded-md">
                                    Edit Profile
                                </div>
                            </div>
                        </Link>
                    </div>
                    :
                    <div className="my-3 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:mt-0 sm:flex-row sm:pr-3">
                        {following
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
                }
            </div>
        </div>
    );
}