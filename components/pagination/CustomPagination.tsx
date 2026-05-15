'use client'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface AppPaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const CustomPagination = ({
    totalPages,
    currentPage,
    onPageChange
}: AppPaginationProps) => {

    const renderPageNumbers = () => {
        const pages = []
        const maxInvisible = 3 //so luong page hien thi

        for (let i = 1; i <= totalPages; i++) {

            if (
                i === 1 ||
                i === totalPages ||
                i >= currentPage - 1 || i <= currentPage + 1
            ) {
                pages.push(
                    <PaginationItem key={i} className="cursor-pointer">
                        <PaginationLink
                            isActive={currentPage === 1}
                            onClick={() => onPageChange(i)}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                )
            } else if (
                i === currentPage - 2 ||
                i === currentPage + 2
            ) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationEllipsis />
                    </PaginationItem>
                )
            }
        }

        return pages
    }

    if (totalPages <= 1) return null

    return (
        <Pagination className="my-8">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) onPageChange(currentPage - 1)
                        }}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {renderPageNumbers()}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default CustomPagination