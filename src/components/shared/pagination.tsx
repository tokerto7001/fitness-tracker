import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
    currentPage: number;
    baseUrlToNavigate: string;
    isPreviousDisabled: boolean;
    isNextDisabled: boolean;
}

export default function CustomPagination({currentPage, baseUrlToNavigate, isPreviousDisabled, isNextDisabled}: CustomPaginationProps) {

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={isPreviousDisabled} href={`${baseUrlToNavigate}&page=${currentPage - 1}`} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext disabled={isNextDisabled} href={`${baseUrlToNavigate}&page=${currentPage + 1}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
