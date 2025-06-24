import React, { useEffect, useState } from "react";
import { Button } from "../atoms/Buttons/Button";
import Comment from "../atoms/interactions/Comment";
import Modal from "react-modal";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/style.css";

import {
  createComment,
  fetchComments,
  fetchPlannerByTripId,
  fetchUsers,
  getUserData,
} from "../../hooks/api";
import TimePicker from "../Dates/TimePicker";

interface DesModalProps {
  activityId: String;
  Image: string;
  Title: string; // Updated to camelCase for consistency
  from: string; // Updated to camelCase for consistency
  to: string; // Updated to camelCase for consistency
  duration: string; // Updated to camelCase for consistency  username: string; // Updated to camelCase for consistency
  Description: string;
  userIdList: String[]; // Updated to camelCase for consistency
  tripId: String;
  suggestedBy: String;
  isOpen: boolean;
  onClose: () => void;
  onDelete;
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
const DesModal: React.FC<DesModalProps> = ({
  activityId,
  Image,
  Title,
  from,
  to,
  userIdList,
  Description,
  tripId,
  suggestedBy,
  isOpen,
  onClose,
  onDelete,
}) => {
  const [hoveredAvatar, setHoveredAvatar] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string>("");
  const [data, setData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setCurrentTime(new Date());
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const Data = {
      msg,
      user: userIdP,
      time: currentTime.toLocaleTimeString(),
      activity: activityId,
    };
    createComment(Data)
      .then(({ result }) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUsers((fetchedData) => {
      setData(fetchedData);
    });
  }, []);

  useEffect(() => {
    if (tripId) {
      fetchPlannerByTripId(tripId)
        .then((plannerData) => {
          setPlannerName(plannerData.plannerName);
        })
        .catch((error) => {
          console.error("Error fetching planner data:", error);
          // Handle error if needed
        });
    }
  }, [tripId]);

  const isJoined = (user) => {
    return userIdList.includes(user._id);
  };

  const handleJoin = () => {
  const userId = localStorage.getItem("userId");
    console.log(activityId);
    axios
      .post(`http://localhost:3001/activities/${activityId}/join`, { userId })
      .then((response) => {
        renderToastMessage("I've joined the activity", "success");
        // Reload the page after the toast is closed
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.error("Error joining activity:", error);
          renderToastMessage("Error joining the activity", "error");
      });
  };
  const userIdP = localStorage.getItem("userId");
  const [plannerName, setPlannerName] = useState<string>("");
  useEffect(() => {
    if (tripId) {
      fetchPlannerByTripId(tripId)
        .then((plannerData) => {
       
       
       
          setPlannerName(plannerData.plannerName);
        })
        .catch((error) => {
          console.error("Error fetching planner data:", error);
          // Handle error if needed
        });
    }
  }, [tripId]);

  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [showEditButtons, setShowEditButtons] = useState(false);

  const toggleDeleteButtons = () => {
    if (plannerName === userIdP) {
      setShowDeleteButtons(!showDeleteButtons);
      setShowEditButtons(!showEditButtons);
      console.log("planner", plannerName);
      if (onDelete) {
        onDelete(); // Call the onDelete function passed from PlanCards
        onClose(); // Close the modal after deletion
      }
    }
  };

  const renderToastMessage = (message: string, type: "success" | "error") => {
    toast(message, { type });
  };

  const [comments, setComments] = useState<any[]>([]);
  useEffect(() => {
    fetchComments(setComments);
  }, []);

  const IsMatched = (comment) => {
    return activityId === comment.activity;
  };
  const [userData, setUserData] = useState({ fullname: "", avatar: "" });

  useEffect(() => {
   

    getUserData(suggestedBy)
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error fetching full name:", error);
      });
  }, []);

  const [edit, setEdit] = useState(false);
  const [newfrom, setFrom] = useState<string>("");
  const [newto, setTo] = useState<string>("");

  const toggleEditButtons = () => {
    if (plannerName === userIdP) {
      setShowEditButtons(!showEditButtons);
      setEdit(true); // Set edit state for "from" to true
      // Set edit state for "to" to true
    }
  };

  const handleSubmitEdit = () => {
    const updateData = {
      from: newfrom,
      to: newto,
    };
    axios
      .post(`http://localhost:3001/activities/${activityId}/update`, updateData)
      .then(() => {
        // Removed destructuring of result
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {isOpen && (
        <div className="flex items-start justify-center">
          <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
            <div className="dark:bg-boxdark bg-white rounded-md shadow-lg grid grid-cols-2 ">
              <div className="overflow-hidden rounded-lg dark:bg-strokedark bg-white shadow-lg duration-300 relative">
                <img
                  className="w-[450px] h-[500px] relative"
                  src={Image}
                  alt="Modal"
                />
                <div className="absolute top-0 left-0 m-4 flex gap-2">
                  <Button
                    size="small"
                    onClick={() => setEdit(true)}
                    style={{
                      display: plannerName === userIdP ? "flex" : "none",
                    }}
                  >
                    <span>
                      <svg
                        className="w-6 h-6 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                          clip-rule="evenodd"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </Button>
                  <Button
                    size="small"
                    id="delete"
                    onClick={toggleDeleteButtons}
                    style={{
                      display: plannerName === userIdP ? "flex" : "none",
                    }}
                  >
                    <span>
                      <svg
                        className="w-6 h-6 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="absolute w-[450px] h-[500px] p-4">
                  {/* Avatars section */}
                  <div className="flex flex-row-reverse p-6">
                    {data.filter(isJoined).map((user) => (
                      <div
                        key={user._id}
                        className="relative -mr-5"
                        onMouseEnter={() => setHoveredAvatar(true)}
                        onMouseLeave={() => setHoveredAvatar(null)}
                      >
                        <img
                          className={`h-10 w-10 rounded-full cursor-pointer transition duration-300 shadow-5 transform hover:scale-110 ${
                            hoveredAvatar ? "z-8" : "z-0"
                          }`}
                          src={user.avatar} // Use user.avatar instead of `${user.avatr}`
                          alt={`Avatar ${user._id}`}
                        />
                        {hoveredAvatar && (
                          <span className="absolute bottom-0 right-0 block h-2 w-2 bg-green-400 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                    ))}
                    <Button
                      className={`h-10 w-8 rounded-full -mr-4 transition duration-300 transform hover:scale-110 ${
                        hoveredAvatar ? "z-8" : "z-0"
                      }`}
                      onClick={handleJoin}
                    >
                      Join
                    </Button>
                  </div>
                  <div className="absolute top-0 right-0 ">
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
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="#FFAF20"
                              stroke-width="1.5"
                            ></circle>
                            <path
                              d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                              stroke="#FFAF20"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </Button>
                  </div>
                  <div className="font-bold text-title-md dark:text-white text-strokedark hover:text-primary ">
                    {Title}
                  </div>
                  <div className="dark:text-white text-strokedark font-bold text-sm leading-loose ">
                    {!edit ? (
                      <>
                        From: {from} To: {to}{" "}
                      </>
                    ) : (
                      <div className="flex justify-center items-center gap-1 mt-2">
                        <div className="flex flex-col items-start">
                          <label className="mr-2">From:</label>
                          <TimePicker value={newfrom} onChange={setFrom} />
                        </div>
                        <div className="flex flex-col items-start">
                          <label className="mr-2">To:</label>
                          <TimePicker value={newto} onChange={setTo} />
                        </div>
                        <Button
                          size="small"
                          className="mt-6"
                          onClick={() => {
                            setEdit(false);
                            handleSubmitEdit(); // Call handleSubmitEdit to update the data
                          }}
                          style={{
                            display: plannerName === userIdP ? "flex" : "none",
                          }}
                        >
                          <span>
                            <svg
                              className="w-6 h-6 dark:text-white text-strokedark"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="4"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>


                  <div className="text-white title-sm  leading-loose  ">



                   { `  Suggested By ${userData.fullname.charAt(0).toUpperCase()}${userData.fullname.slice(1)}` } 


                  </div>
                  <div className="dark:text-white text-strokedark text-sm leading-loose line-clamp-2">
                    {Description}
                  </div>
                  {/* Comment section with scroll */}
                  <div className="relative">
                    <div className="dark:text-white text-strokedark font-bold text-sm leading-loose">
                      Comments
                    </div>
                    <textarea
                      id="message"
                      className="w-full rounded-lg border-[1.5px] border-strokedark bg-transparent py-1 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
                      placeholder="Your message..."
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                    ></textarea>
                    <Button
                      className="absolute right-4 bottom-5 h-10  rounded-full  "
                      size="small"
                      onClick={handleSubmit}
                    >
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="w-6 h-6 "
                        >
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </span>
                    </Button>
                  </div>

                  <div className="overflow-y-auto "style={{ maxHeight: "7rem", flex: "1" }}>
                    {comments.filter(IsMatched).map((comment, index) => (
                      <Comment
                        key={index}
                        user={comment.user}
                        time={comment.time}
                        msg={comment.msg}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export { DesModal };
