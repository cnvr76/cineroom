import ModalWindow from "../widgets/ModalWindow";
import { MODALS } from "../../config/sceneObjects";
import MediaCard from "./MediaCard";
import { useSceneActions } from "../../contexts/SceneContext";
import useAsyncFetch from "../../hooks/useAsyncFetch";
import { api } from "../../services/api";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ContentLoading from "../widgets/ContentLoading";
import useAsyncCall from "../../hooks/useAsyncCall";
import type { IMediaBrief, MediaType } from "../../services/types/media.types";
import AccountIcon from "../widgets/AccountIcon";

const BATCH_SIZE = 20;
const FILTERS = ["All", "Movie", "TV"];

const LandingModal = () => {
  const { registerMedia, unregisterAllMedia } = useSceneActions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  const currentPage = Number(searchParams.get("page")) || 1;
  const mediaType = (searchParams.get("mediaType") || "all") as
    | MediaType
    | "all";

  const {
    data,
    isLoading,
    error: fetchError,
  } = useAsyncFetch(
    () => api.media.list(currentPage, mediaType),
    [currentPage, mediaType],
  );
  const {
    data: found,
    execute,
    isLoading: isSearching,
    error: searchError,
  } = useAsyncCall<IMediaBrief[]>();

  const isSearchActive = submittedQuery.length > 0;
  const mediaToShow = isSearchActive ? found : data;

  const isPending = isLoading || isSearching;
  const isEmpty = isSearchActive && !isPending && found?.length === 0;
  const showClearButton = inputValue.length > 0 || isSearchActive;
  const isLastPage = data?.length !== BATCH_SIZE;

  const handlePage = (dir: 1 | -1) => {
    const next = Math.max(1, currentPage + dir);
    setSearchParams((prev) => {
      prev.set("page", next.toString());
      return prev;
    });
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    setSubmittedQuery(q);
    execute(() => api.media.search(q));
  };
  const clearSearch = () => {
    setSubmittedQuery("");
    setInputValue("");
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
          {/* Search bar */}
          <div className="flex gap-1 w-full">
            <form className="flex gap-1 w-full" onSubmit={handleSearch}>
              <div className="relative w-full">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Try search for ..."
                  className="w-full py-1.5 pl-12 pr-10 bg-black/80 border border-white/10 rounded-full text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-300"
                />
                {showClearButton && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-black/60 py-1 px-2.5 rounded-full cursor-pointer hover:scale-110 transition-all ease-in-out border border-white/10"
              >
                <i className="fa-solid fa-magnifying-glass text-white/60"></i>
              </button>
            </form>
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

        {(fetchError || searchError) && (
          <div>Error: {fetchError?.message || searchError?.message}</div>
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
                {!isSearchActive && !isLastPage && (
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

                {!isSearchActive && (
                  <span className="font-bold">Page {currentPage}</span>
                )}

                {!isSearchActive && currentPage > 1 && (
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
