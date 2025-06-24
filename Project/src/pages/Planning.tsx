
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../components/Breadcrumbs/layout/DefaultLayout';
import PlanningContent from '../components/Trip/PlanningContent';
import DaysSlider from '../components/Slider/DaysSlider';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchNotifCards, fetchTripDays } from '../hooks/api';
import { ToastContainer } from 'react-toastify';


const Planning = () => {


  const { tripId } = useParams();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifCards(setData);
  }, [tripId]);

  const isAuthorized = (trip) => {
    return trip._id == tripId;
  };
 

  return (
    <DefaultLayout>
           {data.filter(isAuthorized).map((trip) => (
      <Breadcrumb  title =  {trip.title ? ` ${trip.title.charAt(0).toUpperCase()}${trip.title.slice(1)} Trip` : ''}pageName="Planning" />

           ))}
           <ToastContainer/>

     <PlanningContent  tripId={tripId}  />
        
    </DefaultLayout>
  );
};

export default Planning;
