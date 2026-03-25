import React from "react";
import ModalWindow from "../ModalWindow";
import { MODALS } from "../../config/sceneObjects";
import { mediaSeed } from "../../documents/dummy";
import MediaCard from "./MediaCard";

const LandingModal = () => {
  return (
    <ModalWindow placement={MODALS.landing}>
      <div className="grid grid-cols-3 gap-4">
        {mediaSeed.map((m) => (
          <MediaCard data={m} key={m._id} />
        ))}
      </div>
    </ModalWindow>
  );
};

export default LandingModal;
