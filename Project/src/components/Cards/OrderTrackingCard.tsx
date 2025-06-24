import React from "react";
import { Button } from "../atoms/Buttons/Button";
import { TiTick } from "react-icons/ti";
import { Link } from "react-router-dom";

interface Stay {
  title: string;
  numDay: number;
  _id:string,
  type: string,
  price:number,
}

interface OrderStatus {
  title: string;
  numDay: string;
  stays: Stay[];
  image: string;
  _id: string

}

interface OrderTrackingCardProps {
  orderStatus: OrderStatus[];
  onStatusChange: (status: OrderStatus, index: number) => void;
  tripId:String;
  showDeleteButtons: boolean;

  onDeleteStay: (statusIndex: number, stayId: string,  placeId: string) => void; // Add onDeleteStay prop
  onDeleteStatus: (statusId: string, statusIndex: number) => void; // Add onDeleteStatus prop
}

const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({
  orderStatus,
  onStatusChange,  tripId,
  showDeleteButtons,

  onDeleteStay,
  onDeleteStatus,
}) => {

  const handleStatusChange = (statusId: OrderStatus, index: number) => {
    onStatusChange(statusId, index);
  };

 

  const handleDeleteStay = (statusIndex: number, stayId: string,  placeId: string) => {
    onDeleteStay(statusIndex, stayId, placeId); // Call onDeleteStay prop
  };

  const handleDeleteStatus = (statusId: string, statusIndex: number) => {
    onDeleteStatus(statusId, statusIndex); // Call onDeleteStatus prop
  };

  return (
    <div className="col-span-12 flex flex-col rounded-sm  dark:bg-strokedark  xl:col-span-4 h-75">
      <div className="overflow-y-auto" style={{ maxHeight: "80rem", flex: "1" }}>
        <div className="w-full max-w-3xl mx-auto">
          {orderStatus.map((status, index) => (
            <div className="-my-6">
              <div className="relative pl-8 sm:pl-32 py-8 group">
                <div className="flex flex-col sm:flex-row items-start mb-1 group:last-child:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px dark:before:bg-white before:bg-form-strokedark sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-primary after:border-2 after:box-content dark:after:border-slate-50 after:border-form-stroke after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                  <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-primary dark:bg-white bg-form-strokedark rounded-full">
                    {status.numDay} days
                  </time>
                  <div className="text-xl font-bold text-primary ">
                    {status.title}
                     {/* Conditionally render delete button */}
                     {showDeleteButtons && (
                      <button
                        className="bg-transapent text-sm text-primary h-1 w-20"
                        onClick={() => handleDeleteStatus(status._id, index)}
                      >
                        X
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-white-500">
                  <ul className="list-disc pl-5">
                  {status.stays
                      .filter((stay) => stay.type === "stays") // Filter stays by type
                      .map((stay, stayIndex) => (
                      <li key={stayIndex}>
                        {stay.title} <span className="font-semibold">{stay.price}$</span>
                        <span className="text-primary text-bold ml-2">
                         {stay.numDay}  days
                        </span>
                        {/* Conditionally render delete button */}
                        {showDeleteButtons && (
                          <button
                          className="bg-transapent font-bold text-sm text-primary h-1 w-20"
                          onClick={() => handleDeleteStay(stayIndex, stay._id, status._id)}
                          >
                            X
                          </button>
                        )}
                      </li>
                      
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          
        </div>
      </div>
      
    </div>
  );
};

export default OrderTrackingCard;
