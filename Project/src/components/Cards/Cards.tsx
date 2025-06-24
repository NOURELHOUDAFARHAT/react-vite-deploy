import React from 'react';
import Slider, { CustomArrowProps } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

import DefaultLayout from '../Breadcrumbs/layout/DefaultLayout';
import { Button } from '../../components/atoms/Buttons/Button';
import { CardList } from '../../components/Cards/Card';


// Define an array of card data
const cardsData = [
  {
    image: '/images/country/vietnam.jpg',
    CardDescription: 'Nha Trang has many famous tourist attractions ...',
    CardTitle: 'Vietnam',
    titleHref: '/card1',
    price: 999,
    discount: 750,
    rating: 4.5
  },
  {
    image: '/images/country/Paris.jpg',
    CardDescription: 'a big tourist center of the country...',
    CardTitle: 'France',
    titleHref: '/card2',
    price: 870,
    discount: 720,
    rating: 4.8
  },
  {
    image: '/images/country/london.jpg',
    CardDescription: 'Nhaattractions and is center of the country...',
    CardTitle: 'London',
    titleHref: '/card1',
    price: 1200,
    discount: 999,
    rating: 4.2
  },
  {
    image: '/images/country/NewYork.jpg',
    CardDescription: 'Nha Trang has many famous tourist a of the country...',
    CardTitle: 'New York',
    titleHref: '/card2',
    price: 1350,
    discount: 1050,
    rating: 3.9
  },
  // Add more card data as needed
];

const CustomPrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <div className='top-0 flex items-center' >
  <Button onClick={onClick} type="button"  bg="transparent" size="small" >
    <span>
    <svg className="fill-black dark:fill-white" fill="none" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330" stroke="#ffffff" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_2_"> <path id="XMLID_4_" d="M145.606,74.393c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l69.393,69.392 l-69.393,69.395c-5.858,5.858-5.858,15.355,0,21.213C127.322,258.536,131.161,260,135,260s7.678-1.464,10.606-4.394l80-80.002 c2.814-2.813,4.394-6.628,4.394-10.607c0-3.979-1.58-7.794-4.394-10.607L145.606,74.393z"></path> <path id="XMLID_5_" d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.981,0,165,0z M165,300 c-74.439,0-135-60.561-135-135S90.561,30,165,30s135,60.561,135,135S239.439,300,165,300z"></path> </g> </g></svg>
    </span>
  </Button>
  </div>

);


const CustomNextArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <div className='absolute top-0 right-1 flex items-center'>
  <Button onClick={onClick} type="button"  bg="transparent" size="small" >
    <span >
    <svg  className="fill-black dark:fill-white" fill="none" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_2_"> <path id="XMLID_4_" d="M145.606,74.393c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l69.393,69.392 l-69.393,69.395c-5.858,5.858-5.858,15.355,0,21.213C127.322,258.536,131.161,260,135,260s7.678-1.464,10.606-4.394l80-80.002 c2.814-2.813,4.394-6.628,4.394-10.607c0-3.979-1.58-7.794-4.394-10.607L145.606,74.393z"></path> <path id="XMLID_5_" d="M165,0C74.019,0,0,74.019,0,165s74.019,165,165,165s165-74.019,165-165S255.981,0,165,0z M165,300 c-74.439,0-135-60.561-135-135S90.561,30,165,30s135,60.561,135,135S239.439,300,165,300z"></path> </g> </g></svg>
    </span>
  </Button>
  </div>
);

const Cards = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Number of cards to show at once
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ],
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  return (
 
      <Slider {...settings}>
        {cardsData.map((card, index) => (
          <div key={index} className=" flex flex-col mt-2">
            <CardList cards={[card]} />
          </div>
        ))}
      </Slider>
 
  );
};

export default Cards;
