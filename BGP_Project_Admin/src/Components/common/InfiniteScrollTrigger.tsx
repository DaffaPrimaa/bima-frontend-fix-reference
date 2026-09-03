import { useEffect, useRef } from "react";
import { Spinner } from "@heroui/react";

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export const InfiniteScrollTrigger = ({
  onLoadMore,
  hasMore,
  isLoading,
}: InfiniteScrollTriggerProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <div
      ref={observerRef}
      className="flex justify-center items-center w-full py-2"
    >
      {isLoading && <Spinner size="sm" />}
    </div>
  );
};
