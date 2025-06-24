import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Input, TimeInput } from "../atoms/input/input";
import { Button } from "../atoms/Buttons/Button";
import DayInput from "../Dates/DayInput";
import Modal from "react-modal";
import { fetchMembersByTripId, fetchStayswithPlace, fetchTripDays, fetchUsersByTripId } from "../../hooks/api";
import DropDownPlaces from "../atoms/input/DropDownPlaces";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/style.css';

// Import Math.random for generating random numbers
const { random } = Math;

interface Place {
  _id: string;
  title: string;
  numDay: number;
}
interface Activity {
  numDay: number;
}



interface ProposeStayesProps {
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
const ProposeStays: React.FC<ProposeStayesProps> = ({
  isOpen,
  onClose,
  tripId,
}) => {
  

  const [url, setUrl] = useState<string>("");
  const [linkPreview, setLinkPreview] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  const [numDay, setNumDay] = useState<number>(0);
  const [num, setNum] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [existingActivities, setExistingActivities] = useState<Activity[]>([]);
  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");
  const [selectedPlacDays, setSelectedPlaceDays] = useState<Number>(0);


// Get user ID from local storage
const userId = localStorage.getItem('userId');


  const handlePlaceSelect = (place: Place) => {
    setSelectedPlaceId(place._id); // Update the selectedPlaceId state with the selected place ID
    console.log("placeid",selectedPlaceId)
    console.log("placeDays", place.numDay);
    setNum(place.numDay);
  };
  useEffect(() => {
    setNumDay(0); // Reset 'numDay' whenever 'num' changes
    fetchNumStays(); // Fetch numStays whenever selectedPlaceId or num changes
  }, [selectedPlaceId, num]);

  const fetchNumStays = async () => {
    try {
      const staysData = await fetchStayswithPlace(selectedPlaceId); // Assuming data is an array of stays
      console.log("staysData", staysData);
      // Calculate total numDay from all stays
    const totalNumDays = staysData.reduce((acc, stay) => {
      if (stay.type == "stays") { // Check if the activity type is stay
        return acc + stay.numDay; // Add numDay only if it's a stay
      } else {
        console.log("Unexpected type:", stay.type);
      }
      return acc;
    }, 0);
    console.log("totalNumDays", num);
      const maxDays = num - totalNumDays; // Calculate maximum days based on stays
      setRemainingDays(maxDays);
      console.log("totalNumDays", maxDays);
    } catch (error) {
      console.error("Error fetching number of stays:", error);
      setRemainingDays(totalDays); // Reset remaining days to totalDays if fetch fails
    }
  };


  const handleChangeNumDay = (newValue: number) => {
    if (newValue >= 0 && newValue <= num) {
      setNumDay(newValue);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };



 

  const handlePastLinkClick = () => {
    setLoading(true);
    setError(null);

    fetch(
      `http://localhost:3001/linkPreview?url=${encodeURIComponent(url)}&lang=en`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLinkPreview(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching link preview data");
        setLoading(false);
      });
  };

  const handleCardClick = () => {
    setSelected(!selected);
  };

  const [plannerNameId, setPlannerNameId] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembersByTripId(tripId)
      .then((tripData) => {
        setMembers(tripData.members);
        setPlannerNameId(tripData.plannerName);
      
      
      })
      .catch((error) => {
        console.error("Error fetching members data:", error);
        // Handle error if needed
      });
  }, [tripId]);

  const [allmembers, setAllMembers] = useState([]);
  useEffect(() => {
    if (plannerNameId && members) {
      setAllMembers( [plannerNameId, ...members.map((member) => member)]);
      console.log("allmembers", allmembers);
    }
  }, [plannerNameId, members]);


  
  const renderToastMessage = (message: string, type: 'success' | 'error') => {
    toast(message, { type });
  };

  // Generate a random price between 50 and 400
 const randomPrice = Math.floor(random() * (700 - 200 + 1) + 200);

  const handleSuggestExperience = () => {
    setLoading(true);
    setError(null);

    const { image, title, description } = linkPreview;

    fetch("http://localhost:3001/activityUrl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
        title,
        numDay,
        description,
        placeId: selectedPlaceId,
        type: "stays",
        tripId,
        userId: allmembers,
        price: randomPrice,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        renderToastMessage("Stay added successfully", 'success');
        // Reload the page after the toast is closed
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Adjust the timeout as needed
      })
      .catch((error) => {
        setError("Stay suggesting experience");
        renderToastMessage("Error adding place", 'error');
        setLoading(false);
      });
  };


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

              <>
                <div className="flex items-center justify-center ">
                  <Input
                    className="w-100 ml-5"
                    placeholder="Enter URL"
                    value={url}
                    onChange={handleInputChange}
                  />
                  <Button className="mr-5 py-3" onClick={handlePastLinkClick}>
                    Past Link
                  </Button>
                </div>

                <div className="flex items-center justify-center">
                  {loading && <p>Loading...</p>}
                  {error && <p>{error}</p>}
                  {linkPreview && (
                    <div
                      className={`max-w-xl mx-auto flex rounded-lg overflow-hidden shadow-lg dark:bg-strokedark bg-gray mt-4 cursor-pointer ${selected ? "border-primary border-2" : ""
                        }`}
                      onClick={handleCardClick}
                    >
                      <img
                        className="w-1/2 h-auto"
                        src={linkPreview.image || "placeholder-image-url"}
                        alt="Image"
                      />
                      <div className="flex flex-col justify-center px-4 py-2 ">
                        <div className="font-bold dark:text-stroke text-strokedark mb-2">
                          {linkPreview.title || "Title not available"}
                        </div>
                        <p className="text-gray-200 text-sm line-clamp-5 ">
                          {linkPreview.description ||
                            "Description not available"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 ">
                  <div className="flex justify-center items-center gap-1 mt-2 ml-5">
                    <div className="flex flex-col items-start">
                      <label className="mr-2">Days:</label>
                      <DayInput
                        value={numDay}
                        onChange={handleChangeNumDay}
                        maxDays={remainingDays}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <label className="mr-2">Choose Place:</label>
                      <DropDownPlaces onPlaceSelect={handlePlaceSelect} />

                    </div>
                  </div>
                  <div className="flex justify-end mx-4 mt-8">
                    <Button
                      type="button"
                      text="danger"
                      bg="default"
                      size="lg"
                      className="text-sm font-bold"
                      onClick={handleSuggestExperience}
                    >
                      Add Stay
                    </Button>
                  </div>
                </div>
              </>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};
export { ProposeStays };
 

