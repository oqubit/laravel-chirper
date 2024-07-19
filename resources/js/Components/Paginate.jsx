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
    pageNumsToShow,
    currentPage,
    lastPage,
    pageLinksArray,
    handleClickPrev,
    handleClickNext,
    handlePageChange,
}) {
    const pageNumsArrayHTML = [];
    const pageNumsStepDown = Math.floor(pageNumsToShow / 2) - (pageNumsToShow % 2 === 0) * 1;
    const pageNumsStepUp = Math.floor(pageNumsToShow / 2);
    const min = Math.max(Math.min(currentPage - pageNumsStepDown, lastPage - pageNumsToShow + 1), 1);
    const max = Math.max(Math.min(currentPage + pageNumsStepUp, lastPage), Math.min(pageNumsToShow, lastPage));
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

                {(min > 1) && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {pageNumsArrayHTML}

                {(max < lastPage) && (
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