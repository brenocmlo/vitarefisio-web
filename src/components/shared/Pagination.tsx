import React, { memo } from 'react';

interface PaginationProps {
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  totalItems: number;
  itemsPerPage?: number;
  currentCount: number;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = memo(({
  page,
  setPage,
  totalItems,
  itemsPerPage = 20,
  currentCount,
  loading = false,
}) => {
  return (
    <div className="mt-6 flex items-center justify-between px-2">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        Total: {totalItems} itens
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className="secondary-button py-2 px-4 text-xs disabled:opacity-30"
        >
          Anterior
        </button>
        <span className="flex items-center px-3 text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          {page}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={currentCount < itemsPerPage || loading}
          className="secondary-button py-2 px-4 text-xs disabled:opacity-30"
        >
          Próximo
        </button>
      </div>
    </div>
  );
});
export default Pagination;
