import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Input, TimeInput } from "../atoms/input/input";
import { Button } from "../atoms/Buttons/Button";
import TimePicker from "../Dates/TimePicker";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/style.css';

// Import Math.random for generating random numbers
const { random } = Math;


interface LocationDetails {
  image: string;
  title: string;
  description: string;
}
interface ProposeGoogleMapsModalProps {
  placeId: String;
  day: Number;
  tripId: String;

}
const ProposeGoogleMapsModal: React.FC<ProposeGoogleMapsModalProps> = ({
  placeId,
  day,

  tripId,
  
}) => {
  const [selected, setSelected] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [placeInput, setPlaceInput] = useState<string>("");
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);

  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");



  const handleCardClick = () => {
    console.log("placeId",placeId);
    setSelected(!selected);
  };




  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyD5CRDdo4I-nzAfKaow7_5PzLBwsKVGIwI",
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        }
      );
      setMap(mapInstance);
    });
  }, []);
 

  const handleSearch = () => {
    if (!map) return;

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      { input: placeInput },
      (predictions) => {
        if (predictions && predictions.length > 0) {
          const placeId = predictions[0].place_id;
          const placesService = new window.google.maps.places.PlacesService(
            map
          );
          placesService.getDetails({ placeId }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const bounds = new window.google.maps.LatLngBounds();
              const viewport = place.geometry.viewport;
              if (viewport) {
                bounds.union(viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
              map.fitBounds(bounds, 50);
              const image = place.photos && place.photos[0].getUrl();
              const title = place.name;
              const description = place.formatted_address;
              setLocationDetails({ image, title, description });
            } else {
              console.error("Place details request failed: ", status);
            }
          });
        }
      }
    );
  };

  const renderToastMessage = (message: string, type: 'success' | 'error') => {
    toast(message, { type });
  };

  const userId = localStorage.getItem("userId");


  // Generate a random price between 50 and 400
  const randomPrice = Math.floor(random() * (200 - 50 + 1) + 50);

  const handleSuggestExperience = () => {
    const { image, title, description } = locationDetails;

    fetch("http://localhost:3001/activityUrl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
        title,
        description,
        day:day,
        placeId: placeId,

        suggestedBy:userId,

        price: randomPrice,

        from: from,
        to: to,
        type:"experience",
        tripId: tripId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Experience added successfully:", data.message);
        renderToastMessage("Activity added successfully", 'success');
        // Reload the page after the toast is closed
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.error("Error suggesting experience:", error);
        renderToastMessage("Error adding Activity", 'error');
      });
  };
  return (
    <div className="relative">
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="mb-2">
          <Input
            className=" w-100"
            type="text"
            placeholder="Enter place to search"
            id="autocomplete"
            value={placeInput}
            onChange={(e) => setPlaceInput(e.target.value)}

          />
          <Button className="py-3" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      <div
        className="rounded-md"
        id="map"
        style={{ height: "258px", width: "100%", position: "relative" }}
      >
        {/* Google Map */}
      </div>
      {locationDetails && (
        <div
          className={`absolute top-28 z-100 left-5 h-45 w-40 bg-white rounded-lg shadow-2xl flex flex-col ${
            selected ? "border-primary border-2" : ""
          }`}
          onClick={handleCardClick}
        >
          {locationDetails.image && (
            <img
              className="w-50 h-30 rounded-lg shadow-2xl"
              src={locationDetails.image}
              alt="Location"
            />
          )}
          <div className="font-bold text-md mt-2 text-sidedark text-center">
            {locationDetails.title || "Name not available"}
          </div>
          <p className="text-sm line-clamp-2 text-white text-center">
            {locationDetails.description || "Description not available"}
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 ">
        <div className="flex justify-center items-center gap-1 mt-2">
          <div className="flex flex-col items-start">
            <label className="mr-2">From:</label>
            <TimePicker value={from} onChange={setFrom} />
          </div>
          <div className="flex flex-col items-start">
            <label className="mr-2">To:</label>
            <TimePicker value={to} onChange={setTo} />
          </div>
        </div>
        <div className="flex justify-end mx-4 mt-8">
          <Button
            type="button"
            text="danger"
            bg="default"
            size="lg"
            className="text-sm font-bold"
            onClick={handleSuggestExperience}
          >
            Suggest Experience
          </Button>
        </div>
      </div>
    </div>
  );
};
export { ProposeGoogleMapsModal };
