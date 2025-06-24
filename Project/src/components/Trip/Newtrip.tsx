import React, { useEffect, useState } from "react";
import { Button } from "../atoms/Buttons/Button";
import { format, differenceInDays } from "date-fns";
import { Loader } from "@googlemaps/js-api-loader";
import { NewUserModal } from "../Modals/NewUserModal";
import { Country, State } from "country-state-city";
import { createTrip } from "../../hooks/api";
import { useUserModal } from "../../hooks/useModal";
import { Input } from "../atoms/input/input";
import DateCalendar from "../Dates/DateCalendar";
import Selector from "../atoms/input/Selector";
import "../../css/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/style.css";

const Newtrip = () => {
  let countryData = Country.getAllCountries();
  const [statesData, setStatesData] = useState([]);
  const [countries, setCountries] = useState(countryData[0]);
  const [states, setStates] = useState();
  const { isUserOpen, openUserModal, closeUserModal } = useUserModal(false);
  const [country, setCountry] = useState<string>("");
  const [countryFrom, setCountryFrom] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [coverImage, setCoverImage] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const plannerName = localStorage.getItem("userId");


  useEffect(() => {
    setStatesData(State.getStatesOfCountry(countries?.isoCode));
  }, [countries]);

  useEffect(() => {
    statesData && setStates(statesData[0]);
  }, [statesData]);

  useEffect(() => {
    if (country) {
      const loader = new Loader({
        apiKey: "AIzaSyD5CRDdo4I-nzAfKaow7_5PzLBwsKVGIwI",
        version: "weekly",
        libraries: ["places"],
      });

      loader
        .load()
        .then(() => {
          const placesService = new window.google.maps.places.PlacesService(
            document.createElement("div")
          );
          placesService.findPlaceFromQuery(
            {
              query: `${country} notable places`,
              fields: ["photos", "formatted_address", "name"],
            },
            (results, status) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                results &&
                results.length > 0
              ) {
                // Compile descriptions of notable places
                const descriptions = results.map(
                  (place) => place.formatted_address
                );
                const description = descriptions.join("\n\n");
                setCoverImage(results[0].photos[0]?.getUrl() || "");
                setDescription(description);
              } else {
                console.error(
                  "Failed to fetch cover image and description for country:",
                  status
                );
              }
            }
          );
        })
        .catch((error) => {
          console.error("Error loading Google Maps API:", error);
        });
    }
  }, [country]);

  const renderToastMessage = (message: string, type: "success" | "error") => {
    toast(message, { type });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const daysDifference = differenceInDays(endDate, startDate);
    const rangeDays = Array.from(
      { length: daysDifference + 1 },
      (_, i) => i + 1
    );



    const formatDate = (date) => {
      const year = date.getFullYear();
      const mon = (date.getMonth() + 1).toString().padStart(2, "0");
      const month = mon ? format(mon, "MMM") : null;
      const day = date.getDate().toString().padStart(2, "0");
      return `${day}-${month}-${year}`;
    };

    const tripData = {
      cover: coverImage,
      title: title,
      countryFrom: countryFrom,
      country: country,
      description: description,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      rangeDays: rangeDays,
      plannerName: plannerName,
      selectedUsers: selectedUsers,
    };
    createTrip(tripData)
      .then(({ result }) => {
        window.location.reload();
        renderToastMessage("Trip added successfully", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1500); 
      })
      .catch((err) => console.log(err));
  };
  const handleUserSubmit = (selectedUsers: any[]) => {
    setSelectedUsers(selectedUsers);
  };

  return (
    <div className="grid grid-row gap-5 justify-center items-center leading-loose text-center">
      <ToastContainer />

      <div className="dark:text-white text-black text-title-md font-bold ">
        Let's set up your trip!
      </div>
      <div className="dark:text-white text-black  text-title-sm font-bold ">
        Let travelers know what your trip is all about.
      </div>
      <form onSubmit={handleSubmit}>
        {/* Avatars section */}
        <div className="flex items-center justify-center  ">
          {selectedUsers.map((avatarIndex) => (
            <div key={avatarIndex} className="relative -mr-4">
              <img
                className={`h-16 w-16 rounded-full cursor-pointer transition duration-300 transform hover:scale-110 `}
                src={avatarIndex.avatar}
                alt={`Avatar ${avatarIndex}`}
              />
            </div>
          ))}
          <NewUserModal
            onUserClose={closeUserModal}
            isUserOpen={isUserOpen}
            onSubmit={handleUserSubmit}
          />
          <Button
            className={`h-16 w-16 rounded-full bg-sidedark transition duration-300 transform hover:scale-110`}
            size="small"
           
            type="button"
            onClick={openUserModal}
          >
            <span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z"
                    fill="#ffffff"
                  ></path>
                </g>
              </svg>
            </span>
          </Button>
        </div>
        <div className="grid grid-row items-start leading-normal text-left ">
          <label className="font-bold">Title</label>
          <span>Select the best title for your trip.</span>
          <Input
            type="text"
            placeholder="What's the title of your trip"
            className={`xl:w-150 ${
              isSubmitted && !title && "required-and-empty"
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-row items-start leading-normal text-left ">
          <label className="font-bold">Destination</label>
          <div className="flex  gap-2 flex-wrap">
            <div className="flex-grow ">
              <span>From.</span>
              <Selector
                data={countryData}
                selected={countries}
                setSelected={setCountries}
                value={countryFrom}
                onChange={setCountryFrom}
              />
            </div>

            <div className="flex-grow ">
              <span>To.</span>
              <Selector
                data={countryData}
                selected={countries}
                setSelected={setCountries}
                value={country}
                onChange={setCountry}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-row items-start text-left ">
          <label className="font-bold">Dates</label>
          <span>Pick date that works for the group.</span>
          <DateCalendar
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
        <Button size="md" type="submit" text="danger" className="my-2">
          <span>
            <svg
              width="25"
              height="15"
              viewBox="0 0 25 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector - 0"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.5 10.305C13.5639 8.93099 14.4847 6.36767 13.767 3.99441C13.0492 1.62114 10.8622 -0.00228214 8.38281 -0.00228214C5.90339 -0.00228214 3.71638 1.62114 2.99865 3.99441C2.28091 6.36767 3.20174 8.93099 5.26562 10.305C3.44734 10.9752 1.89447 12.2153 0.83875 13.8403C0.687744 14.0647 0.669297 14.3531 0.790472 14.595C0.911648 14.8368 1.15367 14.9947 1.42384 15.0081C1.69402 15.0215 1.95048 14.8884 2.095 14.6597C3.47858 12.5317 5.84458 11.2479 8.38281 11.2479C10.921 11.2479 13.287 12.5317 14.6706 14.6597C14.8995 14.9999 15.3592 15.0932 15.7026 14.8692C16.0461 14.6452 16.1459 14.1869 15.9269 13.8403C14.8712 12.2153 13.3183 10.9752 11.5 10.305ZM4.25781 5.625C4.25781 3.34683 6.10464 1.5 8.38281 1.5C10.661 1.5 12.5078 3.34683 12.5078 5.625C12.5078 7.90317 10.661 9.75 8.38281 9.75C6.10571 9.74742 4.2604 7.9021 4.25781 5.625ZM23.9584 14.8781C23.6115 15.1043 23.1469 15.0066 22.9206 14.6597C21.5386 12.5303 19.1714 11.2466 16.6328 11.25C16.2186 11.25 15.8828 10.9142 15.8828 10.5C15.8828 10.0858 16.2186 9.75 16.6328 9.75C18.2941 9.74843 19.7924 8.75041 20.4339 7.21798C21.0755 5.68554 20.7351 3.9178 19.5705 2.73312C18.4058 1.54844 16.6441 1.17805 15.1009 1.79344C14.8505 1.90171 14.561 1.86541 14.345 1.69864C14.129 1.53188 14.0206 1.26096 14.062 0.99125C14.1034 0.721535 14.288 0.495581 14.5441 0.40125C17.2187 -0.665433 20.267 0.460007 21.6068 3.00883C22.9466 5.55765 22.1452 8.7067 19.75 10.305C21.5683 10.9752 23.1212 12.2153 24.1769 13.8403C24.4031 14.1872 24.3053 14.6518 23.9584 14.8781Z"
                fill="#AB2117"
              />
            </svg>
          </span>
          Create Group Vacation
        </Button>
      </form>
    </div>
  );
};
export default Newtrip;
