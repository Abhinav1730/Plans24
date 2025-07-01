import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceImage } from "../../services/GlobalApi";

function PlacesCard({ plan, weather }) {
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
      <div className="shadow-md border rounded-xl p-3 mt-2 flex flex-col md:flex-row gap-4 hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden bg-white">
        {/* Image section */}
        <img
          src={imageUrl}
          alt={plan?.placeName}
          className="w-full md:w-[140px] h-[180px] md:h-[100px] rounded-xl object-cover border border-red-600"
        />

        {/* Details section */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <h2 className="font-serif font-bold text-lg sm:text-base truncate">
            {plan?.placeName}
          </h2>
          <p className="font-poppins text-sm sm:text-xs text-gray-500 mt-1 line-clamp-3">
            {plan?.placeDetails}
          </p>
          <h2 className="font-serif text-sm mt-2">
            ⌛ {plan?.timeToTravel} Min
          </h2>

          {/* Weather Display */}
          {weather && (
            <div className="mt-3 bg-blue-50 text-blue-800 rounded-md px-3 py-2 w-full">
              <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-sm">
                <div className="flex items-center gap-1">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                    alt={weather.description}
                    className="w-5 h-5"
                  />
                  <span>{weather.description}</span>
                </div>
                <div className="flex items-center gap-1">
                  Temperature - <span>{weather.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  Humidity - <span>{weather.humidity}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PlacesCard;
