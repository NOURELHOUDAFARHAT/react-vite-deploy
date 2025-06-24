import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Loader from "./common/Loader";
import PageTitle from "./components/Breadcrumbs/PageTitle";

import FormElements from "./pages/Form/FormElements";
import FormLayout from "./pages/Form/FormLayout";

import Settings from "./pages/Setting";

import Planning from "./pages/Planning";
import Trips from "./pages/Trips";

import React from "react";

import Home from "./pages/Home";
import Messages from "./pages/Messages";

import Setting from "./pages/Setting";
import SigninForm from "./pages/_auth/SigninForm";
import SignupForm from "./pages/_auth/SignupForm";
import TripItinerary from "./components/Trip/TripItinerary";
import UserProfile from "./pages/UserProfile";


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          path="/Home"
          element={
            <>
              <PageTitle title="Home " />
              <Home />
            </>
          }
        />
        <Route
          path="/"
          element={
            <>
              <PageTitle title="Sign In " />
              <SigninForm />
            </>
          }
        />
        <Route
          path="/sign-up"
          element={
            <>
              <PageTitle title="Sign Up " />
              <SignupForm />
            </>
          }
        />
        <Route
          path="/Trips"
          element={
            <>
              <PageTitle title="Trips " />
              <Trips />
            </>
          }
        />

<Route
          path="/Trips/tripItinerary/:tripId"
          element={
            <>
              <PageTitle title="Trip Itinerary" />
              <TripItinerary />
            </>
          }
        />

        <Route
          path="/Trips/planning/:tripId"
          element={
            <>
              <PageTitle title="Planning" />
              <Planning />
            </>
          }
        />

        <Route
          path="/Messages"
          element={
            <>
              <PageTitle title="Messages " />
              <Messages />
            </>
          }
        />

        <Route
          path="/UserProfile"
          element={
            <>
              <PageTitle title="User Profile " />
              <UserProfile />
            </>
          }
        />

        <Route
          path="/Setting"
          element={
            <>
              <PageTitle title="Setting " />
              <Setting />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
