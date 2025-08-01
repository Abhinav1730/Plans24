import { db } from "../../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import InformationPart from "../components/informationPart";
import Hotels from "../components/Hotels";
import Itenary from "../components/Itenary";
import Footer from "../components/Footer";

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  //Fetching Trip Info from Db
  const GetTripData = async () => {
    const docReference = doc(db, "AIGeneratedTrips", tripId);
    const docSnap = await getDoc(docReference);

    if (docSnap.exists()) {
      console.log("Document:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No Such Document");
      toast("No such Trip Found");
    }
  };
  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {/* Information Part */}
      <InformationPart trip={trip} />
      {/* Recommended Hotels */}
      <Hotels trip={trip} />
      {/* Itenary */}
      <Itenary trip={trip} />
      {/* Footer */}
      <Footer trip={trip} />
    </div>
  );
}

export default ViewTrip;
