import React, { useState } from "react";
import { Button } from "../atoms/Buttons/Button";
import { ProposeUrlModal } from "./ProposeUrlModal";

import { ProposeTabaaniModal } from "./ProposeTabaaniModal";
import DaysSelectionTabs from "../Slider/DaysSelectionTabs"; // Added import for DaysSelectionTabs
import Modal from "react-modal";
import { ProposeGoogleMapsModal } from "./ProposeGoogleMapsModal";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/style.css";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent black overlay
    backdropFilter: "blur(5px)", // Blur effect for the overlay
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-40%, -40%)",
    border: "none", // Optional: Remove border if needed
    backgroundColor: "transparent",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");
const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose }) => {
  const userId = localStorage.getItem("userId");
  const [selectedAvatars, setSelectedAvatars] = useState<boolean[]>(
    Array(6).fill(false)
  );
  const [newAvatar, setNewAvatar] = useState<String>("");

  const handleAvatarClick = (avatarIndex: number) => {
    const avatarPath = `/images/user/avatar-${avatarIndex}.png`; // Generating the path based on the avatarIndex
    setNewAvatar(avatarPath); // Set newAvatar state with the selected avatar path
    const newSelectedAvatars = [...selectedAvatars];
    newSelectedAvatars[avatarIndex] = !newSelectedAvatars[avatarIndex];
    setSelectedAvatars(newSelectedAvatars);
    console.log("avatarlink", newAvatar);
  };

  const renderToastMessage = (message: string, type: "success" | "error") => {
    toast(message, { type });
  };

  // Update user's avatar in the database
  const handleSave = () => {
    axios
      .put(`http://localhost:3001/user/${userId}/AvatarChange`, { newAvatar })
      .then((response) => {
        // Optionally, you can handle success or show a message to the user.
        console.log("User avatar updated successfully");
        renderToastMessage("Avatar added successfully", "success");
        onClose();
        // Reload the page after the toast is closed
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Adjust the timeout as needed
      })
      .catch((error) => {
        console.error("Error updating user avatar:", error);
        // Handle error
      });
  };

  return (
    <>
      {isOpen && (
        <div className="flex items-start justify-center ">
          <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
            <div className="  bg-white dark:bg-sidedark rounded-md shadow-lg p-8 max-w-3xl w-full ">
              <div className="flex flex-cols-2 justify-between">
                <h2 className="text-white text-title-md flex justify-start ">
                  Change Avatar
                </h2>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    bg="transparent"
                    size="small"
                    onClick={onClose}
                  >
                    <span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        stroke="#000000"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#FFAF20"
                            strokeWidth="1.5"
                          ></circle>
                          <path
                            d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                            stroke="#FFAF20"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center overflow-x-auto">
  <div className="flex flex-no-wrap ">
    {[1, 2, 3, 4, 5, 6].map((avatarIndex) => (
      <div key={avatarIndex} className="relative">
        <img
          className={`h-22 w-22 rounded-full cursor-pointer transition duration-300 transform hover:scale-110 ${
            selectedAvatars[avatarIndex] ? "border-primary border-2" : ""
          }`}
          onClick={() => handleAvatarClick(avatarIndex)}
          src={`/images/user/avatar-${avatarIndex}.png`}
          alt={`Avatar ${avatarIndex}`}
        />
      </div>
    ))}
  </div>
</div>

              <div className="flex justify-end py-2">
                <Button onClick={handleSave}> Save</Button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export { AvatarModal };
