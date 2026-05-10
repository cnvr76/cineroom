import ModalWindow from "../widgets/ModalWindow";
import { MODALS } from "../../config/sceneObjects";
import MediaCard from "./MediaCard";
import { useSceneActions } from "../../contexts/SceneContext";
import useAsyncFetch from "../../hooks/useAsyncFetch";
import { api } from "../../services/api";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ContentLoading from "../widgets/ContentLoading";
import type { IMediaBrief, MediaType } from "../../services/types/media.types";
import AccountIcon from "../widgets/AccountIcon";
import SearchBar, { type SearchState } from "../widgets/SearchBar";

const BATCH_SIZE = 20;
const FILTERS = ["All", "Movie", "TV"];

const LandingModal = () => {
  const { registerMedia, unregisterAllMedia } = useSceneActions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchState, setSearchState] = useState<SearchState<IMediaBrief>>({
    results: undefined,
    isSearching: false,
    isActive: false,
    error: undefined,
  });

  const currentPage = Number(searchParams.get("page")) || 1;
  const mediaType = (searchParams.get("mediaType") || "all") as
    | MediaType
    | "all";

  const openFavorites = () => {
    setSearchParams((prev) => {
      prev.set("favorites", "true");
      prev.delete("page");
      return prev;
    });
  };

  const {
    data,
    isLoading,
    error: fetchError,
  } = useAsyncFetch(
    () => api.media.list(currentPage, mediaType),
    [currentPage, mediaType],
  );

  const mediaToShow = searchState.isActive ? searchState.results : data;

  const isPending = isLoading || searchState.isSearching;
  const isEmpty =
    searchState.isActive && !isPending && searchState.results?.length === 0;
  const isLastPage = data?.length !== BATCH_SIZE;

  const handlePage = (dir: 1 | -1) => {
    const next = Math.max(1, currentPage + dir);
    setSearchParams((prev) => {
      prev.set("page", next.toString());
      return prev;
    });
  };

  useEffect(() => {
    if (!mediaToShow) return;
    unregisterAllMedia();
    mediaToShow.forEach((m) => registerMedia(m));
  }, [mediaToShow]);

  return (
    <ModalWindow placement={MODALS.landing}>
      <div className="flex flex-col gap-4">
        <div className="w-full sticky top-0 z-50 flex flex-col justify-center gap-1">
          <div className="flex gap-1 w-full h-full">
            {/* Favorite Icon */}
            <button
              type="button"
              className="bg-black/60 py-1 px-2.5 rounded-full cursor-pointer hover:scale-110 transition-all ease-in-out border border-white/10 flex items-center"
              onClick={openFavorites}
              aria-label="Open favorites"
            >
              <i className="fa-solid fa-bookmark text-xl"></i>
            </button>

            {/* Search bar */}
            <SearchBar onChange={setSearchState} searchFn={api.media.search} />

            {/* Account Icon Functions */}
            <AccountIcon />
          </div>

          {/* Filter media by type */}
          <div className="flex gap-1 items-center w-full justify-evenly bg-black/80 border border-white/10 rounded-full">
            {FILTERS.map((f) => (
              <button
                disabled={isLoading || mediaType === f.toLocaleLowerCase()}
                key={f}
                onClick={() =>
                  setSearchParams((prev) => {
                    prev.set("mediaType", f.toLocaleLowerCase());
                    prev.set("page", "1");
                    return prev;
                  })
                }
                className={`rounded-full px-3 py-1 w-full text-center cursor-pointer transition-colors ${
                  mediaType === f.toLowerCase()
                    ? "bg-white text-black font-medium"
                    : "bg-transparent text-white hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {(fetchError || searchState.error) && (
          <div>Error: {fetchError?.message || searchState.error?.message}</div>
        )}

        {isPending && <ContentLoading />}

        {isEmpty && (
          <div className="flex w-full h-full items-center justify-center">
            Nothing found
          </div>
        )}

        {!isPending && !isEmpty && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {mediaToShow?.map((m) => (
                <MediaCard data={m} key={m._id} />
              ))}
              <div className="flex flex-col justify-evenly items-center">
                {!searchState.isActive && !isLastPage && (
                  <button
                    className="bg-black w-14 h-14 flex items-center justify-center rounded-full text-white transition hover:scale-110 cursor-pointer"
                    onClick={() => handlePage(1)}
                  >
                    {/* Next */}
                    <i
                      className="fa-solid fa-arrow-down fa-rotate-by"
                      style={
                        {
                          "--fa-rotate-angle": "-135deg",
                        } as React.CSSProperties
                      }
                    ></i>
                  </button>
                )}

                {!searchState.isActive && (
                  <span className="font-bold">Page {currentPage}</span>
                )}

                {!searchState.isActive && currentPage > 1 && (
                  <button
                    className="bg-black w-14 h-14 flex items-center justify-center rounded-full text-white transition hover:scale-110 cursor-pointer"
                    onClick={() => handlePage(-1)}
                  >
                    <i
                      className="fa-solid fa-arrow-down fa-rotate-by"
                      style={
                        { "--fa-rotate-angle": "45deg" } as React.CSSProperties
                      }
                    ></i>
                    {/* Prev */}
                  </button>
                )}
              </div>
            </div>
            <div className="w-full flex justify-center pt-8">
              {isLastPage && (
                <div className="text-xl font-bold">Try searching for more!</div>
              )}
            </div>
          </>
        )}
      </div>
    </ModalWindow>
  );
};

export default LandingModal;
