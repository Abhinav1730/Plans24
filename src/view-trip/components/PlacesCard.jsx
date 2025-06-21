import { Button } from "../../components/ui/button";
import React from "react";
import { CiLocationOn } from "react-icons/ci";
import { Link } from "react-router-dom";

function PlacesCard({ plan }) {
  return (
    <Link
      to={"https://www.google.com/maps/search/?api=1&query=" + plan?.placeName}
      target="_blank"
    >
      <div className="shadow-md border rounded-xl p-3 mt-2 flex gap-3 hover:scale-105 transition-all cursor-pointer">
        <img
          src="/place-1.jpg"
          alt=""
          className="w-[140px] h-[140px] rounded-xl"
        />
        <div>
          <h2 className="font-bold font-serif text-lg md:text-xs">
            {plan?.placeName}
          </h2>
          <p className="text-sm text-gray-500 md:text-xs">
            {plan?.placeDetails}
          </p>
          <h2 className="mt-2 font-serif">⌛ {plan?.timeToTravel}</h2>
          {/* <Button size="sm" className="mt-2 bg-white border border-red-600"><CiLocationOn className='text-red-600'/></Button> */}
        </div>
      </div>
    </Link>
  );
}

export default PlacesCard;
