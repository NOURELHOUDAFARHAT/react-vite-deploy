import { Link } from 'react-router-dom';

import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../../public/images/logo/logo-icon.svg';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { set } from 'date-fns';

import { getUserData } from '../../hooks/api';
import DropdownSearchResults from './DropdownSearchResults';


const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {

  const [userData, setUserData] = useState({ fullname: "", avatar: "" });


  useEffect(() => {
    // Get user ID from local storage
    const userId = localStorage.getItem('userId');

    if (userId) {
      getUserData(userId)
        .then(data => {
          setUserData(data);

        })
        .catch(error => {
          console.error('Error fetching full name:', error);
        });
    }
  }, []);


  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleInputChange = async (e) => {
    const query = e.target.value.trim(); // Trim whitespace from the input
  
    setSearchQuery(query);
  
    try {
      if (query) {
        const encodedQuery = encodeURIComponent(query);
        const response = await axios.get(`http://localhost:3001/search?query=${encodedQuery}`);
        setSearchResults(response.data);
  
        // Check if the search query matches any valid result
        if (response.data.length > 0) {
          setDropdownOpen(true);
        } else {
          setDropdownOpen(false);
        }
      } else {
        setDropdownOpen(false); // Close the dropdown if the query is empty
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">

        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-300'
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && 'delay-400 !w-full'
                    }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!w-full delay-500'
                    }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-[0]'
                    }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${!props.sidebarOpen && '!h-0 !delay-200'
                    }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}


          {/* <!-- LOGO --> 
          <Link className="block flex-shrink-0 lg:hidden" to="/Home">
            <img src={LogoIcon} alt="Logo" />
          </Link>*/}

        </div>


        <div className="flex flex-col lg:flex-row">
          <span className="hidden text-left lg:block">
            <span className="block text-title-xl2 font-bold  text-black dark:text-white">
              {userData.fullname ? `Hello ${userData.fullname.charAt(0).toUpperCase()}${userData.fullname.slice(1)}!` : 'Hello Guest!'}
            </span>
            <span className="block text-md">Welcome back and explore new trips</span>
          </span>

        </div>

        <div className="hidden sm:block">

          <div className="relative">
            <button className="absolute left-2 top-1/2 -translate-y-1/2" >
              <svg
                className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill=""
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Search trips or members..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-gray dark:bg-sidedark  pl-10 pr-4 py-3 px-3  focus:outline-none text-primary placeholder-primary xl:w-125"
            />
            {dropdownOpen && (
            <DropdownSearchResults searchResults={searchResults} />
          )}
          </div>

        
        </div>


        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">


            {/* <!-- Notification Menu Area --> */}
            <DropdownNotification />
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}

            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>

      </div>

    </header>
  );
};

export default Header;
