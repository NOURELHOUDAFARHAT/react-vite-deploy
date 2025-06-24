import React from "react";
import { Button } from "../atoms/Buttons/Button";
import { Link } from "react-router-dom";

interface TripCardProps {
  Image: string;
  Title: string;
  StartDate: string;
  countryFrom:String,
  Description: string;
  Country: string;

  EndDate: string;
  TripId: string;
  showButton?: boolean; // Add showButton prop
}

const TripCard: React.FC<TripCardProps> = ({
  Image,
  Title,
  StartDate,
  Description,
  Country,
  countryFrom,

  EndDate,

  TripId,
  showButton = true, // Default to true if not provided
}) => {
  return (
  
      <div className="  transition-transform duration-300 transform  rounded-xl"  >
        <img className="w-full rounded-lg  h-70 object-cover " src={Image} alt="Trip" />
        <div className="absolute inset-0 bg-black bg-opacity-40  text-white  flex flex-col justify-start items-start p-4">
          <div className="dark:text-white text-white text-title-xl font-bold mb-2">
          {Title ? `${Title.charAt(0).toUpperCase()}${Title.slice(1)}` : ''} 
          </div>
          <div className="flex flex-cols-2 gap-0.5 mb-2">
            <div className="bg-transparent backdrop-blur-2xl text-white rounded-md text-md font-normal flex flex-cols-2 gap-1 justify-center py-1 px-0.5 mx-1">
              <img src="/images/icon/calendar.svg" alt="calender" />
              {StartDate} 
            </div>
            <div className="bg-transparent backdrop-blur-2xl text-white rounded-md  text-md font-normal flex flex-cols-2 gap-1 justify-center py-1 px-0.5 mx-1">
            <img src="/images/icon/calendar.svg" alt="calender"  />
              {EndDate} 
            </div>
          </div>

          <div className="text-white-500 text-sm w-90 font-normal mb-2 line-clamp-2">
            {Description}
          </div>

          <div className="bg-form-strokedark  p-2 border border-white rounded-md flex flex-cols-2 gap-1 justify-center  mb-2">
            <img
              src="/images/icon/airplane.svg"
              alt="airplane"
              className="rounded-full dark:bg-form-strokedark"
            />
            From
            <div className="text-primary">{countryFrom}</div>
            To
            <div className="text-primary">{Country}</div>
          </div>

          {showButton && (
          <div className="absolute bottom-4 left-4">
            <Button size="md">
              <Link to={`/Trips/tripItinerary/${TripId}`}> View Details</Link>
            </Button>
          </div>
          )}
        </div>
      </div>

  );
};

export { TripCard };
