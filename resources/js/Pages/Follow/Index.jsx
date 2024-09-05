import { Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserCard from "@/Components/UserCard";

export default function Index({ user, following }) {
    return (
        <AuthenticatedLayout user={user}>
            <Head title={`${user.name} Follows`}/>
            <h1 className="bg-white p-6 lg:p-8">
                <Link 
                    href={route('profile.show', user.id)}
                    className="text-2xl font-bold text-gray-900 capitalize hover:text-gray-500 hover:underline focus:text-gray-500 active:text-gray-950"
                >
                    {`${user.name} Follows`}
                </Link>
            </h1>
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="divide-y bg-white mt-6 rounded-lg">
                    {following.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}