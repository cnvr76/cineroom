import { useState } from "react";
import useAsyncCall from "../../hooks/useAsyncCall";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const SaveButton = ({ id, isSaved }: { id: string; isSaved: boolean }) => {
  const { execute } = useAsyncCall<{ saved: boolean }>();
  const [saved, setSaved] = useState(isSaved);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!authService.getToken()) navigate("/auth?type=login");

    const func = isSaved ? api.media.unmarkFavorite : api.media.markFavorite;
    const result = await execute(() => func(id));
    if (!result) return;
    console.log(result);
    setSaved((prev) => !prev);
  };

  return (
    <span
      className="hover:scale-110 transition-all ease-in-out"
      onClick={handleSave}
    >
      <i
        className={`fa-${saved ? "solid" : "regular"} fa-bookmark text-xl`}
      ></i>
    </span>
  );
};

export default SaveButton;
