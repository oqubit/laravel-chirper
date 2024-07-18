import React, { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import LoadingSpinner from "@/Components/LoadingSpinner";
import ChirpsList from "@/Components/ChirpsList";
import { useForm, Head, router } from "@inertiajs/react";
import Paginate from "@/Components/Paginate";
import FilterTabs from "@/Components/FilterTabs";

export default function Index({ auth, chirps }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
    });

    const chirpsListRef = useRef(null);
    const [chirpz, setChirpz] = useState(chirps);
    const [loading, setLoading] = useState(false);
    const [chirpsListHeight, setChirpsListHeight] = useState(0);
    const shouldFilter = route().current('chirps.index', { filter: 'true' });

    useEffect(() => {
        if (chirpsListRef.current) {
            const style = window.getComputedStyle(chirpsListRef.current);
            const height = chirpsListRef.current.offsetHeight + parseInt(style.marginTop);
            setChirpsListHeight(height);
        }
    }, [chirps]);

    const handlePageChange = (url) => {
        setLoading(true);
        router.get(url, { filter: shouldFilter ? 'true' : 'false' }, {
            only: ['chirps'],
            preserveScroll: true,
            onSuccess: (page) => {
                setChirpz(page.props.chirps);
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            }
        });
    };

    const handleClickNext = () => {
        if (chirpz.next_page_url) {
            handlePageChange(chirpz.next_page_url);
        }
    };

    const handleClickPrev = () => {
        if (chirpz.prev_page_url) {
            handlePageChange(chirpz.prev_page_url);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("chirps.store"), {
            onSuccess: (page) => {
                reset();
                setChirpz(page.props.chirps);
            }
        });
    };

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
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chirps" />

            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <form onSubmit={submit}>
                    <textarea
                        value={data.message}
                        placeholder="What's on your mind?"
                        className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                        onChange={(e) => setData("message", e.target.value)}
                    ></textarea>
                    <InputError message={errors.message} className="mt-2" />
                    <PrimaryButton className="mt-4" disabled={processing}>
                        Chirp
                    </PrimaryButton>
                </form>

                <FilterTabs shouldFilter={shouldFilter} />

                {loading ? (
                    <LoadingSpinner style={{ height: chirpsListHeight }} />
                ) : (
                    <ChirpsList
                        ref={chirpsListRef}
                        chirps={chirpz}
                        onChirpEdit={onChirpEdit}
                        onChirpDelete={onChirpDelete}
                    />
                )}

                <div className="mt-3 bg-white shadow-sm rounded-lg divide-y">
                    <Paginate
                        currentPage={chirpz.current_page}
                        lastPage={chirpz.last_page}
                        pageLinksArray={chirpz.links}
                        handleClickNext={handleClickNext}
                        handleClickPrev={handleClickPrev}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
