import { Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserCard from "@/Components/UserCard";
import PageTabs from "@/Components/PageTabs";

export default function Index({ user, followList }) {
    const pageTitle = route().current('followers') ? (
        `${user.name} Followers`
    ) : (
        `${user.name} Follows`
    );

    const tabs = [
        {
            href: route('followers', user.id),
            active: route().current('followers', user.id),
            text: 'Followers'
        },
        {
            href: route('follow.index', user.id),
            active: route().current('follow.index', user.id),
            text: 'Following'
        }
    ]

    return (
        <AuthenticatedLayout user={user}>
            <Head title={pageTitle} />
            <h1 className="bg-white p-6 lg:p-8">
                <Link
                    href={route('profile.show', user.id)}
                    className="text-2xl font-bold text-gray-900 capitalize hover:text-gray-500 hover:underline focus:text-gray-500 active:text-gray-950"
                >
                    {pageTitle}
                </Link>
            </h1>
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <PageTabs tabs={tabs} />
                <div className="divide-y bg-white mt-6 rounded-lg">
                    {followList.map((user) => (
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