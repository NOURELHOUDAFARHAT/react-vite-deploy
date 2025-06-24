import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
// Update import path for Input and Button components
import {
  fetchCountryTripId,
  fetchPlacesDaysItinerary,
  fetchTripDays,
} from "../../hooks/api";
import { Input } from "../atoms/input/input";
import { Button } from "../atoms/Buttons/Button";
import DayInput from "../Dates/DayInput";
import { Country, State } from "country-state-city";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/style.css";
import Selector from "../atoms/input/Selector";
import StateSelector from "../atoms/input/StateSelector";

interface Activity {
  numDay: number;
  // Add other properties as needed
}

interface LocationDetails {
  image: string;
  title: string;
  description: string;
}

interface ProposeGoogleMapsProps {
  tripId: string;
}

const ProposeGoogleMaps: React.FC<ProposeGoogleMapsProps> = ({ tripId }) => {
  const [selected, setSelected] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [placeInput, setPlaceInput] = useState<string>("");

  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);
  const [numDay, setNumDay] = useState<number>(0);
  const [num, setNum] = useState<number>(0);
  const [existingActivities, setExistingActivities] = useState<Activity[]>([]);
  const [remainingDays, setRemainingDays] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);

  const handleCardClick = () => {
    setSelected(!selected);
  };

  useEffect(() => {
    if (tripId) {
      fetchTripDays(tripId)
        .then((response) => {
          const rangeDays = response.rangeDays;

          const daysCount = rangeDays.length > 0 ? rangeDays.length : 1;
          setTotalDays(daysCount); // Set totalDays

          // Calculate remainingDays based on existing activities
          const existingDays = existingActivities.reduce(
            (total, activity) => total + activity.numDay,
            0
          );
          const remainingDays = daysCount - existingDays;
          setRemainingDays(remainingDays);
        })
        .catch((error) => {
          console.error("Error fetching rangeDays:", error);
        });
    }
  }, [tripId]);

  useEffect(() => {
    if (tripId) {
      fetchPlacesDaysItinerary(tripId)
        .then((response) => {
          setNum(totalDays);
          console.log("numday", num);
          if (response && response.numDays && Array.isArray(response.numDays)) {
            const Places = response.numDays;
            console.log("act", Places);

            // Calculate existingDays by summing the numDay values inside activities
            const existingDays = Places.reduce((total, num) => {
              return total + num; // Add each numDay to total
            }, 0);
            setExistingActivities(Places);
            const remainingDays = totalDays - existingDays;
            setRemainingDays(remainingDays);
            console.log("remain", remainingDays);
          } else {
            console.error(
              "Error: Places is not an array or does not contain numDays"
            );
            setExistingActivities([]);
            setRemainingDays(totalDays);
          }
        })
        .catch((error) => {
          console.error("Error fetching existing Places:", error);
        });
    }
  }, [tripId, totalDays]);

  const handleChangeNumDay = (newValue: number) => {
    setNumDay(newValue);
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
      { input: selectedState },
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

  const renderToastMessage = (message: string, type: "success" | "error") => {
    toast(message, { type });
  };

  const handleSuggestExperience = () => {
    const { image, title, description } = locationDetails;
    fetch("http://localhost:3001/addPlace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
        title,
        description,
        numDay,
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
        console.log("Place added successfully:", data.message);
        setNumDay(0);
        renderToastMessage("Place added successfully", "success");
        // Reload the page after the toast is closed
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Adjust the timeout as needed
      })
      .catch((error) => {
        console.error("Error adding place:", error);
        renderToastMessage("Error adding place", "error");
      });
  };
  const [selectedState, setSelectedState] = useState("");

  const handleStateChange = (value) => {
    setSelectedState(value);
    setPlaceInput(value);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-center gap-2  mb-2 w-100 mx-7">
        <StateSelector
          tripId={tripId}
          value={selectedState}
          onChange={handleStateChange}
        />

        <Button  onClick={handleSearch}>
          Search
        </Button>
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
          <p className="text-sm line-clamp-2 text-sidedark text-center">
            {locationDetails.description || "Description not available"}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start">
          <label className="mr-2">Days:</label>
          <DayInput
            value={numDay}
            onChange={handleChangeNumDay}
            maxDays={remainingDays}
          />
          
        </div>
        <div className="flex justify-end mt-3 ">
        <Button
          type="button"
          text="danger"
          bg="default"
          size="lg"
          className="text-sm font-bold"
          onClick={handleSuggestExperience}
        >
          Add City
        </Button>
      </div>
      </div>

      
    </div>
  );
};

export { ProposeGoogleMaps };
