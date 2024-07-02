import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./ui/pagination";

export default function Paginate({
    currentPage,
    lastPage,
    pageLinksArray,
    handleClickPrev,
    handleClickNext,
    handlePageChange,
}) {
    const pageNumsArrayHTML = [];
    const extraMin = currentPage == lastPage ? 1 : 0;
    const extraMax = currentPage == 1 ? 1 : 0;
    const min = Math.max(currentPage - 1 - extraMin, 1);
    const max = Math.min(currentPage + 1 + extraMax, lastPage);
    for (let i = min; i <= max; i++) {
        pageNumsArrayHTML.push(
            <PaginationItem key={i}>
                <PaginationLink
                    isActive={i == currentPage}
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageLinksArray[i].url);
                    }}
                >
                    {i}
                </PaginationLink>
            </PaginationItem>
        );
    }
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={(e) => {
                            e.preventDefault();
                            handleClickPrev();
                        }}
                        className={currentPage == 1 &&
                            "pointer-events-none text-gray-400"
                        }
                    />
                </PaginationItem>

                {currentPage > 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {pageNumsArrayHTML}

                {currentPage + 1 < lastPage && (
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
                        className={currentPage == lastPage &&
                            "pointer-events-none text-gray-400"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}