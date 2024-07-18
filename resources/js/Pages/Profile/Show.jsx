import Chirp from "@/Components/Chirp";
import Heading from "@/Components/Heading";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ user, chirps, following }) {
    const { auth } = usePage().props;
    const [chirpz, setChirpz] = useState(chirps);

    const onChirpEdit = (page) => {
        setChirpz(page.props.chirps);
    };

    const onChirpDelete = (e, chirpID) => {
        e.preventDefault();
        router.delete(route("chirps.destroy", chirpID), {
            onSuccess: (page) => {
                setChirpz(page.props.chirps);
            }
        });
    };

    return (
        <Authenticated user={auth.user}>
            <Head title={user.name} />
            <Heading user={user} following={following} />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="mt-6 bg-white shadow-lg shadow-cyan-600 rounded-xl divide-y-4">
                    {chirpz.map((chirp) => (
                        <Chirp
                            key={chirp.id}
                            chirp={chirp}
                            onChirpEdit={onChirpEdit}
                            onChirpDelete={onChirpDelete}
                        />
                    ))}
                </div>
            </div>
        </Authenticated>
    );
}