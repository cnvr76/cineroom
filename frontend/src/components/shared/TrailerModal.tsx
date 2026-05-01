// import { useState } from "react";
import ModalWindow from "../ModalWindow";
import { MODALS } from "../../config/sceneObjects";
import { useSceneAnimations, useSceneState } from "../../contexts/SceneContext";

const TrailerModal = () => {
  //   const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getResetCameraFn } = useSceneAnimations();
  const { currentMedia } = useSceneState(); // change to fetched media

  return (
    <ModalWindow
      placement={{ ...MODALS.trailer, background: currentMedia?.dominantColor }}
    >
      <div className="w-full h-full p-3 flex flex-col">
        <div className="w-full flex justify-end gap-5 pr-11">
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

        <iframe
          className="w-full flex-1 relative z-10 rounded-xl shadow-2xl bg-black"
          src={`https://www.youtube.com/embed/${currentMedia?.trailerKey}?autoplay=1&rel=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </ModalWindow>
  );
};

export default TrailerModal;
