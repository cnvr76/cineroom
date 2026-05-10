import { useSearchParams } from "react-router-dom";
import type { MediaType } from "../services/types/media.types";
import useAsyncFetch from "./useAsyncFetch";

export const BATCH_SIZE = 20;

const usePagination = <T,>(
  fetcher: (page: number, mediaType: MediaType | "all") => Promise<T[]>,
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const mediaType = (searchParams.get("mediaType") || "all") as
    | MediaType
    | "all";

  const {
    data,
    isLoading,
    error: fetchError,
  } = useAsyncFetch<T[]>(
    () => fetcher(currentPage, mediaType),
    [currentPage, mediaType],
  );

  const handlePage = (dir: 1 | -1) => {
    const next = Math.max(1, currentPage + dir);
    setSearchParams((prev) => {
      prev.set("page", next.toString());
      return prev;
    });
  };

  const handleFilter = (filter: string) => {
    setSearchParams((prev) => {
      prev.set("mediaType", filter.toLocaleLowerCase());
      prev.set("page", "1");
      return prev;
    });
  };

  return {
    currentPage,
    mediaType,

    data,
    isLoading,
    isLastPage: data?.length !== BATCH_SIZE,
    fetchError,

    handlePage,
    handleFilter,
  };
};

export default usePagination;
