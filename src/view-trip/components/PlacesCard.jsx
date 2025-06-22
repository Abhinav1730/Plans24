import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceImage } from "../../services/GlobalApi";

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
      rel="noopener noreferrer"
    >
      <div className="shadow-md border rounded-xl p-3 mt-2 flex flex-col md:flex-row gap-4 hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden">
        {/* Image section */}
        <img
          src={imageUrl}
          alt={plan?.placeName}
          className="w-full md:w-[140px] h-[180px] md:h-[100px] rounded-xl object-cover border border-red-600"
        />

        {/* Details section */}
        <div className="flex flex-col justify-between">
          <h2 className="font-serif font-bold text-lg sm:text-base truncate">
            {plan?.placeName}
          </h2>
          <p className="font-poppins text-sm sm:text-xs text-gray-500 mt-1 line-clamp-3">
            {plan?.placeDetails}
          </p>
          <h2 className="font-serif text-sm mt-2">
            ⌛ {plan?.timeToTravel} Min
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default PlacesCard;
