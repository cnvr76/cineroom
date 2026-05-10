// import { useState } from "react";
import ModalWindow from "../widgets/ModalWindow";
import { MODALS } from "../../config/sceneObjects";
import {
  useSceneActions,
  useSceneAnimations,
  useSceneState,
} from "../../contexts/SceneContext";
import useAsyncFetch from "../../hooks/useAsyncFetch";
import { api } from "../../services/api";
import ContentLoading from "../widgets/ContentLoading";
import SaveButton from "../widgets/SaveButton";
import { useSearchParams } from "react-router-dom";
import { CAMERA_CONFIG as cc } from "../../config/sceneObjects";

const TrailerModal = () => {
  const [searchParams] = useSearchParams();
  const { getMoveCameraToFn } = useSceneAnimations();
  const { currentMedia } = useSceneState();
  const { deselectObject } = useSceneActions();
  const { data, isLoading } = useAsyncFetch(() =>
    api.media.byId(currentMedia?._id!, currentMedia?.mediaType!),
  );

  const goBack = () => {
    const isFromFavorites = searchParams.get("favorites") === "true";
    deselectObject();
    getMoveCameraToFn()(
      isFromFavorites ? cc.favorite.target : cc.landing.default,
    );
  };

  return (
    <ModalWindow
      placement={{ ...MODALS.trailer, background: currentMedia?.dominantColor }}
    >
      <div className="w-full h-full flex flex-col p-2 pt-0">
        <div className="flex justify-between">
          <div className="min-w-fit flex items-center gap-2 pl-11">
            <SaveButton
              id={currentMedia?._id!}
              isSaved={currentMedia?.isSaved || false}
            />
            <span className="font-bold text-xl underline mx-2">
              {currentMedia?.title}
            </span>

            <div className="flex gap-2 items-center p-1">
              {currentMedia?.genres
                .filter((g) => g != null)
                .map((g) => (
                  <div
                    className="px-2.5 py-1 rounded-xl font-bold"
                    style={{
                      background: `color-mix(in srgb, ${currentMedia?.dominantColor} 90%, black)`,
                    }}
                  >
                    <span>{g}</span>
                  </div>
                ))}
            </div>

            <div className="h-full flex items-center gap-2 text-[1.1rem] font-bold">
              {currentMedia?.rating.toFixed(1) || "NR"}
              <i className="fa-solid fa-star fa-sm"></i>
            </div>
          </div>

          <div className="p-2 flex">
            <div className="w-full flex justify-end gap-1 pr-11">
              <button
                onClick={goBack}
                className="bg-black text-white font-bold rounded-full px-6 py-2 cursor-pointer hover:scale-110 transition-all ease-in-out"
              >
                <i className="fa-solid fa-arrow-left rotate-45"></i> Back
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-black w-full h-full flex items-center justify-center font-bold rounded-xl">
            <ContentLoading />
          </div>
        ) : data?.trailerKey ? (
          <iframe
            className="w-full flex-1 relative z-10 rounded-xl shadow-2xl bg-black"
            src={`https://www.youtube.com/embed/${data?.trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="bg-black w-full h-full flex items-center justify-center font-bold rounded-xl">
            Trailer not yet available :/
          </div>
        )}
      </div>
    </ModalWindow>
  );
};

export default TrailerModal;
