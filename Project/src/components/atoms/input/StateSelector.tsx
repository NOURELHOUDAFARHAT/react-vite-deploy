import React, { Fragment, useState, useMemo, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { State, Country } from "country-state-city"; // Import State and Country
import { fetchCountryTripId } from "../../../hooks/api";

interface IState {
  id?: number;
  name: string;
}

interface StateSelectorProps {
  tripId: String; // Add tripId prop
  value: string;
  onChange: (value: string) => void;
}

const StateSelector: React.FC<StateSelectorProps> = ({ tripId, value, onChange }) => {
  const [states, setStates] = useState<IState[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    if (tripId) {
      fetchCountryTripId(tripId)
        .then((countryData) => {
          const countries = Country.getAllCountries();

          // Find the country with the matching name
          const country = countries.find((c) => c.name === countryData.country);
          console.log("country", country);
          if (country) {
            const countryCode = country.isoCode;

            // Get the states of the country using its ISO code
            const statesOfCountry = State.getStatesOfCountry(countryCode);
            setStates(statesOfCountry);
          } else {
            console.error("Country not found");
        
          }
        })
        .catch((error) => {
          console.error("Error fetching country:", error);
          // Handle the error
        });
    }
  }, [tripId]);

  // Memoize filteredStates
  const filteredStates = useMemo(() => {
    if (!query) return states;
    return states.filter((state) =>
      state.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, states]);

  return (
    <div className="w-full">
      <Combobox
        value={value}
        onChange={(value) => onChange(value)}
      >
        <div className="relative ">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-sidedark text-left shadow-md sm:text-sm">
             <Combobox.Input
              className="w-full custom-input rounded-lg border-[1px] dark:border-sidedark  bg-white py-4 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter  dark:bg-sidedark dark:text-white dark:focus:border-primary"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Select State"
              required
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400 hover:text-gray-500"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto z-50 rounded-md bg-white dark:bg-sidedark py-1    sm:text-sm">
              {filteredStates.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-white">
                  No states found.
                </div>
              ) : (
                filteredStates.map((state) => (
                  <Combobox.Option
                    key={state.id}
                    className={({ active }) =>
                      `relative cursor-default select-none rounded-md py-2 pl-10 pr-4 ${
                        active ? "bg-primary text-white" : "text-gray-900"
                      }`
                    }
                    value={state.name}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {state.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-primary"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default StateSelector;
