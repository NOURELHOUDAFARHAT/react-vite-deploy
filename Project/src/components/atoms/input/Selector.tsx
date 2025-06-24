import React, { Fragment, useState, useMemo, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface ICountry {
  id?: number;
  name: string;
}

interface SelectorProps {
  data: ICountry[];
  selected: ICountry | null;
  setSelected: React.Dispatch<React.SetStateAction<ICountry | null>>;
  value: string;
  onChange: (value: string) => void;
}

const Selector: React.FC<SelectorProps> = ({ data, selected, setSelected, value, onChange }) => {
  const [query, setQuery] = useState<string>("");

  // Debounce search input
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // Update debouncedQuery after 300ms of inactivity
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  // Memoize filteredCountries
  const filteredCountries = useMemo(() => {
    if (!debouncedQuery) return data;
    return data.filter((country) =>
      country.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [data, debouncedQuery]);

  return (
    <div className="w-full">
      <Combobox
        value={value}
        onChange={(value) => {
          onChange(value);
          setSelected(data.find((country) => country.name === value) || null);
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-sidedark text-left shadow-md sm:text-sm">
            <Combobox.Input
              className="w-full outline-none border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:bg-sidedark focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Select Country"
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
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto z-50 rounded-md bg-white dark:bg-sidedark py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredCountries.length === 0 && debouncedQuery !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredCountries.slice(0, 10).map((country) => (
                  <Combobox.Option
                    key={country.id}
                    className={({ active }) =>
                      `relative cursor-default select-none rounded-md py-2 pl-10 pr-4 ${
                        active ? "bg-primary text-white" : "text-gray-900"
                      }`
                    }
                    value={country.name}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {country.name}
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

export default Selector;
