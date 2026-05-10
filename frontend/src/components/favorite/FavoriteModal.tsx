import { useSearchParams } from "react-router-dom";
import ModalWindow from "../widgets/ModalWindow";
import { INTERACTABLE_OBJECTS, MODALS } from "../../config/sceneObjects";
import { useEffect, useState } from "react";
import type { IMediaBrief } from "../../services/types/media.types";
import type { SearchState } from "../widgets/SearchBar";
import usePagination from "../../hooks/usePagination";
import { api } from "../../services/api";
import SearchBar from "../widgets/SearchBar";
import AccountIcon from "../widgets/AccountIcon";
import MediaCard from "../landing/MediaCard";
import {
  useSceneActions,
  useSceneAnimations,
} from "../../contexts/SceneContext";
import ContentLoading from "../widgets/ContentLoading";
import Pagination from "../widgets/Pagination";

const FavoriteModal = () => {
  const [, setSearchParams] = useSearchParams();
  const {
    registerMedia,
    unregisterAllMedia,
    selectMedia,
    selectObject,
    setHovered,
  } = useSceneActions();
  const { getMoveCameraToFn } = useSceneAnimations();
  const { data, currentPage, isLoading, isLastPage, fetchError, handlePage } =
    usePagination<IMediaBrief>(api.media.favorites.list);
  const [searchState, setSearchState] = useState<SearchState<IMediaBrief>>({
    results: undefined,
    isSearching: false,
    isActive: false,
    error: undefined,
  });

  const mediaToShow = searchState.isActive ? searchState.results : data;
  const isPending = isLoading || searchState.isSearching;
  const isEmpty =
    !isPending &&
    ((searchState.isActive && searchState.results?.length === 0) ||
      (!searchState.isActive && data?.length === 0));

  const goBack = () => {
    setSearchParams((prev) => {
      prev.delete("favorites");
      prev.delete("page");
      return prev;
    });
  };

  const handleClick = (mediaId: string) => {
    setHovered("tv");
    selectObject("tv");
    selectMedia(mediaId);
    getMoveCameraToFn()(INTERACTABLE_OBJECTS.tv.camera.target);
  };

  useEffect(() => {
    if (!mediaToShow) return;
    unregisterAllMedia();
    mediaToShow.forEach((m) => registerMedia(m));
  }, [mediaToShow]);

  return (
    <ModalWindow placement={MODALS.favorite}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col justify-center gap-2">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Favorites</h1>
            <button
              type="button"
              onClick={goBack}
              className="bg-black/60 px-4 py-2 rounded-full hover:scale-105 transition-transform cursor-pointer border border-white/10"
            >
              <i className="fa-solid fa-arrow-left rotate-45"></i> Back
            </button>
          </div>
          <div className="flex gap-1">
            <SearchBar
              onChange={setSearchState}
              searchFn={api.media.favorites.search}
              placeholder="Dig through favorites..."
            />
            <AccountIcon />
          </div>
        </div>

        {(fetchError || searchState.error) && (
          <div className="text-red-400 text-sm">
            Error: {fetchError?.message || searchState.error?.message}
          </div>
        )}

        {isPending && <ContentLoading />}

        {isEmpty && (
          <div className="flex-1 flex items-center justify-center text-white/40">
            {searchState.isActive
              ? "Nothing found"
              : "Your favorites will appear here."}
          </div>
        )}

        {!isPending && !isEmpty && (
          <div className="grid grid-cols-3 gap-4">
            {mediaToShow?.map((m) => (
              <MediaCard
                data={m}
                key={m._id}
                onClick={() => handleClick(m._id)}
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
        )}
      </div>
    </ModalWindow>
  );
};

export default FavoriteModal;
