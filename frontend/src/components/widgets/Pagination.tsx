type Props = {
  currentPage: number;
  isLastPage: boolean;
  onChange: (dir: -1 | 1) => void;
};

const Pagination = ({ currentPage, isLastPage, onChange }: Props) => {
  return (
    <div className="flex flex-col justify-evenly items-center">
      {!isLastPage && (
        <button
          className="bg-black w-14 h-14 flex items-center justify-center rounded-full text-white transition hover:scale-110 cursor-pointer"
          onClick={() => onChange(1)}
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

      <span className="font-bold">Page {currentPage}</span>

      {currentPage > 1 && (
        <button
          className="bg-black w-14 h-14 flex items-center justify-center rounded-full text-white transition hover:scale-110 cursor-pointer"
          onClick={() => onChange(-1)}
        >
          <i
            className="fa-solid fa-arrow-down fa-rotate-by"
            style={{ "--fa-rotate-angle": "45deg" } as React.CSSProperties}
          ></i>
          {/* Prev */}
        </button>
      )}
    </div>
  );
};

export default Pagination;
