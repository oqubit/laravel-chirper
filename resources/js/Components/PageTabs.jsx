import TabLink from "./TabLink";

export default function PageTabs({ tabs }) {
    return (
        <nav
            className="isolate flex divide-x mt-3 divide-gray-200 rounded-lg shadow overflow-hidden"
            aria-label="Tabs"
        >
            {tabs.map((tab, idx) => (
                <TabLink
                    tab={tab}
                    tabIdx={idx}
                    tabLength={tabs.length}
                    key={idx}
                />
            ))}
        </nav>
    );
}