import { useSearchParams } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";

type AuthType = "signup" | "login";

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const authType = (searchParams.get("type") || "login") as AuthType;
  const isSignup = authType === "signup";

  const switchType = () => {
    setSearchParams({ type: isSignup ? "login" : "signup" });
  };

  return (
    <div
      style={{ backgroundImage: "url(/images/auth_bg.webp)" }}
      className="w-screen h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    >
      <div className="w-full max-w-5xl mx-6 grid grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Left: form */}
        <div className="bg-black/20 p-12 flex flex-col gap-6 text-white">
          <div className="mt-12">
            <h1 className="text-4xl font-bold">
              {isSignup ? "Sign up" : "Login"}
            </h1>
            <p className="text-white/50 text-sm mt-2">
              {isSignup
                ? "Create your Cineroom account."
                : "Welcome back. Sign in to continue."}
            </p>
          </div>

          {isSignup ? <SignupForm /> : <LoginForm />}

          <div className="flex items-center gap-3 text-xs text-white/40">
            <div className="flex-1 h-px bg-white/10"></div>
            <span>or {isSignup ? "sign up" : "log in"} via</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <div className="text-center text-sm text-white/60">
            {isSignup ? "Already Have An Account?" : "No Account Yet?"}{" "}
            <button
              onClick={switchType}
              className="text-orange-400 font-semibold hover:underline cursor-pointer"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </div>
        </div>

        {/* Right: Window */}
        <div className="bg-white/2"></div>
      </div>
    </div>
  );
};

export default AuthPage;
