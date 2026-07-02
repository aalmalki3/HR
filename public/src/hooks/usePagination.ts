import { useState, useCallback } from 'react'

interface UsePaginationProps {
  initialPage?: number
  initialPageSize?: number
}

interface UsePaginationReturn {
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  nextPage: () => void
  prevPage: () => void
}

export const usePagination = ({
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationProps): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  
  const nextPage = useCallback(() => setPage(prev => prev + 1), [])
  const prevPage = useCallback(() => setPage(prev => Math.max(prev - 1, 1)), [])
  
  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
  }
}
