import { useState } from 'react';
import axios from 'axios';
import { format, differenceInDays } from 'date-fns';


export const SignInUser = (email, password) => {
  return axios.post('http://localhost:3001/', {
    email,
    password,
  })
    .then((response) => {
      const { userId, token, fullName } = response.data;
      return { userId, token, fullName };
    })
    .catch((error) => {
      throw error;
    });
};


export const SignUpUser = (fullName, email, password,avatar) => {
  return axios.post('http://localhost:3001/sign-up', {
    fullName,
    email,
    password,
    avatar,
  })
    .then((response) => {
      return response.data; // Return the response data
    })
    .catch((error) => {
      throw error;
    });
};



export const getUserData = (userId) => {
  return axios.get(`http://localhost:3001/user/${userId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};


export const createTrip = (tripData) => {
  return axios.post("http://localhost:3001/trips", tripData)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};


export const createComment = (data) => {
  return fetch("http://localhost:3001/Comment", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    return data;
  })
  .catch(error => {
    throw error;
  });
};


export const fetchNotifCards = (setData) => {
  axios.get('http://localhost:3001/notifcard')
    .then(res => {
      setData(res.data);
    })
    .catch(err => console.log(err));
};

export const fetchComments = (setData) => {
  axios.get('http://localhost:3001/CommentsData')
    .then(res => {
      setData(res.data);
      console.log("data", res.data);
    })
    .catch(err => console.log(err));
};


export const fetchUsers = (setData) => {
  axios.get('http://localhost:3001/DropDownUsers')
    .then(res => {
      setData(res.data);
      console.log("data", res.data);
    })
    .catch(err => console.log(err));
};


export const fetchTripDays = (tripId) => {
  return axios.get(`http://localhost:3001/planning/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};


export const fetchPlacesByTripId = (tripId) => {
  return axios.get(`http://localhost:3001/placesforstays/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};


export const fetchCountryTripId = (tripId) => {
  return axios.get(`http://localhost:3001/country/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const fetchStayswithPlace = (placeId) => {
  return axios.get(`http://localhost:3001/StayswithPlace/${placeId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};


export const fetchPlacesDays = (tripId) => {
  return axios.get(`http://localhost:3001/placesDays/${tripId}`)
    .then(response => response.data.numDays)
    .catch(error => {
      throw error;
    });
};


export const fetchPlacesDaysItinerary = (tripId) => {
  return axios.get(`http://localhost:3001/placesDaysTrip/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};
export const fetchActivitiesDays = (tripId) => {
  return axios.get(`http://localhost:3001/activityday/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};



export const declineTripInvitation = (tripId, userId, setData, data) => {
  axios.put(`http://localhost:3001/generate/trips/${tripId}/remove-user/${userId}`)
    .then(response => {
      setData(data.filter(trip => trip._id !== tripId));
    })
    .catch(error => {
      console.error('Error updating trip data:', error);
    });
};

export const acceptTripInvitation = (tripId, userId, setData, data) => {
  axios.put(`http://localhost:3001/generate/trips/${tripId}/add-member/${userId}`)
    .then(response => {
      setData(data.filter(trip => trip._id !== tripId));
      console.log('Invitation accepted successfully');

      // Update userId field in activities associated with the trip
      axios.put(`http://localhost:3001/generate/trips/update-user/${tripId}/${userId}`)
        .then(response => {
          console.log('Activities updated successfully');
        })
        .catch(error => {
          console.error('Error updating activities:', error);
        });
    })
    .catch(error => {
      console.error('Error accepting invitation:', error);
    });
};




export const fetchPlacesData = (tripId) => {
  return axios.get(`http://localhost:3001/tripPlaces/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching places:', error); // Log the error for debugging
      throw error; // Rethrow the error to propagate it further if needed
    });
};

export const fetchUsersByTripId = (tripId, userId) => {
  return axios.get(`http://localhost:3001/members/${tripId}`)
    .then(response => {
      const { members, plannerName } = response.data;

      // Check if user is the planner
      if (plannerName?._id === userId) {
        return { members };
      } else {
        // Filter out the user from the members list
        const filteredMembers = members.filter(member => member._id !== userId);
        return { members: filteredMembers, plannerName };
      }
    })
    .catch(error => {
      throw error;
    });
};

export const deletePlace = (placeId) => {
  return axios.delete(`http://localhost:3001/deleteplace/${placeId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const deleteStay = (activityId) => {
  return axios.delete(`http://localhost:3001/deletestay/${activityId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const fetchPlannerByTripId = (tripId) => {
  return axios.get(`http://localhost:3001/plannerTrip/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};


export const fetchPriceByUserAndTrip = (userId, tripId) => {
  return axios.get(`http://localhost:3001/pricebyuser/${userId}/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const fetchMembersByTripId = (tripId) => {
  return axios.get(`http://localhost:3001/allmembers/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const fetchMembersOfPlacesTripId = (tripId) => {
  return axios.get(`http://localhost:3001/numberofplaces/${tripId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};


export const fetchMembersOfActivitiesbyIds = (tripId, userId) => {
  return axios.get(`http://localhost:3001/numberofactivities/${tripId}/${userId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const fetchPriceActivityByTripId = (tripId, activityId) => {
  return axios.get(`http://localhost:3001/userbytripid/${tripId}/${activityId}`)
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};