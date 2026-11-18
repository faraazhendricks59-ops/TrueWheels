"use client";

import { useCallback, useEffect, useState } from "react";
import { buildThread, COMMENT_PAGE_SIZE, type CommentNode } from "@/lib/comments";

/**
 * Pagination over a comment thread.
 *
 * The brief faked this. `loadMore` waited 800ms and then appended five comments
 * whose text was literally "Additional comment loaded from pagination", whose
 * avatars came from i.pravatar.cc with a random seed, and whose like counts were
 * `Math.floor(Math.random() * 10)`. So the reader would scroll, wait, and be
 * shown invented people with invented popularity, generated fresh each time.
 *
 * The delay is gone too. The brief used `setTimeout` to imitate a network call;
 * the comments here are in the page already, so paging through them is instant.
 * Holding data back behind a fake wait to make a skeleton appear is a
 * performance regression dressed as a feature.
 *
 * What is real: the thread is built from the seeded examples plus any reply the
 * reader has written on this device, and "show more" reveals further pages of
 * exactly that data.
 */
export function useCommentPagination(postId: string, pageSize: number = COMMENT_PAGE_SIZE) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isReady, setIsReady] = useState(false);

  const reload = useCallback(() => {
    setComments(buildThread(postId));
    setIsReady(true);
  }, [postId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const loadMore = useCallback(() => {
    setVisibleCount((count) => count + pageSize);
  }, [pageSize]);

  /** Adds a reply at the root or under an existing comment. */
  const addReply = useCallback((node: CommentNode) => {
    setComments((prev) => {
      if (node.parentId === null) return [node, ...prev];
      return prev.map((comment) => insertReply(comment, node));
    });
  }, []);

  const totalCount = comments.length;

  return {
    comments: comments.slice(0, visibleCount),
    loadMore,
    hasMore: visibleCount < totalCount,
    remaining: Math.max(0, totalCount - visibleCount),
    totalCount,
    addReply,
    reload,
    isReady,
  };
}

function insertReply(node: CommentNode, reply: CommentNode): CommentNode {
  if (node.id === reply.parentId) {
    return { ...node, children: [...node.children, reply] };
  }
  return { ...node, children: node.children.map((child) => insertReply(child, reply)) };
}
