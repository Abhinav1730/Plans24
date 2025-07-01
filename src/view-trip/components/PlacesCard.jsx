import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceImage } from "../../services/GlobalApi";
import { FaBus, FaTrain, FaTaxi, FaMapMarkedAlt } from "react-icons/fa";

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

  const getTransportIcon = (mode) => {
    if (!mode) return <FaMapMarkedAlt />;
    const lower = mode.toLowerCase();
    if (lower.includes("metro") || lower.includes("train")) return <FaTrain />;
    if (lower.includes("bus")) return <FaBus />;
    if (lower.includes("taxi") || lower.includes("cab")) return <FaTaxi />;
    return <FaMapMarkedAlt />;
  };

  return (
    <div className="flex flex-col gap-4">
      <Link
        to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          plan?.placeName
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="shadow-md border rounded-xl p-3 flex flex-col md:flex-row gap-4 hover:scale-105 transition-transform duration-300 cursor-pointer bg-white overflow-hidden">
          {/* Image */}
          <img
            src={imageUrl}
            alt={plan?.placeName}
            className="w-full md:w-[140px] h-[180px] md:h-[100px] rounded-xl object-cover border border-red-600 flex-shrink-0"
          />

          {/* Text Section */}
          <div className="flex flex-col justify-start flex-1 min-w-0">
            <h2 className="font-serif font-bold text-lg sm:text-base truncate">
              {plan?.placeName}
            </h2>

            <p className="font-poppins text-sm sm:text-xs text-gray-500 mt-1 line-clamp-3">
              {plan?.placeDetails}
            </p>

            <h2 className="font-serif text-sm mt-2">
              ⌛ {plan?.timeToTravel} Min
            </h2>

            {/* Weather Info */}
            {weather && (
              <div className="mt-3 bg-blue-50 text-blue-800 rounded-md px-3 py-2 w-full">
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                      alt={weather.description}
                      className="w-5 h-5"
                    />
                    <span className="capitalize">{weather.description}</span>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    Temp: <span>{weather.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    💧 {weather.humidity}%
                  </div>
                </div>
              </div>
            )}

            {/* Transportation */}
            {plan?.transportation && (
              <div className="mt-3 w-full bg-gray-100 rounded-md px-4 py-2 text-gray-800">
                <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-2 text-sm font-medium">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {getTransportIcon(plan.transportation.mode)}
                    <span className="capitalize">
                      {plan.transportation.mode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>💰 {plan.transportation.fare}</span>
                    <span>🕒 {plan.transportation.estimatedTime}</span>
                  </div>
                </div>

                {/* Metro-specific */}
                {plan.transportation.mode?.toLowerCase().includes("metro") && (
                  <div className="mt-2 pl-2 text-xs md:text-sm text-gray-600 space-y-1 md:space-y-0 md:flex md:gap-6 md:items-center">
                    {plan.transportation.toStation && (
                      <div className="whitespace-nowrap">
                        🚉 To Station:{" "}
                        <strong>{plan.transportation.toStation}</strong>
                      </div>
                    )}
                    {plan.transportation.line && (
                      <div className="whitespace-nowrap">
                        📍 Line:{" "}
                        <span className="font-semibold">
                          {plan.transportation.line}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PlacesCard;
