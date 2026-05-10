import { useState, useEffect } from "react";
import useAsyncCall from "../../hooks/useAsyncCall";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const SaveButton = ({ id, isSaved }: { id: string; isSaved: boolean }) => {
  const { execute, isLoading } = useAsyncCall<{ saved: boolean }>();
  const [saved, setSaved] = useState(isSaved);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!authService.getToken()) {
      navigate("/auth?type=login");
      return;
    }

    const func = saved ? api.media.unmarkFavorite : api.media.markFavorite;
    const result = await execute(() => func(id));
    if (!result) return;
    setSaved((prev) => !prev);
  };

  useEffect(() => setSaved(isSaved), [isSaved]);

  return (
    <button
      className="hover:scale-110 transition-all ease-in-out cursor-pointer"
      onClick={handleSave}
      disabled={isLoading}
    >
      <i
        className={`fa-${saved ? "solid" : "regular"} fa-bookmark text-xl`}
      ></i>
    </button>
  );
};

export default SaveButton;
