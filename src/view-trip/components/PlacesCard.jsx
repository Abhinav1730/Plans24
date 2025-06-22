import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceImage } from "../../services/GlobalApi";

const weatherIcons = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️", 61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "❄️", 73: "❄️", 75: "❄️", 80: "🌧️", 81: "🌧️", 82: "🌧️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

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
      <div className="shadow-md border rounded-xl p-3 mt-2 flex flex-col md:flex-row gap-4 hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden">
        {/* Image section */}
        <img
          src={imageUrl}
          alt={plan?.placeName}
          className="w-full md:w-[140px] h-[180px] md:h-[100px] rounded-xl object-cover border border-red-600"
        />

        {/* Details section */}
        <div className="flex flex-col justify-between flex-1">
          <h2 className="font-serif font-bold text-lg sm:text-base truncate">
            {plan?.placeName}
          </h2>
          <p className="font-poppins text-sm sm:text-xs text-gray-500 mt-1 line-clamp-3">
            {plan?.placeDetails}
          </p>
          <h2 className="font-serif text-sm mt-2">⌛ {plan?.timeToTravel} Min</h2>

          {/* Weather */}
          {weather && (
            <div className="mt-2 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded-md w-fit">
              <span className="text-xl">{weatherIcons[weather.weatherCode] || "🌡️"}</span>
              <span>{weather.temperature}°C</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PlacesCard;
