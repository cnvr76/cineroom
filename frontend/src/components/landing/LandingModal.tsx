import ModalWindow from "../widgets/ModalWindow";
import { MODALS } from "../../config/sceneObjects";
import MediaCard from "./MediaCard";
import { useSceneActions } from "../../contexts/SceneContext";
import useAsyncFetch from "../../hooks/useAsyncFetch";
import { api } from "../../services/api";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import ContentLoading from "../widgets/ContentLoading";

const LandingModal = () => {
  const { registerMedia } = useSceneActions();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const mediaType = Number(searchParams.get("mediaType"));

  const { data, isLoading, error } = useAsyncFetch(
    () => api.media.list(currentPage, "all"),
    [currentPage],
  );

  const handlePage = (dir: 1 | -1) => {
    const next = Math.max(1, currentPage + dir);
    setSearchParams((prev) => {
      prev.set("page", next.toString());
      return prev;
    });
  };

  useEffect(() => {
    data?.forEach((m) => registerMedia(m));
  }, [data]);

  if (isLoading) return <ContentLoading />;

  return (
    <ModalWindow placement={MODALS.landing}>
      <div className="grid grid-cols-3 gap-4">
        {data?.map((m) => (
          <MediaCard data={m} key={m._id} />
        ))}
        <div className="flex flex-col justify-evenly items-center">
          <button
            className="bg-black w-14 h-14 flex items-center justify-center rounded-full text-white transition hover:scale-110 cursor-pointer"
            onClick={() => handlePage(1)}
          >
            {/* Next */}
            <i
              className="fa-solid fa-arrow-down fa-rotate-by"
              style={{ "--fa-rotate-angle": "-135deg" } as React.CSSProperties}
            ></i>
          </button>
          <button
            className="bg-black w-14 h-14 flex items-center justify-center rounded-full text-white transition hover:scale-110 cursor-pointer"
            onClick={() => handlePage(-1)}
            disabled={currentPage === 1}
          >
            <i
              className="fa-solid fa-arrow-down fa-rotate-by"
              style={{ "--fa-rotate-angle": "45deg" } as React.CSSProperties}
            ></i>
            {/* Prev */}
          </button>
        </div>
      </div>
    </ModalWindow>
  );
};

export default LandingModal;
