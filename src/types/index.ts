// User types
export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

// Comment types
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Application state types
export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  field: keyof Comment | null;
  direction: SortDirection;
}

export interface FilterState {
  search: string;
  sortState: SortState;
  currentPage: number;
  pageSize: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
}

// Search fields type
export type SearchableFields = 'name' | 'email' | 'body';

// Sortable fields type
export type SortableFields = 'postId' | 'name' | 'email';
