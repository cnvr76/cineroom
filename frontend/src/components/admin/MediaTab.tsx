import { useState } from "react";
import useAsyncFetch from "../../hooks/useAsyncFetch";
import useAsyncCall from "../../hooks/useAsyncCall";
import { api } from "../../services/api";
import type { IMediaBrief } from "../../services/types/media.types";
import SearchBar, { type SearchState } from "../widgets/SearchBar";
import MediaRow from "./MediaRow";

const MediaTab = () => {
  const { data, isLoading, refetch } = useAsyncFetch<IMediaBrief[]>(() =>
    api.media.list(1, "all"),
  );
  const { execute: deleteMedia, isLoading: isDeleting } = useAsyncCall<{
    deleted: boolean;
  }>();

  const [searchState, setSearchState] = useState<SearchState<IMediaBrief>>({
    results: undefined,
    isSearching: false,
    isActive: false,
    error: undefined,
  });

  const mediaToShow = searchState.isActive ? searchState.results : data;
  const isPending = isLoading || searchState.isSearching;

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this media permanently?")) return;
    await deleteMedia(() => api.admin.media.delete(id));
    refetch();
  };

  return (
    <section className="flex flex-col gap-4">
      <SearchBar
        searchFn={api.admin.media.search}
        onChange={setSearchState}
        placeholder="Search by title..."
      />

      {searchState.error && (
        <div className="text-red-400 text-sm">{searchState.error.message}</div>
      )}

      {isPending && (
        <div className="text-white/40 text-sm py-4">Loading...</div>
      )}

      {!isPending && (
        <div className="flex flex-col">
          {mediaToShow?.map((m) => (
            <MediaRow key={m._id} media={m} onDelete={handleDelete} />
          ))}
          {mediaToShow?.length === 0 && (
            <div className="text-white/40 text-sm py-8 text-center">
              {searchState.isActive ? "Nothing found" : "Library is empty"}
            </div>
          )}
        </div>
      )}

      {isDeleting && <div className="text-white/40 text-xs">Deleting...</div>}
    </section>
  );
};

export default MediaTab;
