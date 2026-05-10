import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import useAsyncCall from "../hooks/useAsyncCall";
import {
  meSchema,
  type ChangeMeFormData,
  type IUserFull,
} from "../services/types/user.types";
import useAsyncFetch from "../hooks/useAsyncFetch";
import { api } from "../services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ContentLoading from "../components/widgets/ContentLoading";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuthContext();

  const {
    data,
    isLoading,
    error: fetchingError,
    refetch,
  } = useAsyncFetch<IUserFull>(api.user.me);

  const {
    execute,
    isLoading: isChanging,
    error: changeError,
  } = useAsyncCall<IUserFull>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ChangeMeFormData>({
    resolver: zodResolver(meSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (data?.username) reset({ username: data.username });
  }, [data?.username, reset]);

  const onSubmit = async (form: ChangeMeFormData) => {
    const result = await execute(() => api.user.updateMe(form));
    if (!result) return;
    refetch();
  };

  if (isLoading || !data) {
    return (
      <div
        style={{ backgroundImage: "url(/images/auth_bg.webp)" }}
        className="w-screen h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      >
        <ContentLoading />
      </div>
    );
  }

  return (
    <div
      style={{ backgroundImage: "url(/images/auth_bg.webp)" }}
      className="w-screen h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-6 grid grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Left: editable form */}
        <div className="bg-black/20 backdrop-blur-md p-12 flex flex-col gap-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <button
                className="font-bold text-md cursor-pointer"
                onClick={() => navigate("/")}
              >
                CINEROOM
              </button>
              {isAdmin && (
                <button
                  className="font-bold text-md cursor-pointer"
                  onClick={() => navigate("/admin")}
                >
                  Admin Dashboard
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-white/60 hover:text-white cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left mr-2 rotate-45"></i>
              Back
            </button>
          </div>

          <div className="mt-8">
            <h1 className="text-4xl font-bold">Profile</h1>
            <p className="text-white/50 text-sm mt-2">
              Manage your account information.
            </p>
          </div>

          {(fetchingError || changeError) && (
            <div className="text-red-400 text-sm">
              {fetchingError?.message || changeError?.message}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-2"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="username"
                className="text-xs text-white/50 uppercase tracking-wide"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register("username")}
                disabled={isChanging}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
              />
              {errors.username && (
                <span className="text-red-400 text-sm">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50 uppercase tracking-wide">
                Email
              </label>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white/70">
                {data.email}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/50 uppercase tracking-wide">
                Role
              </label>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-md text-white/70 capitalize">
                {data.role}
              </div>
            </div>

            <button
              type="submit"
              disabled={isChanging || !isDirty}
              className="w-full py-3 bg-white text-black rounded-md font-semibold mt-4 hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChanging && <i className="fa-solid fa-spinner fa-spin"></i>}{" "}
              {isChanging ? "Saving..." : "Save changes"}
            </button>
          </form>

          <div className="flex items-center text-xs text-white/40">
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={logout}
              className="text-red-400 font-semibold hover:underline cursor-pointer"
            >
              <i className="fa-solid fa-right-from-bracket mr-2"></i>
              Sign out
            </button>
          </div>
        </div>

        {/* Right: avatar + stats */}
        <div className="bg-white/5 p-12 flex flex-col items-center justify-center gap-6 backdrop-blur-sm">
          <div className="relative w-32 h-32">
            {data.avatarUrl ? (
              <img
                src={`${BASE_URL}${data.avatarUrl}`}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-5xl text-white/50">
                <i className="fa-solid fa-user"></i>
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-black/80 hover:bg-black w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border border-white/20">
              <i className="fa-solid fa-camera text-white text-xs"></i>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await execute(() => api.user.uploadAvatar(file));
                  refetch();
                }}
              />
            </label>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{data.username}</h2>
            <p className="text-white/50 text-sm mt-1">
              Member since{" "}
              {data.joinedAt
                ? new Date(data.joinedAt).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-4">
            <div className="bg-white/5 border border-white/10 rounded-md p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {data.favoriteCount}
              </div>
              <div className="text-xs text-white/50 uppercase mt-1">
                Favorites
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-md p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {data.moviesCount}
              </div>
              <div className="text-xs text-white/50 uppercase mt-1">Movies</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-md p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {data.tvCount}
              </div>
              <div className="text-xs text-white/50 uppercase mt-1">TVs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
