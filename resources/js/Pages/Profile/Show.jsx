import Chirp from "@/Components/Chirp";
import Heading from "@/Components/Heading";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

export default function Show({ user, chirps }) {
    const { auth } = usePage().props;
    return (
        <Authenticated user={auth.user}>
            <Head title={user.name} />
            <Heading user={user} />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mt-6 bg-white shadow-lg shadow-cyan-600 rounded-xl divide-y-4">
                    {chirps.map((chirp) => (
                        <Chirp
                            key={chirp.id}
                            chirp={chirp}
                        />
                    ))}
                </div>
            </div>
        </Authenticated>
    );
}