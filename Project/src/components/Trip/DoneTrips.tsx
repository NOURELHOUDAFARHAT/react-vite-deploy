import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../atoms/Buttons/Button";
import { fetchNotifCards } from "../../hooks/api";

const DoneTrip = () => {
  const userId = localStorage.getItem("userId");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifCards(setData);
  }, []);

  const isAuthorized = (trip) => {

    const currentDate = new Date();
  
    const tripEndDate = new Date(trip.endDate);
  console.log("curnt",currentDate);
  console.log("tri end",tripEndDate);
    
    // Compare the dates
    if (currentDate < tripEndDate) {
       
      return false;
    } 
       

    // Check if the user is authorized
    return trip.members.includes(userId) || trip.plannerName === userId;
  };

  return (
    <>
      <div className="col-span-12 flex flex-col  rounded-sm   py-1 dark:border-strokedark dark:bg-boxdark xl:col-span-4 ">
        {data.filter(isAuthorized).map((trip, index) => (
          <div className="overflow-y-auto" style={{ maxHeight: "30rem" }}>
            <Link
              to="/"
              className="flex items-center rounded-xl mt-4 bg-white dark:bg-strokedark  gap-1.5 py-5 px-7.5"
              key={index}
            >
              <img
                src={trip.cover}
                alt="Trip"
                className="relative h-14 w-14 rounded-full"
              />

              <div className="flex flex-1 items-center justify-between">
                <div>
                  <h5 className="font-bold text-black text-title-md dark:text-white">
                    {trip.title
                      ? `${trip.title
                          .charAt(0)
                          .toUpperCase()}${trip.title.slice(1)}`
                      : ""}{" "}
                    To {trip.country}
                  </h5>
                  <p>
                    <span className="text-md">
                      
                      {trip.startDate}  to {trip.endDate}
               
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-center rounded-full">
                  <Button text="dark" size="md">
                    <Link to={`/Trips/tripItinerary/${trip._id}`}> Rebook</Link>
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        ))}
        <div className=" pt-2">
          <Button size="md" bg="stroke" text="light">
            View Details
          </Button>
        </div>
      </div>
    </>
  );
};

export default DoneTrip;
