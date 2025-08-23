import { useQuery } from '@tanstack/react-query'
import { fetchDocumentsMock } from '../api/mockDocuments'
import { useState, useMemo } from 'react'

export function useDocuments() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type' | 'popularity'>('date')
  const [filterType, setFilterType] = useState<string>('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['documents', page, query, sortBy, filterType],
    queryFn: () => fetchDocumentsMock({ 
      page, 
      pageSize: 8, 
      query,
      sortBy,
      filterType
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  })

  const pagination = useMemo(() => ({
    currentPage: data?.page ?? page,
    totalPages: Math.max(1, Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 8))),
    hasNext: (data?.page ?? 1) * (data?.pageSize ?? 8) < (data?.total ?? 0),
    hasPrev: (data?.page ?? 1) > 1
  }), [data, page])

  return {
    documents: data?.data ?? [],
    isLoading,
    error,
    query,
    setQuery,
    page,
    setPage,
    sortBy,
    setSortBy,
    filterType,
    setFilterType,
    pagination,
    total: data?.total ?? 0
  }
}