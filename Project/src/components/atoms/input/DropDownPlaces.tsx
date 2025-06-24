import React, { Fragment, useEffect, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { fetchPlacesByTripId } from '../../../hooks/api';
import { useParams } from 'react-router-dom';
interface Place {
  _id: string;
  title: string;
}

interface DropDownPlacesProps {
  onPlaceSelect: (place: Place) => void; // Update the onPlaceSelect function to accept a Place object
}

const DropDownPlaces: React.FC<DropDownPlacesProps> = ({ onPlaceSelect }) => {
  const [data, setData] = useState<Place[]>([]);
  const [query, setQuery] = useState('');

  const { tripId } = useParams();

  useEffect(() => {
    fetchPlacesByTripId(tripId)
      .then(fetchedData => {
        setData(fetchedData); // Update state with fetched data directly
      })
      .catch(error => {
        console.error('Error fetching places:', error);
      });
  }, [tripId]);

  const handlePlaceChange = (value: string) => {
    setQuery(value);
  };

  const handlePlaceSelect = (place: Place) => {
    setQuery(place.title);
    onPlaceSelect(place); // Pass the selected place object to the parent component
  };

  return (
    <div className="w-full">
      <Combobox value={query} onChange={handlePlaceChange}>
        <div className="">
          <Combobox.Input
            className="rounded-lg border-[1px] dark:border-sidedark bg-white w-full py-3 px-2  text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-sidedark dark:text-white dark:focus:border-primary"
            placeholder="Search for a place"
            onChange={(event) => handlePlaceChange(event.target.value)}
          />
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="max-h-60 w-full overflow-auto z-50 rounded-md bg-white dark:bg-sidedark py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
             {data.map((place) => (
              <Combobox.Option
                key={place._id}
                className={({ active }) =>
                  `relative cursor-default select-none rounded-md py-2 pl-2 pr-4 ${
                    active ? "bg-primary text-white" : "text-gray-900"
                  }`
                }
                value={place.title}
                onClick={() => handlePlaceSelect(place)}
              >
                {({ selected, active }) => (
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {place.title}
                  </span>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
};

export default DropDownPlaces;
