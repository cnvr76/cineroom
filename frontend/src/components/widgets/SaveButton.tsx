import { useState } from "react";
import useAsyncCall from "../../hooks/useAsyncCall";
import { api } from "../../services/api";

const SaveButton = ({ id, isSaved }: { id: string; isSaved: boolean }) => {
  const { execute } = useAsyncCall();
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    execute(() => api.media.toggleSave(id));
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
