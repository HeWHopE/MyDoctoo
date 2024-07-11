import { cn } from '../../../utils/cn';
import Icon from '../Icon/Icon';

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onClick: (pageNumber: number) => void;
  pageCountToShow?: number;
  wrapperClassName?: string;
};

export const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onClick,
  pageCountToShow = 4,
  wrapperClassName,
}: PaginationProps) => {
  const lastPageNumber = Math.ceil(totalItems / itemsPerPage);
  const firstPageNumberToShow = currentPage - (currentPage % pageCountToShow) || 1;
  const pages = [];
  if (firstPageNumberToShow >= pageCountToShow)
    pages.push(<PageNumber onClick={() => onClick(1)}>1</PageNumber>, <span className='text-black'>...</span>);
  for (let i = firstPageNumberToShow; i < firstPageNumberToShow + pageCountToShow && i <= lastPageNumber; i++) {
    const isCurrentPage = i === currentPage;
    const pageNumber = (
      <PageNumber selected={isCurrentPage} onClick={() => onClick(i)}>
        {i}
      </PageNumber>
    );
    pages.push(pageNumber);
  }
  if (lastPageNumber > firstPageNumberToShow + pageCountToShow)
    pages.push(
      <span className='text-black'>...</span>,
      <PageNumber onClick={() => onClick(lastPageNumber)}>{lastPageNumber}</PageNumber>,
    );
  return (
    <div className={cn('flex space-x-2', wrapperClassName)}>
      <PageNumber disabled={currentPage === 1} onClick={() => onClick(currentPage - 1)}>
        <Icon variant='shevron-right' className='rotate-180' />
      </PageNumber>
      {pages}
      <PageNumber disabled={currentPage === lastPageNumber} onClick={() => onClick(currentPage + 1)}>
        <Icon variant='shevron-right' />
      </PageNumber>
    </div>
  );
};

type PageNumberProps = {
  disabled?: boolean;
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

function PageNumber({ disabled, selected, children, onClick, className }: PageNumberProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        `rounded-xl ${selected ? 'bg-main-light' : ''} ${!disabled ? 'hover:bg-main-light' : 'text-grey-2'} px-2`,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
