import React, { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { fetchUsers } from "../../../hooks/api";

const DropDownUsers = ({ onSelect }) => {
  const [data, setData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchUsers((fetchedData) => {
      setData(fetchedData);
      setFilteredUsers(fetchedData);
    });
  }, []);

  const handleUserChange = (value) => {
    setQuery(value);
    const userId = localStorage.getItem("userId");
    const filtered = data.filter(
      (user) =>
        user._id != userId &&
        user.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (user) => {
    setQuery(user.fullName);
    onSelect(user);
  };

  return (
    <div className="w-80 ">
      <Combobox value={query} onChange={handleUserChange}>
        <div className="">
          <Combobox.Input
            className="rounded-lg border-[1px] mb-3 bg-white w-full py-2 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-sidedark dark:text-white dark:focus:border-primary"
            placeholder="Search for a user"
            onChange={(event) => handleUserChange(event.target.value)}
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
            {filteredUsers.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No users found.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Combobox.Option
                  key={user._id}
                  className={({ active }) =>
                    `relative cursor-default select-none rounded-md py-2 pl-2 pr-4 ${
                      active ? "bg-primary text-white" : "text-gray-900"
                    }`
                  }
                  value={user.fullName}
                  onClick={() => handleUserSelect(user)} 
                >
                  {({ selected, active }) => (
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {user.fullName}
                    </span>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
};

export { DropDownUsers };
