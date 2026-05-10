import type { IMediaBrief } from "../../services/types/media.types";

type Props = {
  media: IMediaBrief;
  onDelete: (id: string) => void;
};

const MediaRow = ({ media, onDelete }: Props) => (
  <div className="group flex items-center gap-6 py-5 border-b border-white/5 hover:bg-white/2 transition-colors">
    <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
      <i
        className={`fa-solid ${
          media.mediaType === "movie" ? "fa-clapperboard" : "fa-tv"
        } text-xs`}
      ></i>
    </div>

    <div className="flex-1 min-w-0">
      <span className="font-medium">{media.title}</span>
      <div className="text-white/40 text-sm">
        {media.mediaType.toUpperCase()}{" "}
        {new Date(media.releaseDate).getFullYear()}{" "}
        {media.rating > 0 && (
          <span>
            <i className="fa-solid fa-star fa-sm"></i> {media.rating.toFixed(1)}
          </span>
        )}
      </div>
    </div>

    <button
      type="button"
      onClick={() => onDelete(media._id)}
      className="text-xs text-red-400/70 hover:text-red-400 uppercase tracking-widest cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
    >
      Delete
    </button>
  </div>
);

export default MediaRow;
