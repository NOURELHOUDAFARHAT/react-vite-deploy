import React, { Fragment, useEffect, useState } from "react";
import { Button } from "../atoms/Buttons/Button";
import Modal from "react-modal";
import { DropDownUsers } from "../atoms/input/DropDownUsers";
import Members from "../atoms/interactions/Members";
import axios from "axios";
import DaysSelectionTabs from "../Slider/DaysSelectionTabs";
import { Input } from "../atoms/input/input";
import MembersEmail from "../atoms/interactions/MembersEmail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/style.css";

interface IUser {
  _id: string;
  fullName: string;
}

interface NewUserModalProps {
  isUserOpen: boolean;
  onUserClose: () => void;
  onSubmit: (selectedUsers: IUser[]) => void;
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

Modal.setAppElement("#root");
const NewUserModal: React.FC<NewUserModalProps> = ({
  isUserOpen,
  onUserClose,
  onSubmit,
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);

  const renderToastMessage = (message: string, type: "success" | "error") => {
    toast(message, { type });
  };

  const handleUserSelect = (user) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleAddMember = () => {
    onSubmit(selectedUsers); // Pass selected users to the parent component
    renderToastMessage("Guest added successfully", "success");
    onUserClose(); // Close the modal
  };

  const handleAddMemberViaEmail = () => {
    setEmailList([...emailList, emailInput]); // Add email to the list
    setEmailInput(""); // Clear the input after adding email
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior (submitting form)
      handleAddMemberViaEmail(); // Add the email when Enter key is pressed
    }
  };

  const handleSendEmails = () => {
    // Assuming you have an API endpoint for sending email invitations
    axios
      .post("http://localhost:3001/sendinvitation", {
        emails: emailList,
      })
      .then((response) => {

        setEmailList([]); 
        renderToastMessage("Guest Invited successfully", "success");
        onUserClose();
      })
      .catch((error) => {
        console.error("Error sending invitation:", error);
      });
  };

  const handleRemoveEmail = (index: number) => {
    const updatedList = [...emailList];
    updatedList.splice(index, 1); // Remove the email at the specified index
    setEmailList(updatedList);
  };
  emailList;
  const handleRemoveUser = (index: number) => {
    const updatedList = [...selectedUsers];
    updatedList.splice(index, 1); // Remove the email at the specified index
    setSelectedUsers(updatedList);
  };

  const handleDayChange = (number: number) => {
    setActiveDay(number);
  };

  return (
    <Modal
      isOpen={isUserOpen}
      onRequestClose={onUserClose}
      style={customStyles}
    >
      <div className="bg-white dark:bg-sidedark rounded-md shadow-lg p-8 max-w-3xl w-full">
        <div className="flex justify-end">
          <Button
            type="button"
            bg="transparent"
            size="small"
            onClick={onUserClose}
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
        <div className="mb-3">
          <DaysSelectionTabs
            number={[1, 2]}
            buttonNames={["Via UserName", "Via Email"]}
            activeDay={activeDay}
            handleDayChange={handleDayChange}
          />
        </div>

        {activeDay === 1 && (
          <div className="flex flex-col items-center justify-center">
            <DropDownUsers onSelect={handleUserSelect} />
            <div className="overflow-y-auto  max-h-60  ">
              {selectedUsers.map((user, index) => (
                <Members
                  key={index}
                  avatar={user.avatar}
                  fullname={user.fullName}
                  email={user.email}
                  onRemove={() => handleRemoveUser(index)}
                />
              ))}
            </div>
            <div className="flex items-center justify-center m-3">
              <Button className="w-80 h-10" onClick={handleAddMember}>
                Add Member
              </Button>
            </div>
          </div>
        )}

        {activeDay === 2 && (
          <div className="flex flex-col items-center justify-center">
            <Input
              placeholder="Enter Guest Email"
              className="w-80 h-10 mb-3"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleEnterKeyPress} // Handle Enter key press
            />
            <div className="flex flex-col gap-2">
              {emailList.map((email, index) => (
                <MembersEmail
                  key={index}
                  email={email}
                  onRemove={() => handleRemoveEmail(index)} // Pass a function to handle removal
                />
              ))}
            </div>
            <div className="flex items-center justify-center m-3">
              <Button className="w-80 h-10" onClick={handleSendEmails}>
                Invite New Member
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export { NewUserModal };
