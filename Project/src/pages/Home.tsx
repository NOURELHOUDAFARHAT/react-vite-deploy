import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/Breadcrumbs/layout/DefaultLayout";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { TripCard } from "../components/Cards/TripCard";
import DateCalendar from "../components/Dates/DateCalendar";
import Slider from "react-slick";
import { CardList } from "../components/Cards/Card";
import DoneTrip from "../components/Trip/DoneTrips";
import Cards from "../components/Cards/Cards";
import { fetchNotifCards } from "../hooks/api";
import { Button } from "../components/atoms/Buttons/Button";
import { Link } from "react-router-dom";

const Home = () => {
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
      
  
         
    if (currentDate < tripEndDate) {
      return trip.members.includes(userId) || trip.plannerName === userId; // Trip is ongoing or has not yet started
    } else {
      return false; // Trip has ended
    }

    // Check if the user is authorized
  };
  return (
    <DefaultLayout>
      <Breadcrumb title="Home" pageName="Home" />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-8 dark:bg-strokedark bg-white p-4 rounded-xl">
          <h3 className="font-bold text-title-md text-black dark:text-white ">
            Trips exclusively for you
          </h3>
          <Cards />
        </div>
        <div className="col-span-12 xl:col-span-4 bg-gray-200 ">
          <div className="relative bg-primary  rounded-xl  h-45 w-full">
            <div className="absolute inset-0 bg-boxdark bg-opacity-10"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-start px-4 z-10">
              <div className="text-white w-full">
                <h3 className="text-2xl font-bold">The journey</h3>
                <p className="text-md">
                  is the
                  <span className="text-2xl font-bold"> destination</span>
                </p>
              </div>

              <a
                href="/Trips"
                className="relative text-white hover:text-sidedark transition-colors duration-300 pt-3"
              >
                <span className="mr-1">Go to Trips</span>
              </a>
            </div>
          </div>
          <img
            className="absolute  left-50% transform translate-x-40 -translate-y-55 w-60 sm:w-60 h-60 object-cover z-0"
            src="/public/images/cover/home.png"
            alt="3D Image"
          />

          <div className="mt-2">
            <DateCalendar
              startDate={undefined}
              setStartDate={function (date: Date): void {
                throw new Error("Function not implemented.");
              }}
              endDate={undefined}
              setEndDate={function (date: Date): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7 bg-gray-200 p-4">
          <h3 className="font-bold text-title-md text-black dark:text-white ">
            Upcoming trips
          </h3>

          <div
            className="overflow-y-auto gap-2 flex flex-col mt-4"
            style={{ maxHeight: "19rem" }}
          >
            {data.filter(isAuthorized).map((item) => (
              <TripCard
                Image={item.cover}
                Title={item.title}
                Description={item.description}
                Country={item.country}
                StartDate={item.startDate}
                EndDate={item.endDate}
                TripId={item._id}
                countryFrom={item.countryFrom}
              />
            ))}
          </div>
        </div>
        <div className="col-span-12 xl:col-span-5 bg-gray-200 p-4">
          <h3 className="font-bold text-title-md text-black dark:text-white">
            Done trips
          </h3>
          <DoneTrip />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Home;
