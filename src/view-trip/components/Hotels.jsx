import React from "react";
import { Link } from "react-router-dom";

function Hotels({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-2xl mt-5 font-serif flex items-start">
        Hotel Recommendations
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
        {trip?.tripData?.travelPlan?.hotelsOptions?.map((hotel, index) => (
          <Link
            to={
              "https://www.google.com/maps/search/?api=1&query=" +
              hotel?.hotelName +
              "," +
              hotel?.hotelAddress
            }
            target="_blank"
          >
            <div
              className="hover:scale-105 transition-all cursor-pointer"
              key={index}
            >
              <img
                src="/place-1.jpg"
                className="rounded-lg border border-red-600"
                alt=""
              />
              <div className="my-2 mt-5 flex flex-col gap-2">
                <h2 className=" font-medium font-serif">{hotel?.hotelName}</h2>
                <h2 className=" text-gray-600 font-serif text-xs">
                  📍 {hotel?.hotelAddress}
                </h2>
                <h2 className=" font-serif text-sm">{hotel?.priceRange}</h2>
                <h2 className="font-serif text-sm">🌟 {hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
