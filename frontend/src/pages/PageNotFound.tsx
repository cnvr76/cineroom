import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-white/60">Page not found</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition-colors cursor-pointer mt-4"
      >
        Back home
      </button>
    </div>
  );
};

export default PageNotFound;
