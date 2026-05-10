import { useSearchParams } from "react-router-dom";
import ModalWindow from "../widgets/ModalWindow";
import { MODALS } from "../../config/sceneObjects";

const FavoriteModal = () => {
  const [, setSearchParams] = useSearchParams();

  const goBack = () => {
    setSearchParams((prev) => {
      prev.delete("favorites");
      prev.delete("page");
      return prev;
    });
  };

  return (
    <ModalWindow placement={MODALS.favorite}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Favorites</h1>
          <button
            type="button"
            onClick={goBack}
            className="bg-black/60 px-4 py-2 rounded-full hover:scale-105 transition-transform cursor-pointer border border-white/10"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back
          </button>
        </div>

        {/* Содержимое допишешь сам — список избранных, грид MediaCard и т.д. */}
        <div className="flex-1 flex items-center justify-center text-white/40">
          Your favorites will appear here.
        </div>
      </div>
    </ModalWindow>
  );
};

export default FavoriteModal;
