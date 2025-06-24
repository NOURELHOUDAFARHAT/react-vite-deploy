import React, { useState } from "react";
import { Button } from "../atoms/Buttons/Button";
import CustomSlider from "../Slider/CustomSlider";
import { Input } from "../atoms/input/input";
import DaysSelectionTabs from "../Slider/DaysSelectionTabs";

const cardsData = [
  {
    image: '/public/images/country/vitnam.jpg',
    Title: 'Paris',
    Raiting: 4.8,
    Description: "azertyuiopqsdfghjklmwxcvbn,"
  },
  {
    image: '/public/images/country/vitnam.jpg',
    Title: 'NewYork',
    Raiting: 4.8,
    Description: "azertyuiopqsdfghjklmwxcvbn,"
  },
  {
    image: '/public/images/country/vitnam.jpg',
    Title: 'Vietnam',
    Raiting: 750,
    Description: "azertyuiopqsdfghjklmwxcvbn,"
  },
  {
    image: '/public/images/country/vitnam.jpg',
    Title: 'Vietnam',
    Raiting: 750,
    Description: "azertyuiopqsdfghjklmwxcvbn,"
  },
];

const ProposeTabaaniModal = () => {
  const [hasRecommendations, setHasRecommendations] = useState(false);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="flex items-center justify-evenly">
        <h1 className="text-white font-semibold">Choose a city in Tabaani</h1>
        <Input className="w-100" disabled={!hasRecommendations} />
      </div>

      {hasRecommendations ? (
        <CustomSlider settings={settings}>
          {cardsData.map((card, index) => (
            <div key={index} className="p-4">
              {/* Render your card data here */}
            </div>
          ))}
        </CustomSlider>
      ) : (
        <div className="flex items-center justify-center h-full ">
          <p className="text-lg mt-5">No recommendations from <span className="font-bold text-xl">Tabaani</span>.</p>
        </div>
      )}

      <div className="flex justify-end mx-4">
        <Button
          type="button"
          text="danger"
          bg="default"
          size="lg"
          className="text-sm font-bold"
          disabled={!hasRecommendations}
        >
          Suggest Experience
        </Button>
      </div>
    </>
  );
};

export { ProposeTabaaniModal };
