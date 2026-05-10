import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const MobileNotSupported = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuthContext();

  return (
    <div
      style={{ backgroundImage: "url(/images/auth_bg.webp)" }}
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-6 py-10"
    >
      <div className="w-full max-w-md bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-white shadow-2xl flex flex-col items-center text-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-orange-400" />
          <h1 className="text-3xl font-bold tracking-widest">CINEROOM</h1>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Best on desktop</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            This 3D website is built for larger screens. You can still manage
            your account from here.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full mt-2">
          {!isAuthenticated && (
            <>
              <button
                onClick={() => navigate("/auth?type=signup")}
                className="w-full py-3 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition-colors cursor-pointer"
              >
                Create account
              </button>
              <button
                onClick={() => navigate("/auth?type=login")}
                className="w-full py-3 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition-colors cursor-pointer"
              >
                Log in
              </button>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="w-full py-3 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition-colors cursor-pointer"
            >
              Admin panel
            </button>
          )}

          {isAuthenticated && (
            <>
              <button
                onClick={() => navigate("/profile/me")}
                className="w-full py-3 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition-colors cursor-pointer"
              >
                My profile
              </button>
              <button
                onClick={logout}
                className="w-full py-3 bg-white text-black rounded-md font-semibold hover:bg-white/90 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNotSupported;
