import React, { useEffect, useState } from "react";
import { Button } from "../atoms/Buttons/Button";
import { Input } from "../atoms/input/input";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import TimePicker from "../Dates/TimePicker";
import DayInput from "../Dates/DayInput";
import { fetchTripDays } from "../../hooks/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/style.css';

// Import Math.random for generating random numbers
const { random } = Math;

interface ProposeUrlModalProps {
  placeId: String;
  tripId: String;
  day:Number;
}

const ProposeUrlModal: React.FC<ProposeUrlModalProps> = ({
  placeId,
  tripId,
  day,
}) => {
  const [url, setUrl] = useState<string>("");
  const [linkPreview, setLinkPreview] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const [totalDays, setTotalDays] = useState<number>(0);

  useEffect(() => {
    if (tripId) {
      fetchTripDays(tripId)
        .then((response) => {
          const rangeDays = response.rangeDays;
          setTotalDays(rangeDays.length > 0 ? rangeDays.length : 1);
        })
        .catch((error) => {
          console.error("Error fetching rangeDays:", error);
        });
    }
  }, [tripId]);

 

  const handlePastLinkClick = () => {
    setLoading(true);
    setError(null);

    fetch(
      `http://localhost:3001/linkPreview?url=${encodeURIComponent(url)}&lang=en`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLinkPreview(data);
        console.log("price", data)
       
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching link preview data");
        setLoading(false);
      });
  };

  const handleCardClick = () => {
    setSelected(!selected);
  };

  const renderToastMessage = (message: string, type: 'success' | 'error') => {
    toast(message, { type });
  };


  const userId = localStorage.getItem("userId");

   // Generate a random price between 50 and 400
   const randomPrice = Math.floor(random() * (200 - 50 + 1) + 50);


  const handleSuggestExperience = () => {
    setLoading(true);
    setError(null);

    const { image, title, description } = linkPreview;

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

       placeId:placeId,
       suggestedBy:userId,

        from,
        type:"experience",
        to,
        tripId,
        price: randomPrice,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        renderToastMessage("Activity added successfully", 'success');
        // Reload the page after the toast is closed
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        setError("Error suggesting experience");
        renderToastMessage("Error adding Activity", 'error');
        setLoading(false);
      });
  };

  return (
    <>
      <div className="flex items-center justify-center ">
        <Input
          className="w-100 ml-5"
          placeholder="Enter URL"
          value={url}
          onChange={handleInputChange}
        />
        <Button className="mr-5 py-3" onClick={handlePastLinkClick}>
          Past Link
        </Button>
      </div>

      <div className="flex items-center justify-center">
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {linkPreview && (
          <div
            className={`max-w-xl mx-auto flex rounded-lg overflow-hidden shadow-lg dark:bg-strokedark bg-gray mt-4 cursor-pointer ${
              selected ? "border-primary border-2" : ""
            }`}
            onClick={handleCardClick}
          >
            <img
              className="w-1/2 h-auto"
              src={linkPreview.image || "placeholder-image-url"}
              alt="Image"
            />
            <div className="flex flex-col justify-center px-4 py-2 ">
              <div className="font-bold dark:text-stroke text-strokedark mb-2">
                {linkPreview.title || "Title not available"}
              </div>
              <p className="text-gray-200 text-sm line-clamp-5 ">
                {linkPreview.description || "Description not available"}
              </p>
             </div>
          </div>
        )}
      </div>

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
    </>
  );
};

export { ProposeUrlModal };
