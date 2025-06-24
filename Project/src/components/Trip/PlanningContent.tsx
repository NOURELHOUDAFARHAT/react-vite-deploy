import React, { useState, useEffect } from "react";

import axios from "axios"; // Import axios for making HTTP requests
import { useParams } from "react-router-dom";
import {
  fetchPlacesByTripId,
  fetchPlacesDays,
  fetchTripDays,
} from "../../hooks/api";
import PlanCards from "../Cards/PlanCards";
import DaysSlider from "../Slider/DaysSlider";
import DayPlanning from "./DayPlanning";
interface PlanningContentProps {
  tripId: string;
}

const PlanningContent: React.FC<PlanningContentProps> = ({ tripId }) => {
  const [tripData, setTripData] = useState(null);
  const [totalDays, setTotalDays] = useState<number[]>([]); // Initial value

  const handleDayChange = (day: number) => {
    setActiveDay(day);
  };
  const [activeDay, setActiveDay] = useState<number>(1);

  useEffect(() => {
    console.log("Trip ID:", tripId); // Check if tripId is logged correctly
    if (tripId) {
      fetchPlacesByTripId(tripId)
        .then((placeData) => {
          console.log("Response:", placeData); // Check the response data
          setTripData(placeData); // Set the tripData with response data
        })
        .catch((error) => {
          console.error("Error fetching:", error);
          // Handle error if needed
        });
    }
  }, [tripId]);

  useEffect(() => {
    console.log("Trip ID:", tripId); // Check if tripId is logged correctly
    if (tripId) {
      fetchPlacesDays(tripId)
        .then((numDays) => {
          console.log("NumDays:", numDays); // Check the numDays array
          setTotalDays(numDays); // Update totalDays with the length of numDays array
        })
        .catch((error) => {
          console.error("Error fetching:", error);
          // Handle error if needed
        });
    }
  }, [tripId]);

  return (
    <>
      {tripData && (
        <div className="w-full">
          {/* Iterate over categories */}
          {tripData.map((place, index) => (
            <div key={index} className="flex flex-col gap-5 p-2">
              <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-strokedark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  <h3 className="font-bold text-title-lg text-black dark:text-white">
                  Experiences In {place.title.toUpperCase()}
                   
                  </h3>

                  {/* Content based on selected day with smooth scroll */}
                  <DayPlanning
                    tripId={tripId}
                    placeId={place._id}
                    index={index}
                    
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PlanningContent;
