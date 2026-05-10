import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import Dashboard from "../components/admin/Dashboard";
import TabButton from "../components/admin/TabButton";
import UsersTab from "../components/admin/UsersTab";
import MediaTab from "../components/admin/MediaTab";

type AdminTabs = "users" | "media";

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuthContext();
  const [tab, setTab] = useState<AdminTabs>("users");

  useEffect(() => {
    if (!isAuthenticated) navigate("/", { replace: true });
    else if (!isAdmin) navigate("/profile/me", { replace: true });
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div
      style={{ backgroundImage: "url(/images/auth_bg.webp)" }}
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed text-white"
    >
      <header className="sticky top-0 z-30 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
          <button
            onClick={() => navigate("/")}
            className="font-bold tracking-widest text-sm cursor-pointer hover:text-orange-400 transition-colors"
          >
            CINEROOM
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile/me")}
            className="text-xs text-white/50 hover:text-white cursor-pointer uppercase tracking-widest"
          >
            <i className="fa-solid fa-arrow-left rotate-45"></i> Profile
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-1 h-16 bg-orange-400" />
          <div>
            <h1 className="text-6xl font-bold tracking-tight">ADMIN</h1>
            <p className="text-white/40 text-sm uppercase tracking-widest mt-1">
              Manage users and content
            </p>
          </div>
        </div>

        <Dashboard />

        <div className="flex gap-8 border-b border-white/10 mb-8">
          <TabButton active={tab === "users"} onClick={() => setTab("users")}>
            Users
          </TabButton>
          <TabButton active={tab === "media"} onClick={() => setTab("media")}>
            Media
          </TabButton>
        </div>

        {tab === "users" ? <UsersTab /> : <MediaTab />}
      </main>
    </div>
  );
};

export default AdminPage;
