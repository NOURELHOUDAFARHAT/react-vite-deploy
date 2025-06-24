import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { PlanCard } from "../../components/Cards/PlanCard";

import { Button } from "../../components/atoms/Buttons/Button";

import CustomSlider from "../../components/Slider/CustomSlider";
import { ProposeModal } from "../../components/Modals/ProposeModal";
import { DesModal } from "../../components/Modals/DesModal";
import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import axios from "axios";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/style.css';


interface PlanCardProps {
  placeId: String;
  day: Number;
  tripId: String;
}

const PlanCards: React.FC<PlanCardProps> = ({ placeId, day, tripId }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Number of cards to show at once
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    console.log("is open:");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleDoubleClick = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };
  const closesideModal = () => {
    setIsModalOpen(false);
  };

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/categories") // Assuming your backend endpoint is '/categories'
      .then((response) => {
        setActivities(response.data); // Update state with fetched activities
      
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }, []);

  const isMatched = (activities) => {
    return (
      activities.placeId === placeId &&
      activities.day === day &&
      activities.tripId == tripId &&
      activities.type=="experience"
    );
  };


  
  const renderToastMessage = (message: string, type: 'success' | 'error') => {
    toast(message, { type });
  };

  const onDelete = (activityId) => {
    axios
      .delete(`http://localhost:3001/deleteactivity/${activityId}`) // Assuming your backend endpoint for deleting activities is '/activities/:id'
      .then((response) => {

        console.log("Activity deleted:", response.data);
        // Optionally, you can update the activities state to reflect the deletion
        // Refresh the page after creating the trip
        renderToastMessage("Activity deleted successfully", 'success');
        // Reload the page after the toast is closed
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      })
      .catch((error) => {
        console.error("Error deleting activity:", error);
        renderToastMessage("Error on deleting Activity", 'error');
      });
  };


  return (
    <>
      <ProposeModal
        onClose={closeModal}
        isOpen={isOpen}
        placeId={placeId}
        day={day}
        tripId={tripId}
         />

      <CustomSlider settings={settings}>
        <div className="flex items-center p-2">
          <Button size="card" bg="card" onClick={openModal}>
            <span className="flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="stroke-black dark:stroke-white"
                width="80"
                height="80"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title></title>{" "}
                  <g id="Complete">
                    {" "}
                    <g data-name="add" id="add-2">
                      {" "}
                      <g>
                        {" "}
                        <line
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          x1="12"
                          x2="12"
                          y1="19"
                          y2="5"
                        ></line>{" "}
                        <line
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          x1="5"
                          x2="19"
                          y1="12"
                          y2="12"
                        ></line>{" "}
                      </g>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
            </span>
          </Button>
        </div>
        {activities.filter(isMatched).map((activity) => (
          <div className="p-2">
            <div onDoubleClick={() => handleDoubleClick(activity)}>
              <PlanCard
                placeId={activity.placeId}
                activityId={activity._id}
                Image={activity.image}
                Title={activity.title}
                Description={activity.description}
              />
            </div>
          </div>
        ))}
      </CustomSlider>
      <DesModal
        onClose={closesideModal}
        isOpen={isModalOpen}
        activityId={selectedActivity ? selectedActivity._id : ""}
        Image={selectedActivity ? selectedActivity.image : ""}
        Title={selectedActivity ? selectedActivity.title : ""}
        Description={selectedActivity ? selectedActivity.description : ""}
       
        from={selectedActivity ? selectedActivity.from : ""}
to={selectedActivity ? selectedActivity.to: ""}
        duration={selectedActivity ? selectedActivity.duration : ""}
        suggestedBy={selectedActivity ? selectedActivity.suggestedBy : ""}
        onDelete={() => onDelete(selectedActivity ? selectedActivity._id : "")}
        tripId={tripId} userIdList={selectedActivity ? selectedActivity.userId : []}     />

    </>
  );
};

export default PlanCards;
