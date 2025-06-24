import axios from "axios";
import React, { useEffect, useState } from "react";

interface PlanCardProps {
  placeId: String;
  activityId: string;
  Image: string;
  Title: string;
  Description: string;
}

const PlanCard: React.FC<PlanCardProps> = ({
  Image,
  Description,
  Title,
  placeId,
  activityId,
}) => {
  return (
    <>
      <div
        className="max-w-sm  overflow-hidden shadow-lg relative transition-transform duration-300 transform hover:scale-105 rounded-xl"
        key={activityId}
      >
        <img className="w-full h-64 object-cover" src={Image} alt={Title} />
        <div className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
          <h3 className="text-title-lg font-semibold px-5"> {Title}</h3>
          <p className="text-md  px-5 line-clamp-2">{Description}</p>
        </div>
      </div>
    </>
  );
};

export { PlanCard };
