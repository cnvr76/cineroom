import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const AccountIcon = () => {
  const { isAdmin, isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="flex items-center relative">
      <button
        className="relative bg-black/60 py-1.5 px-2.5 rounded-full cursor-pointer hover:scale-110 transition-all ease-in-out border border-white/10"
        onClick={
          isAuthenticated ? () => navigate("/profile") : () => navigate("/auth")
        }
      >
        {isAuthenticated ? (
          <span className="relative flex items-center">
            {isAdmin && (
              <span className="absolute -top-5 right-1 -rotate-12">
                <i className="fa-solid fa-crown text-amber-200 text-[1rem]"></i>
              </span>
            )}
            <i className="fa-solid fa-user text-xl"></i>
          </span>
        ) : (
          <span className="font-bold flex items-center gap-1">
            <i className="fa-solid fa-right-to-bracket"></i> Login
          </span>
        )}
      </button>

      {isAuthenticated && (
        <button
          onClick={logout}
          className="relative bg-black/60 py-1.5 px-2.5 rounded-full cursor-pointer hover:scale-110 transition-all ease-in-out border border-white/10"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      )}
    </div>
  );
};

export default AccountIcon;
