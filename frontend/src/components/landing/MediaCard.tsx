import type { IMediaBrief } from "../../services/types/media.types";
import { IMG_BASE } from "../../config/sceneObjects";
import SaveButton from "../widgets/SaveButton";

type Props = {
  data: IMediaBrief;
  onClick: any;
  onHover?: {
    enter: any;
    exit: any;
  };
};

const MediaCard = ({ data, onClick, onHover }: Props) => {
  return (
    <div className="relative cursor-pointer transition-transform hover:scale-105">
      <div className="absolute z-50 bottom-4.5 right-4.5">
        <SaveButton id={data._id} isSaved={data.isSaved} />
      </div>
      <article
        onMouseEnter={onHover?.enter}
        onMouseLeave={onHover?.exit}
        onClick={onClick}
        className="relative w-full aspect-2/3 rounded-2xl overflow-hidden shadow-lg font-sans text-white group"
      >
        <img
          src={`${IMG_BASE}${data.posterPath}`}
          alt={`Poster ${data.title}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-black/10"></div>
        <div className="absolute top-0 w-full p-3 flex justify-between items-start">
          <div className="flex w-full justify-end items-center gap-1 font-medium text-lg drop-shadow-md">
            {data.rating?.toFixed(1) || "NR"}{" "}
            <i className="fa-solid fa-star fa-sm"></i>
          </div>
        </div>
        <div className="absolute bottom-0 w-full p-4 flex flex-col gap-2">
          <h1 className="font-bold text-lg leading-tight truncate drop-shadow-md">
            {data.title}
          </h1>

          <div className="flex items-center h-full w-full justify-between">
            <div className="flex gap-2 text-[11px] font-medium text-gray-200">
              <span className="text-[0.8rem] bg-white/10 backdrop-blur-md px-2 py-1 rounded border border-white/5">
                {new Date(data.releaseDate).getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default MediaCard;
