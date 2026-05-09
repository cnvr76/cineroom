// import { useState } from "react";
import ModalWindow from "../widgets/ModalWindow";
import { MODALS } from "../../config/sceneObjects";
import { useSceneAnimations, useSceneState } from "../../contexts/SceneContext";
import useAsyncFetch from "../../hooks/useAsyncFetch";
import { api } from "../../services/api";
import ContentLoading from "../widgets/ContentLoading";
import SaveButton from "../widgets/SaveButton";

const TrailerModal = () => {
  const { getResetCameraFn } = useSceneAnimations();
  const { currentMedia } = useSceneState();
  const { data, isLoading } = useAsyncFetch(() =>
    api.media.byId(currentMedia?._id!, currentMedia?.mediaType!),
  );

  return (
    <ModalWindow
      placement={{ ...MODALS.trailer, background: currentMedia?.dominantColor }}
    >
      <div className="w-full h-full p-3 flex flex-col">
        <div className="flex justify-between">
          <div className="min-w-fit flex items-center gap-5 pl-11">
            <SaveButton
              id={currentMedia?._id!}
              isSaved={currentMedia?.isSaved || false}
            />
            <span className="font-bold text-xl">{currentMedia?.title}</span>
          </div>

          <div className="w-full flex justify-end gap-5 pr-11">
            <div className="flex gap-2 items-center">
              {currentMedia?.genres
                .filter((g) => g != null)
                .map((g) => (
                  <div
                    className="px-2.5 py-1 rounded-xl"
                    style={{
                      background: `color-mix(in srgb, ${currentMedia?.dominantColor} 40%, black)`,
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

            <button
              onClick={getResetCameraFn()}
              className="px-8 pt-3 pb-6 -mb-4 bg-black text-white font-bold rounded-t-2xl transition-transform duration-300 relative z-0 hover:-translate-y-1.5 cursor-pointer"
            >
              Back
            </button>
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
