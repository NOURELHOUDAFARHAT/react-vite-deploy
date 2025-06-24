import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/Breadcrumbs/layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { Button } from "../components/atoms/Buttons/Button";
import Newtrip from "../components/Trip/Newtrip";
import { TripCard } from "../components/Cards/TripCard";
import DoneTrip from "../components/Trip/DoneTrips";
import { fetchNotifCards } from "../hooks/api";

const Trips = () => {
  const [showNewTripContent, setShowNewTripContent] = useState(false);

  const handleClick = () => {
    // Update the state to show the NewTrip content
    setShowNewTripContent(true);
  };
  const userId = localStorage.getItem('userId');
  const [data, setData] = useState<any[]>([]);

  useEffect(()=> {
    fetchNotifCards(setData);

  }, [])
  
    const isAuthorized = (trip) => {
      const currentDate = new Date();
      const tripEndDate = new Date(trip.endDate);
      console.log("curnt",currentDate);
      console.log("tri end",tripEndDate);
        
    
           
      if (currentDate < tripEndDate) {
        return trip.members.includes(userId) || trip.plannerName === userId; // Trip is ongoing or has not yet started
      } else {
        
        return false // Trip has ended
      }
  

    }
  
  return (
    <DefaultLayout>
      <Breadcrumb title="Trips" pageName="Trips" />
      {showNewTripContent ? (
        <Newtrip /> // Render NewTrip content if showNewTripContent is true
      ) : (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 xl:col-span-7 bg-gray-200 p-4">
          
            <div></div>
            <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-strokedark grid justify-items-center grid-cols-2 mt-4 p-2 ">
              <h4 className="text-lg text-black dark:text-white text-center py-2">
                Create New Trip
              </h4>

              <Button size="small" onClick={handleClick}>
                <span>
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                    width="20"
                    height="20"
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
                              stroke="#000000"
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
                              stroke="#000000"
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
            <div className="overflow-y-auto gap-2 flex flex-col mt-4" style={{ maxHeight: "27rem" }}>
            {data.filter(isAuthorized).map((item) => (

          <TripCard
                Image={item.cover}
                Title={item.title}


                Description={item.description}

                Country={item.country} StartDate={item.startDate} EndDate={item.endDate} TripId={item._id} countryFrom={item.countryFrom}                     />
          ))}
          </div>
        </div>
          <div className="col-span-12 xl:col-span-5 bg-gray-300 p-4">
            <h3 className="font-bold text-title-md text-black dark:text-white">
              Done Trips
            </h3>
            <DoneTrip />
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};
export default Trips;
