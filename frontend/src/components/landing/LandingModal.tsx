import ModalWindow from "../widgets/ModalWindow";
import { MODALS } from "../../config/sceneObjects";
import MediaCard from "./MediaCard";
import { useSceneActions } from "../../contexts/SceneContext";
import { api } from "../../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ContentLoading from "../widgets/ContentLoading";
import type { IMediaBrief } from "../../services/types/media.types";
import AccountIcon from "../widgets/AccountIcon";
import SearchBar, { type SearchState } from "../widgets/SearchBar";
import usePagination from "../../hooks/usePagination";
import { useAuthContext } from "../../contexts/AuthContext";
import Pagination from "../widgets/Pagination";

const FILTERS = ["All", "Movie", "TV"];

const LandingModal = () => {
  const { registerMedia, unregisterAllMedia } = useSceneActions();
  const { selectMedia, setHoveredMedia } = useSceneActions();
  const [, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<SearchState<IMediaBrief>>({
    results: undefined,
    isSearching: false,
    isActive: false,
    error: undefined,
  });
  const {
    data,
    currentPage,
    mediaType,
    isLoading,
    isLastPage,
    fetchError,
    handleFilter,
    handlePage,
  } = usePagination<IMediaBrief>(api.media.list);

  const openFavorites = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    setSearchParams((prev) => {
      prev.set("favorites", "true");
      prev.delete("page");
      return prev;
    });
  };

  const mediaToShow = searchState.isActive ? searchState.results : data;

  const isPending = isLoading || searchState.isSearching;
  const isEmpty =
    searchState.isActive && !isPending && searchState.results?.length === 0;

  useEffect(() => {
    if (!mediaToShow) return;
    unregisterAllMedia();
    mediaToShow.forEach((m) => registerMedia(m));
  }, [mediaToShow]);

  return (
    <ModalWindow placement={MODALS.landing}>
      <div className="flex flex-col gap-4">
        <div className="w-full sticky top-0 z-100 flex flex-col justify-center gap-1">
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
                onClick={() => handleFilter(f)}
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
                <MediaCard
                  data={m}
                  key={m._id}
                  onClick={() => selectMedia(m._id)}
                  onHover={{
                    enter: () => setHoveredMedia(m._id),
                    exit: () => setHoveredMedia(undefined),
                  }}
                />
              ))}

              {!searchState.isActive && (
                <Pagination
                  currentPage={currentPage}
                  isLastPage={isLastPage}
                  onChange={handlePage}
                />
              )}
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
