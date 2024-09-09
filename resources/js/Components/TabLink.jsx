import { Link } from "@inertiajs/react";

export default function TabLink({ tab, tabIdx, tabLength }) {
    return (
        <Link
            href={tab.href}
            only={tab.only}
            className={`\
                ${tab.active ? "text-gray-900" : "text-gray-500 hover:text-gray-700"} \
                ${tabIdx === 0 ? "rounded-l-lg" : ""} \
                ${tabIdx === tabLength - 1 ? "rounded-r-lg" : ""} \
                group relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10`}
            aria-current={(tab.active ? "page" : "undefined")}
        >
            <span>{tab.text}</span>
            <span
                aria-hidden="true"
                className={(tab.active ? "bg-indigo-500" : "bg-transparent") + "absolute inset-x-0 bottom-0 h-0.5"}
            />
        </Link>
    );
}