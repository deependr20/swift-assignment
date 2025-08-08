import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Comment, FilterState, SortableFields } from "../types";
import {
  searchComments,
  sortComments,
  paginateComments,
  getNextSortDirection,
} from "../utils/dataUtils";
import SearchBar from "../components/SearchBar";
import CommentsTable from "../components/CommentsTable";
import Pagination from "../components/Pagination";

const Dashboard: React.FC = () => {
  const {
    data: comments,
    loading,
    error,
  } = useApi<Comment[]>("https://jsonplaceholder.typicode.com/comments");

  // State persistence with localStorage
  const [filterState, setFilterState] = useLocalStorage<FilterState>(
    "dashboard-filters",
    {
      search: "",
      sortState: { field: null, direction: null },
      currentPage: 1,
      pageSize: 10,
    }
  );

  // Handle search
  const handleSearchChange = (search: string) => {
    setFilterState((prev) => ({
      ...prev,
      search,
      currentPage: 1, // Reset to first page when searching
    }));
  };

  // Handle sorting
  const handleSort = (field: SortableFields) => {
    setFilterState((prev) => {
      const isCurrentField = prev.sortState.field === field;
      const newDirection = isCurrentField
        ? getNextSortDirection(prev.sortState.direction)
        : "asc";

      return {
        ...prev,
        sortState: {
          field: newDirection ? field : null,
          direction: newDirection,
        },
        currentPage: 1, // Reset to first page when sorting
      };
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilterState((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilterState((prev) => ({
      ...prev,
      pageSize,
      currentPage: 1, // Reset to first page when changing page size
    }));
  };

  // Process data with search, sort, and pagination
  const processedData = useMemo(() => {
    if (!comments) return { paginatedComments: [], paginationInfo: null };

    // Apply search
    const searchedComments = searchComments(comments, filterState.search);

    // Apply sorting
    const sortedComments = sortComments(
      searchedComments,
      filterState.sortState
    );

    // Apply pagination
    const { paginatedComments, paginationInfo } = paginateComments(
      sortedComments,
      filterState.currentPage,
      filterState.pageSize
    );

    return { paginatedComments, paginationInfo };
  }, [comments, filterState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">
            Error loading comments
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header with Glassmorphism */}
      <div className="bg-white border-b border-gray-200 shadow-lg">
        <div className="md:px-12 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://cdn.prod.website-files.com/6509887b9119507025235a5a/650ada40fd6cf3427547c9d8_Swift%20logo.svg"
              alt="Swift Logo"
              className="h-10 w-auto"
            />
          </div>
          <div className="flex items-center space-x-4">
            
            <Link
              to="/profile"
              className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                LG
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  Leanne Graham
                </div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 mx-auto max-w-[80rem]">
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 md:p-6 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm font-medium text-gray-700 mr-2">
                Sort by:
              </div>
              <button
                onClick={() => handleSort("postId")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterState.sortState.field === "postId"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                <span>Post ID</span>
                {filterState.sortState.field === "postId" && (
                  <span className="text-xs">
                    {filterState.sortState.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleSort("name")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterState.sortState.field === "name"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                <span>Name</span>
                {filterState.sortState.field === "name" && (
                  <span className="text-xs">
                    {filterState.sortState.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleSort("email")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterState.sortState.field === "email"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                <span>Email</span>
                {filterState.sortState.field === "email" && (
                  <span className="text-xs">
                    {filterState.sortState.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </div>

            {/* Search */}
            <div className="relative lg:w-80">
              <SearchBar
                searchTerm={filterState.search}
                onSearchChange={handleSearchChange}
                placeholder="Search comments..."
              />
            </div>
          </div>
        </div>

        {/* Comments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <CommentsTable
            comments={processedData.paginatedComments}
            sortState={filterState.sortState}
            onSort={handleSort}
          />

          {/* Pagination */}
          {processedData.paginationInfo && (
            <Pagination
              paginationInfo={processedData.paginationInfo}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
