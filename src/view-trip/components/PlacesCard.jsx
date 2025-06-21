import React from "react";
import { Link } from "react-router-dom";

function PlacesCard({ plan }) {
  return (
    <Link
      to={"https://www.google.com/maps/search/?api=1&query=" + plan?.placeName}
      target="_blank"
    >
      <div className="shadow-md border rounded-xl p-3 mt-2 flex flex-wrap md:flex-nowrap gap-3 hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden">
        <img
          src="/place-1.jpg"
          alt=""
          className="w-full max-w-[140px] h-auto rounded-xl object-cover border border-red-600 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-bold font-serif text-lg sm:text-md md:text-base truncate">
            {plan?.placeName}
          </h2>
          <p className="text-sm sm:text-xs text-gray-500 break-words line-clamp-3">
            {plan?.placeDetails}
          </p>
          <h2 className="mt-2 font-serif text-sm">⌛ {plan?.timeToTravel}</h2>
        </div>
      </div>
    </Link>
  );
}

export default PlacesCard;
