import React, { useState, useEffect } from "react";

import { Button } from "../atoms/Buttons/Button";

import Modal from "react-modal";

import { ProposeGoogleMaps } from "./googlemaps";

interface ProposePlaceProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;


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
const ProposePlace: React.FC<ProposePlaceProps> = ({
  isOpen,
  onClose,
  tripId,
 
}) => {
  return (
    <>
      {isOpen && (
        <div className="flex items-start justify-center ">
          <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
            <div className="  bg-white dark:bg-sidedark rounded-md shadow-lg p-8 max-w-3xl w-full ">
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

              <ProposeGoogleMaps tripId={tripId}  />
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};
export { ProposePlace };
