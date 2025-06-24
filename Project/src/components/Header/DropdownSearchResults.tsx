import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DropdownSearchResults = ({ searchResults }) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdown = useRef<any>(null);

    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
          if (!dropdown.current) return;
          if (
            !dropdownOpen ||
            dropdown.current.contains(target)
          )
            return;
          setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
      });
    
      // close if the esc key is pressed
      useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
          if (!dropdownOpen || keyCode !== 27) return;
          setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
      });
    
  return (
<div className='relative'>
    <div  ref={dropdown}
    onFocus={() => setDropdownOpen(true)}
    onBlur={() => setDropdownOpen(false)}
     className={`absolute w-full  mt-2.5 flex flex-col rounded-xl border border-stroke bg-white shadow-default dark:border-sidedark dark:bg-sidedark overflow-y-auto max-h-85
     ${
        dropdownOpen === true ? 'block' : ''
      }`}
      >
      
      <ul className="flex h-auto flex-col px-4  ">
        {searchResults.map((trip) => (
            <Link to={`/Trips/tripItinerary/${trip._id}`}>
          <li key={trip._id} className=" flex items-center p-2  border-b border-gray dark:border-strokedark">
            {/* Display your search result items here */}
            <img
                    src={trip.cover}
                    alt="Trip"
                    className="relative h-14 w-14 rounded-full"
                  />
                  <div className="flex flex-col items-start justify-between ml-4">
                    <div className='text-md font-semibold'>{trip.title ? ` ${trip.title.charAt(0).toUpperCase()}${trip.title.slice(1)}` : ''}</div>
                    <div className='text-sm'> from {trip.startDate } to {trip.endDate} 
                    </div>
                    <div className='text-sm'>{trip.country}</div>
                  </div>
          </li>
          </Link>
        ))}
      </ul>
 
    </div>
    </div>
  );
};

export default DropdownSearchResults;
