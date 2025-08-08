import React, { useState } from "react";
import { Comment, SortState, SortableFields } from "../types";

interface CommentsTableProps {
  comments: Comment[];
  sortState: SortState;
  onSort: (field: SortableFields) => void;
}

const CommentsTable: React.FC<CommentsTableProps> = ({
  comments,
  sortState,
  onSort,
}) => {
  const getSortIcon = (field: SortableFields) => {
    if (sortState.field !== field) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    if (sortState.direction === "asc") {
      return (
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    }

    if (sortState.direction === "desc") {
      return (
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  };

  const handleSort = (field: SortableFields) => {
    onSort(field);
  };

  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );

  const toggleCommentExpansion = (commentId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const isCommentExpanded = (commentId: number) => {
    return expandedComments.has(commentId);
  };

  const truncateText = (
    text: string,
    maxLength: number = 100,
    isMobile: boolean = false
  ) => {
    if (!isMobile || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getMobileCharLimit = () => {
    return window.innerWidth < 640 ? 30 : window.innerWidth < 768 ? 50 : 100;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              scope="col"
              className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort("postId")}>
              <div className="flex items-center space-x-1">
                <span>Post ID</span>
                {getSortIcon("postId")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort("name")}>
              <div className="flex items-center space-x-1">
                <span>Name</span>
                {getSortIcon("name")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort("email")}>
              <div className="flex items-center space-x-1">
                <span>Email</span>
                {getSortIcon("email")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">
              Comment
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {comments.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-lg font-medium">No comments found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            comments.map((comment, index) => {
              const mobileCharLimit = getMobileCharLimit();
              const isMobile = window.innerWidth < 768;

              const commentExpanded = isCommentExpanded(comment.id);

              return (
                <tr
                  key={comment.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}>
                  <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">
                    {`123${comment.id}`}
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {truncateText(
                          comment.name,
                          isMobile ? mobileCharLimit : 50
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {isMobile
                          ? truncateText(comment.email, mobileCharLimit, true)
                          : comment.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-xs sm:text-sm text-gray-900">
                        {isMobile && comment.body.length > mobileCharLimit ? (
                          <>
                            {commentExpanded
                              ? comment.body
                              : truncateText(
                                  comment.body,
                                  mobileCharLimit,
                                  true
                                )}
                            <button
                              onClick={() => toggleCommentExpansion(comment.id)}
                              className="ml-2 text-blue-600 hover:text-blue-800 text-xs font-medium">
                              {commentExpanded ? "See less" : "See more"}
                            </button>
                          </>
                        ) : (
                          truncateText(comment.body, 100)
                        )}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommentsTable;
