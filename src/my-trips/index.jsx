import { db } from "../services/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTripCard from "./components/UserTripCard";

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  //used to get all users trips

  const GetUserTrips = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/");
        return;
      }

      const q = query(
        collection(db, "AIGeneratedTrips"),
        where("userEmail", "==", user.email)
      );

      const querySnapshot = await getDocs(q);

      // Collect all trips first before setting state
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });

      setUserTrips(trips); // Single state update
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold font-serif text-3xl">My Trips</h2>
      <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {userTrips?.length > 0
          ? userTrips.map((trip) => <UserTripCard trip={trip} key={trip?.id} />)
          : [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={index}
                className="h-[220px] w-full bg-slate-200 animate-pulse rounded-xl"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default MyTrips;
