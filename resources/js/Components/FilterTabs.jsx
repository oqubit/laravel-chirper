import { Link } from "@inertiajs/react";

export default function FilterTabs({ shouldFilter }) {
    return (
        <nav
            className="isolate flex divide-x mt-3 divide-gray-200 rounded-lg shadow overflow-hidden"
            aria-label="Tabs"
        >
            <Link
                href={route('chirps.index', { filter: 'false' })}
                only={['chirps']}
                className={(!shouldFilter ? "text-gray-900" : "text-gray-500 hover:text-gray-700") + "group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"}
                aria-current={(!shouldFilter ? "page" : "undefined")}
            >
                <span>All</span>
                <span
                    aria-hidden="true"
                    className={(!shouldFilter ? "bg-indigo-500" : "bg-transparent") + "absolute inset-x-0 bottom-0 h-0.5"}
                />
            </Link>
            <Link
                href={route('chirps.index', { filter: 'true' })}
                only={['chirps']}
                className={(shouldFilter ? "text-gray-900" : "text-gray-500 hover:text-gray-700") + "group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"}
                aria-current={(shouldFilter ? "page" : "undefined")}
            >
                <span>Followed</span>
                <span
                    aria-hidden="true"
                    className={(shouldFilter ? "bg-indigo-500" : "bg-transparent") + "absolute inset-x-0 bottom-0 h-0.5"}
                />
            </Link>
        </nav>
    );
}