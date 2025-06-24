import React, { useEffect, useState } from "react";
import { TripCard } from "../Cards/TripCard";

import {
  fetchNotifCards,
  fetchPlacesData,
  fetchUsersByTripId,
  fetchStayswithPlace,
  deletePlace,
  deleteStay,
  fetchPlannerByTripId,
  fetchPriceByUserAndTrip,
  fetchMembersOfPlacesTripId,
  fetchMembersOfActivitiesbyIds,
  fetchPriceActivityByTripId,
} from "../../hooks/api";

import DefaultLayout from "../Breadcrumbs/layout/DefaultLayout";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { Link, useParams } from "react-router-dom";
import { useModal, useModalStays, useUserModal } from "../../hooks/useModal";
import { Button } from "../atoms/Buttons/Button";
import OrderTrackingCard from "../Cards/OrderTrackingCard";
import { ProposePlace } from "../Modals/ProposePlace";
import { ProposeStays } from "../Modals/ProposeStays";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/style.css";
import { NewUserModal } from "../Modals/NewUserModal";
import axios from "axios";

interface TripContentProps {}
interface Stay {
  title: string;
  numDay: number;
  _id: string;
  type: string;
  price: number;
}

interface OrderStatus {
  title: string;
  numDay: string;
  stays: Stay[]; // Specific stay information for the place
  image: string;
  _id: string;
}

interface Member {
  _id: string;
  avatar: string;
  fullName: string;
  email: string;
}

const TripItinerary: React.FC<TripContentProps> = () => {
  // Get user ID from local storage
  const userIdP = localStorage.getItem("userId");

  const { tripId } = useParams();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifCards(setData);
  }, [tripId]);

  const isAuthorized = (trip) => {
    return trip._id == tripId;
  };

  useEffect(() => {
    if (tripId) {
      fetchPlacesData(tripId)
        .then(({ placeIds, places }) => {
          Promise.all(
            placeIds.map((placeId) => {
              return fetchStayswithPlace(placeId);
            })
          )
            .then((staysArray) => {
              const orderStatusArray: OrderStatus[] = placeIds.map(
                (placeId, index) => {
                  const place = places.find((p) => p._id === placeId);
                  if (place) {
                    return {
                      title: place.title,
                      numDay: place.numDay,
                      stays: staysArray[index], // Array of stays for the place
                      image: place.image,
                      _id: place._id,
                    };
                  }
                  return null;
                }
              );
              setOrderStatus(orderStatusArray);
            })
            .catch((error) => {
              console.error("Error fetching stays:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching places data:", error);
        });
    }
  }, [tripId]);

  const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([]);
  const handleStatusChange = (status: OrderStatus, index: number) => {
    const updatedStatus = [...orderStatus];
    updatedStatus[index] = status;
    setOrderStatus(updatedStatus);
  };

  const renderToastMessage = (message: string, type: "success" | "error") => {
    toast(message, { type });
  };

  const handleDeleteStay = (
    statusIndex: number,
    stayId: string,
    placeId: string
  ) => {
    // Fetch stays with placeId to get the correct stays
    fetchStayswithPlace(placeId)
      .then((stays) => {
        console.log("stays", stays);
        const stay = stays.find((s) => s._id === stayId);
        console.log("staysType", stay.type);
        if (stay.type === "stays") {
          // Delete the stay from the 'places' collection (assuming stays are places in your schema)
          deleteStay(stayId)
            .then((response) => {
              console.log("Stay deleted successfully:", response);
              const updatedStatus = [...orderStatus];
              updatedStatus[statusIndex].stays = updatedStatus[
                statusIndex
              ].stays.filter((s) => s._id !== stayId);
              setOrderStatus(updatedStatus);
              // Display success message

              renderToastMessage("Stay deleted successfully", "success");

              // Reload the page after 1.5 seconds
            })
            .catch((error) => {
              console.error("Error deleting stay:", error);
              renderToastMessage("Error deleting stay", "error");
            });
        } else {
          console.error("Stay not found with ID or incorrect type:", stayId);
        }
      })
      .catch((error) => {
        console.error("Error fetching stays with place ID:", error);
      });
  };

  // Function to handle deleting a status
  const handleDeleteStatus = (statusId: string, statusIndex: number) => {
    fetchPlacesData(tripId)
      .then(({ places }) => {
        const place = places.find((p) => p._id === statusId);
        if (place) {
          deletePlace(place._id)
            .then((response) => {
              console.log("Status deleted successfully:", response);
              const updatedStatus = [...orderStatus];
              updatedStatus.splice(statusIndex, 1);
              setOrderStatus(updatedStatus);
              renderToastMessage("Place deleted successfully", "success");
              // Reload the page after 1.5 seconds
            })
            .catch((error) => {
              console.error("Error deleting status:", error);
              renderToastMessage("Error deleting Place", "error");
            });
        } else {
          console.error("Status not found with ID:", statusId);
        }
      })
      .catch((error) => {
        console.error("Error fetching places data:", error);
      });
  };

  const [placesAvailable, setPlacesAvailable] = useState(false);
  useEffect(() => {
    if (tripId) {
      fetchPlacesData(tripId)
        .then(({ placeIds }) => {
          if (placeIds.length > 0) {
            setPlacesAvailable(true);
          } else {
            setPlacesAvailable(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching places data:", error);
        });
    }
  }, [tripId]);

  const { isOpen, openModal, closeModal } = useModal(false);
  const { isOpenStays, openModalStays, closeModalStays } = useModalStays(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [plannerName, setPlannerName] = useState<string>("");

  useEffect(() => {
    if (tripId) {
      fetchPlannerByTripId(tripId)
        .then((plannerData) => {
          console.log(plannerData);
          // Assuming plannerData contains the planner's name
          setPlannerName(plannerData.plannerName);
        })
        .catch((error) => {
          console.error("Error fetching planner data:", error);
          // Handle error if needed
        });
    }
  }, [tripId]);

  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const toggleDeleteButtons = () => {
    if (plannerName === userIdP) {
      setShowDeleteButtons(!showDeleteButtons);
    }
  };

  const [planner, setPlanner] = useState(null);
  useEffect(() => {
    if (!userIdP) {
      console.error("User ID not found in local storage");
      return;
    }

    fetchUsersByTripId(tripId, userIdP)
      .then(({ members, plannerName }) => {
        setMembers(members);
        console.log("members", members);
        setPlanner(plannerName); // Assuming you have a state for plannerName
        console.log("planner", plannerName);
      })

      .catch((error) => {
        console.error("Error fetching members data:", error);
      });
  }, [tripId, userIdP]);

  const [userActivities, setUserActivities] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  

  useEffect(() => {
    if (userIdP && tripId) {
      // Fetch activities based on userId and tripId
      fetchPriceByUserAndTrip(userIdP, tripId)
        .then((activities) => {
          console.log("userId", userIdP);
          console.log("tripId", tripId);
          console.log("activityId", activities._id);
          //setUserActivities(activities);
          let totalAmount = 0;
          activities.forEach((activity) => {
            fetchPriceActivityByTripId(tripId, activity._id)
              .then((activityData) => {
                const pricePerUser =
                  activityData.price / activityData.userId.length;
                console.log(
                  `Activity ID: ${activity._id}, Price per user: ${pricePerUser}`
                );

                totalAmount += pricePerUser; // Add activity price to totalAmount
                setTotalPrice(totalAmount);
                console.log("price", totalAmount);
              })
              .catch((error) => {
                console.error("Error fetching price:", error);
              });
          });
        })
        .catch((error) => {
          console.error("Error fetching user activities:", error);
        });
    }
  }, [userIdP, tripId]);

  const [placesCount, setPlacesCount] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { count } = await fetchMembersOfPlacesTripId(tripId);
        setPlacesCount(count);
      } catch (error) {
        console.error("Error fetching places count:", error);
      }
    };

    fetchData();
  }, [tripId]);

  const [staysCount, setStaysCount] = useState(null);
  const [experiencesCount, setExperiencesCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { staysCount, experiencesCount } =
          await fetchMembersOfActivitiesbyIds(tripId, userIdP);
        setStaysCount(staysCount);
        setExperiencesCount(experiencesCount);
      } catch (error) {
        console.error("Error fetching activity counts:", error);
      }
    };

    fetchData();
  }, [tripId, userIdP]);

  const { isUserOpen, openUserModal, closeUserModal } = useUserModal(false);

  const handleUserSubmit = (selectedUserIds) => {
    axios
      .post(`http://localhost:3001/trips/${tripId}/invite`, {
        userId: selectedUserIds,
      })
      .then((response) => {
       
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.error("Error invite activity:", error);
        
      });
  };

  return (
    <>
      <DefaultLayout>
        {data.filter(isAuthorized).map((trip) => (
          <Breadcrumb title="" pageName="Trip Itinerary" />
        ))}

        <ToastContainer />
        <div className="grid gap-4">
          <div className="grid grid-cols-12 gap-4">
            {data.filter(isAuthorized).map((trip) => (
              <div
                className="col-span-12 xl:col-span-7  rounded-lg "
                key={trip._id}
              >
                <TripCard
                  Image={trip.cover}
                  Title={trip.title}
                  Description={trip.description}
                  TripId={trip._id}
                  Country={trip.country}
                  StartDate={trip.startDate}
                  EndDate={trip.endDate}
                  countryFrom={trip.countryFrom}
                  showButton={false} // Pass showButton prop to hide the button
                />
              </div>
            ))}

            <div className="col-span-12 xl:col-span-5 bg-white dark:bg-strokedark p-4  rounded-lg">
              <h3 className="font-bold text-title-md text-strokedark dark:text-white">
                Where are you going?
              </h3>
              <div className="flex flex-col ">
                <ProposePlace
                  isOpen={isOpen}
                  onClose={closeModal}
                  tripId={tripId}
                />
                <ProposeStays
                  isOpen={isOpenStays}
                  onClose={closeModalStays}
                  tripId={tripId}
                />
                <div className="grid grid-row items-start leading-normal text-left">
                  <label className="font-bold">Cities</label>
                  <span>Find the perfect city to visit.</span>
                  <Button bg="black" onClick={() => openModal()} type="button">
                    <span>
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                        stroke="#ffffff"
                        width="20"
                        height="20"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <title></title>{" "}
                          <g id="Complete">
                            {" "}
                            <g data-name="add" id="add-2">
                              {" "}
                              <g>
                                {" "}
                                <line
                                  fill="none"
                                  stroke="#ffffff"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  x1="12"
                                  x2="12"
                                  y1="19"
                                  y2="5"
                                ></line>{" "}
                                <line
                                  fill="none"
                                  stroke="#ffffff"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  x1="5"
                                  x2="19"
                                  y1="12"
                                  y2="12"
                                ></line>{" "}
                              </g>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </span>
                    Add City
                  </Button>
                </div>

                <div
                  className="grid grid-row items-start leading-normal text-left"
                  style={{ display: placesAvailable ? "" : "none" }}
                >
                  <label className="font-bold">Stays</label>
                  <span>Find the perfect place to stay.</span>
                  <Button
                    bg="black"
                    onClick={() => openModalStays()}
                    type="button"
                  >
                    <span>
                      <svg
                     
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                        stroke="#ffffff"
                        width="20"
                        height="20"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <title></title>{" "}
                          <g id="Complete">
                            {" "}
                            <g data-name="add" id="add-2">
                              {" "}
                              <g>
                                {" "}
                                <line
                                  fill="none"
                                  stroke="#ffffff"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  x1="12"
                                  x2="12"
                                  y1="19"
                                  y2="5"
                                ></line>{" "}
                                <line
                                  fill="none"
                                  stroke="#ffffff"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  x1="5"
                                  x2="19"
                                  y1="12"
                                  y2="12"
                                ></line>{" "}
                              </g>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </span>
                    Add Stay
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 grid-flow">
            <div className="col-span-12 xl:col-span-5 rounded-lg bg-white dark:bg-strokedark p-4 ">
              <div className="flex justify-between ">
                <h3 className="font-bold text-title-md text-black dark:text-white">
                  Trip Itinerary
                </h3>
                <Button
                  size="small"
                  onClick={toggleDeleteButtons}
                  style={{ display: plannerName === userIdP ? "flex" : "none" }}
                >
                  <span>
                    <svg
                      className="w-6 h-6  text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                </Button>
              </div>
              <div>
                <OrderTrackingCard
                  orderStatus={orderStatus}
                  onStatusChange={handleStatusChange}
                  tripId={tripId}
                  showDeleteButtons={showDeleteButtons}
                  onDeleteStay={handleDeleteStay}
                  onDeleteStatus={handleDeleteStatus}
                />
              </div>
              <div>
                <Button   className="mt-1 py-3" size="md" bg="black">
                  <Link to={`/Trips/Planning/${tripId}`}>Start Planning</Link>
                </Button>
              </div>
            </div>




            <div className="col-span-12 xl:col-span-4 rounded-lg bg-white dark:bg-strokedark p-4  ">


              <h3 className="font-bold text-title-md text-black dark:text-white">
                Trip Members
              </h3>
              <div className="col-span-12 flex flex-col  dark:border-boxdark dark:bg-strokedark xl:col-span-4 h-90">
                <div className="overflow-y-auto" style={{ maxHeight: "80rem", flex: "1" }}>
                  {members.map((user) => (
                    <Link
                      to="#"
                      className="flex items-center rounded-xl mt-4 bg-gray dark:bg-boxdark  gap-1.5 py-5 px-7.5"
                      key={user._id}
                    >
                      <img
                        src={user.avatar}
                        alt="Trip"
                        className="relative shadow-5 h-14 w-14 rounded-full"
                      />
                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <h5 className="font-bold text-black dark:text-white">
                            {user.fullName ? `${user.fullName.charAt(0).toUpperCase()}${user.fullName.slice(1)}` : ''}
                          </h5>
                          <p>
                            <span className="text-xs">. {user.email}</span>
                          </p>
                        </div>

                      </div>
                    </Link>
                  ))}

                  {/* Display planner details if available */}
                  {planner && (
                    <Link
                      to="#"
                      className="flex items-center rounded-xl mt-4 bg-white dark:bg-boxdark  gap-1.5 py-5 px-7.5"
                      key={planner._id}
                    >
                      <img
                        src={planner.avatar}
                        alt="Trip"
                        className="relative h-14 w-14 rounded-full"
                      />

                      <div className="flex flex-1 items-center justify-between">
                        <div>
                          <h5 className="font-medium text-black dark:text-white">
                            {planner.fullName}{" "}
                            <span className="text-primary">*Planner</span>
                          </h5>
                          <p>
                            <span className="text-xs">. {planner.email}</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                  <NewUserModal
                    onUserClose={closeUserModal}
                    isUserOpen={isUserOpen}
                    onSubmit={handleUserSubmit}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    className="mt-2 "
                    size="md"
                    bg="black"
                    type="button"
                    onClick={openUserModal}
                  >
                    <span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 
                            2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 
                            16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59
                             11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 
                             12C16.75 12.41 16.41 12.75 16 12.75Z"
                            fill="#ffffff"
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </Button>

                </div>
              </div>
            </div>



            <div className="col-span-12 xl:col-span-3 rounded-lg bg-white dark:bg-strokedark p-4">

              <h3 className="font-bold text-title-md text-black dark:text-white">
                Split The Bill
              </h3>

              <div className="flex flex-col items-center aspect-auto p-4 sm:p-8 border rounded-3xl bg-gray dark:bg-boxdark  border-primary shadow-gray-600/10 shadow-none m-2 flex-1 max-w-md">
                <h2 className="text-lg sm:text-xl font-bold text-primary mb-2">
                  Trip Name
                </h2>
                <p className="text-lg sm:text-xl text-center mb-8 mt-4 text-gray-400">
                  <span className="text-3xl sm:text-4xl font-bold text-strokedark dark:text-white">
                    ${totalPrice.toFixed(1)}
                  </span>{" "}
                  /Amount
                </p>
                <ul className="list-none list-inside mb-6 text-center text-gray-300">
                  <li>{placesCount} Cities</li>
                  <li>{staysCount} Stays</li>
                  <li>{experiencesCount} Experience</li>
                </ul>

                <a
                  className=" relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                  href="#"
                >
                  <span className="relative text-md font-semibold text-white">
                    Pay Your Part
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default TripItinerary;
