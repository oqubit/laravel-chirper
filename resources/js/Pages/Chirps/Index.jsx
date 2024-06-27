import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import LoadingSpinner from "@/Components/LoadingSpinner";
import ChirpsList from "@/Components/ChirpsList";
import { useForm, Head, router } from "@inertiajs/react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";


export default function Index({ auth, chirps }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: "",
    });

    const [chirpz, setChirpz] = useState(chirps);
    const [loading, setLoading] = useState(false);

    const handlePageChange = (url) => {
        setLoading(true);
        router.get(url, { only: ["chirps"] }, { preserveScroll: true }, {
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

                {loading ? (
                    <LoadingSpinner className="h-[38rem]" />
                ) : (
                    <ChirpsList
                        chirps={chirpz}
                        onChirpEdit={onChirpEdit}
                        onChirpDelete={onChirpDelete}
                    />
                )}

                <div className="mt-3 bg-white shadow-sm rounded-lg divide-y">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClickPrev();
                                    }}
                                    className={chirpz.current_page == 1 &&
                                        "pointer-events-none text-gray-400"
                                    }
                                />
                            </PaginationItem>

                            {chirpz.current_page > 2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            {(() => {
                                const rows = [];
                                const currPage = chirpz.current_page;
                                const extraMin = currPage == chirpz.last_page ? 1 : 0;
                                const extraMax = currPage == 1 ? 1 : 0;
                                const min = Math.max(currPage - 1 - extraMin, 1);
                                const max = Math.min(currPage + 1 + extraMax, chirpz.last_page);
                                for (let i = min; i <= max; i++) {
                                    rows.push(
                                        <PaginationItem>
                                            <PaginationLink
                                                isActive={i == currPage}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(chirpz.links[i].url);
                                                }}
                                            >
                                                {i}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                return rows;
                            })()}

                            {chirpz.current_page + 1 < chirpz.last_page && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleClickNext();
                                    }}
                                    className={chirpz.current_page == chirpz.last_page &&
                                        "pointer-events-none text-gray-400"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
