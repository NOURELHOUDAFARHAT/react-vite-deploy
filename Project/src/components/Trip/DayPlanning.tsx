import React, { useEffect, useState } from "react";
import DaysSlider from "../Slider/DaysSlider";
import { fetchPlacesDays } from "../../hooks/api";
import PlanCards from "../Cards/PlanCards";
interface PlanningContentProps {
  tripId: string;
  placeId: string;
  index: number;
}

const DayPlanning: React.FC<PlanningContentProps> = ({
  tripId,
  placeId,
  index,
}) => {
  const [tripData, setTripData] = useState(null);
  const [totalDays, setTotalDays] = useState<number[]>([]); // Initial value

  const handleDayChange = (day: number) => {
    setActiveDay(day);
  };
  const [activeDay, setActiveDay] = useState<number>(1);

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
    <div>
      <DaysSlider
        rangeDays={totalDays[index]}
        // Pass rangeDays as an array
        buttonNames={Array.from(
          { length: totalDays[index] },
          (_, index) => `Day ${index + 1}`
        )} // Replace with your button names
        activeDay={activeDay}
        handleDayChange={handleDayChange}
      />

      <div className=" content-container overflow-x-auto transition-transform duration-500 ease-in-out">
        {Array.from({ length: totalDays[index] }, (_, index) => index + 1).map(
          (dayNumber) => (
            <div key={dayNumber}>
              {activeDay === dayNumber && (
                <PlanCards placeId={placeId} tripId={tripId} day={dayNumber} />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DayPlanning;
