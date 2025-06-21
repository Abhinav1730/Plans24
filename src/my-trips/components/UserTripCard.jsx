import React, { useEffect, useState } from "react";
import { GetPlaceImage } from "../../services/GlobalApi"; // Update path if needed
import { Link } from "react-router-dom";

function UserTripCard({ trip }) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const locationName = trip?.userSelection?.location?.name;
        if (!locationName) return;

        const res = await GetPlaceImage(locationName);
        const url = res.data.results[0]?.urls?.regular;
        setImageUrl(url || "/place-1.jpg"); // fallback image
      } catch (error) {
        console.error("Image fetch failed:", error);
        setImageUrl("/place-1.jpg"); // fallback image
      }
    };

    fetchImage();
  }, [trip]);

  return (
    <Link to={"/view-trip/" + trip?.id}>
      <div className="border rounded-xl overflow-hidden shadow-md">
        <img
          src={imageUrl}
          alt={trip?.userSelection?.location?.name}
          className="object-cover w-full h-[220px]"
        />
        <div className="p-4">
          <h2 className="font-bold font-serif text-lg">
            {trip?.userSelection?.location?.name}
          </h2>
          <h2 className="text-sm font-serif text-gray-500">
            {trip?.userSelection?.days} Day Trip with{" "}
            {trip?.userSelection?.budget?.title} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCard;
