import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceImage } from "../../services/GlobalApi"; // adjust path as needed

function PlacesCard({ plan }) {
  const [imageUrl, setImageUrl] = useState("/place-1.jpg");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await GetPlaceImage(plan?.placeName);
        const url = res.data?.results?.[0]?.urls?.small;
        if (url) setImageUrl(url);
      } catch (error) {
        console.error("Image fetch failed:", error);
        setImageUrl("/place-11.jpg");
      }
    };

    if (plan?.placeName) fetchImage();
  }, [plan?.placeName]);

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${plan?.placeName}`}
      target="_blank"
    >
      <div className="shadow-md border rounded-xl p-3 mt-2 flex flex-wrap md:flex-nowrap gap-3 hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden">
        <img
          src={imageUrl}
          alt={plan?.placeName}
          className="w-full max-w-[140px] h-[100px] rounded-xl object-cover border border-red-600 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold font-serif text-lg sm:text-md md:text-base truncate">
            {plan?.placeName}
          </h2>
          <p className="text-sm sm:text-xs text-gray-500 break-words line-clamp-3">
            {plan?.placeDetails}
          </p>
          <h2 className="mt-2 font-serif text-sm">
            ⌛ {plan?.timeToTravel} Min
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default PlacesCard;
