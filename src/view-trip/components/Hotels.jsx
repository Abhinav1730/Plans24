import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceImage } from "../../services/GlobalApi";

function Hotels({ trip }) {
  const [hotelImages, setHotelImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const hotels = trip?.tripData?.hotelOptions || [];

      const results = await Promise.all(
        hotels.map(async (hotel) => {
          try {
            const searchQuery = `${hotel.hotelName} ${
              trip?.userSelection?.location?.name || ""
            }`;
            const res = await GetPlaceImage(searchQuery);
            const imgUrl = res.data.results?.[0]?.urls?.small;
            return { name: hotel.hotelName, url: imgUrl };
          } catch {
            return { name: hotel.hotelName, url: null };
          }
        })
      );

      const imageMap = results.reduce((acc, item) => {
        acc[item.name] = item.url;
        return acc;
      }, {});

      setHotelImages(imageMap);
    };

    if (trip?.tripData?.hotelOptions?.length) {
      fetchImages();
    }
  }, [trip]);

  return (
    <div className="font-poppins">
      <h2 className="font-serif font-bold text-2xl mt-5">
        Hotel Recommendations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
        {trip?.tripData?.hotelOptions?.map((hotel, index) => (
          <Link
            key={index}
            to={`https://www.google.com/maps/search/?api=1&query=${hotel.hotelName},${hotel.hotelAddress}`}
            target="_blank"
            rel="noreferrer"
          >
            <div className="hover:scale-105 transition-all cursor-pointer">
              <img
                src={hotelImages[hotel.hotelName] || "/hotel.avif"}
                className="rounded-lg border border-red-600 h-[180px] w-full object-cover"
                alt={hotel.hotelName}
              />
              <div className="my-2 mt-5 flex flex-col gap-2">
                <h2 className="font-serif font-medium text-lg">
                  {hotel.hotelName}
                </h2>
                <h2 className="font-serif text-gray-600 text-xs flex items-center gap-1">
                  <span>📍</span> {hotel.hotelAddress}
                </h2>
                <h2 className="font-serif text-sm">Rs. {hotel.priceRange}</h2>
                <h2 className="font-serif text-sm">🌟 {hotel.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;


