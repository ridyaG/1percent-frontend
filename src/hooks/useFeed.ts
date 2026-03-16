import { useInfiniteQuery } from '@tanstack/react-query';
import { postsApi } from '../api/posts';

export function useHomeFeed(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['feed', 'home'],
    queryFn: ({ pageParam }) => postsApi.getHomeFeed(pageParam),
    getNextPageParam: (lastPage: { nextCursor?: string }) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useCommunityFeed(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['feed', 'community'],
    queryFn: ({ pageParam }) => postsApi.getCommunityFeed(pageParam),
    getNextPageParam: (lastPage: { nextCursor?: string }) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useExploreFeed(enabled = true) {
  return useInfiniteQuery({
    queryKey: ['feed', 'explore'],
    queryFn: ({ pageParam }) => postsApi.getExploreFeed(pageParam),
    getNextPageParam: (lastPage: { nextCursor?: string }) => lastPage?.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
