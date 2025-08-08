import { Comment, SortState, PaginationInfo, SearchableFields } from '../types';

// Search function
export function searchComments(comments: Comment[], searchTerm: string): Comment[] {
  if (!searchTerm.trim()) return comments;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  const searchFields: SearchableFields[] = ['name', 'email', 'body'];
  
  return comments.filter(comment =>
    searchFields.some(field =>
      comment[field].toLowerCase().includes(lowercaseSearch)
    )
  );
}

// Sort function
export function sortComments(comments: Comment[], sortState: SortState): Comment[] {
  if (!sortState.field || !sortState.direction) return comments;
  
  return [...comments].sort((a, b) => {
    const aValue = a[sortState.field!];
    const bValue = b[sortState.field!];
    
    let comparison = 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    }
    
    return sortState.direction === 'asc' ? comparison : -comparison;
  });
}

// Pagination function
export function paginateComments(
  comments: Comment[],
  currentPage: number,
  pageSize: number
): { paginatedComments: Comment[]; paginationInfo: PaginationInfo } {
  const totalItems = comments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const paginatedComments = comments.slice(startIndex, endIndex);
  
  const paginationInfo: PaginationInfo = {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    startIndex: startIndex + 1, // 1-based for display
    endIndex,
  };
  
  return { paginatedComments, paginationInfo };
}

// Get next sort direction
export function getNextSortDirection(currentDirection: 'asc' | 'desc' | null): 'asc' | 'desc' | null {
  switch (currentDirection) {
    case null:
      return 'asc';
    case 'asc':
      return 'desc';
    case 'desc':
      return null;
    default:
      return 'asc';
  }
}
