import React, { useState, useEffect } from 'react';
import { Button } from "../atoms/Buttons/Button";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { acceptTripInvitation, declineTripInvitation, fetchNotifCards } from '../../hooks/api';
interface NotifCardProps {

  userId: string; // Add userId prop
}

const 
NotifCard : React.FC<NotifCardProps> = ({

  userId // Pass userId as prop
  
}) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(()=> {
    fetchNotifCards(setData);
  }, [])

  const isAuthorized = (trip) => {
    return  trip.selectedUsers.includes(userId);
  };


  const handleDecline = (tripId: string) => {
    declineTripInvitation(tripId, userId, setData, data);
  };

  const handleAccept = (tripId: string) => {
    acceptTripInvitation(tripId, userId, setData, data);
  };




  return (

    <>
    
    {data.filter(isAuthorized).map((item) => (
          <Link
          key={item._id}
              className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-strokedark"
              to="/trips"
            >
    
      <div className="grid grid-cols-1  justify-start items-start ">
        <div className="grid grid-rows  gap-1 ">
          <div className="dark:text-white  text-black text-md font-semibold ">{item.title}</div>
          <div className="flex flex-cols-2 gap-0.5  ">
            <div className=" dark:bg-sidedark border  border-white dark:border-gray bg-gray text-form-strokedark rounded-md dark:text-white text-sm font-normal  flex flex-cols-2 gap-1 justify-center py-0.5  w-full ">
              <img src="\public\images\icon\calendar.svg" alt="calender" />
              {item.startDate }  
            </div>
            <div className=" dark:bg-sidedark border  border-white dark:border-gray bg-gray text-form-strokedark  rounded-md dark:text-white text-sm font-normal flex flex-cols-2 gap-1  justify-center py-0.5 w-full">
            <img src="\public\images\icon\calendar.svg" alt="calender" />
              {item.endDate} 
            </div>
          </div>

          <div className=" text-white-500 text-sm font-normal ">
          {item.Description}
          </div>

          <div className="dark:bg-strokedark text-sm  bg-gray  border border-white rounded-md flex flex-cols-2 gap-1 items-center justify-center w-full  ">
            <img
              src="\public\images\icon\airplane.svg"
              alt="airplane"
              className="rounded-full dark:bg-sidedark"
            />
            From
            <div className="text-primary">Tunisia</div>
            To
            <div className="text-primary">{item.country}</div>
          </div>

          <div className="flex justify-evenly items-center gap-3 mt-1">
            <Button size="notifi" onClick={() => handleAccept(item._id)} >Accept</Button>
            <Button size="notifi" 
            className="dark:bg-strokedark bg-gray hover:bg-white dark:border-2 dark:border-sidedark dark:hover:bg-sidedark "
            onClick={() => handleDecline(item._id)}
            >
              Decline</Button>
            
          </div>

        </div>
      </div>
    </Link>
    ))}
    </>
  );
};

export { NotifCard };
