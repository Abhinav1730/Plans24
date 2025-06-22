import { Button } from "../../components/ui/button";
import React, { useEffect, useState } from "react";
import { IoMdShare } from "react-icons/io";
import { GetPlaceImage } from "../../services/GlobalApi";

function InformationPart({ trip }) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const location = trip?.userSelection?.location;
    if (location?.name) {
      const query = location.display_name || location.name;
      GetPlacePhoto(query);
    }
  }, [trip]);

  const GetPlacePhoto = async (placeName) => {
    try {
      const response = await GetPlaceImage(`${placeName} travel`);
      const imageUrl = response.data.results?.[0]?.urls?.regular;

      if (imageUrl) {
        setImageUrl(imageUrl);
      } else {
        setImageUrl("");
      }
    } catch (error) {
      console.error("Failed to fetch place photo:", error);
      setImageUrl("");
    }
  };

  return (
    <div className="w-full">
      {/* Responsive image */}
      <img
        src={imageUrl || ""}
        alt={trip?.userSelection?.location?.name || "Place"}
        className="w-full h-[250px] sm:h-[320px] md:h-[360px] lg:h-[400px] object-cover rounded-xl"
      />

      {/* Info section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-5 gap-5">
        <div className="flex flex-col gap-3">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl">
            {trip?.userSelection?.location?.name}
          </h2>

          <div className="flex flex-wrap gap-3">
            <h2 className="px-3 py-1 bg-red-100 rounded-full text-gray-500 font-serif text-sm sm:text-base">
              🗓️ {trip?.userSelection?.days} Day Trip
            </h2>
            <h2 className="px-3 py-1 bg-red-100 rounded-full text-gray-500 font-serif text-sm sm:text-base">
              💱 {trip?.userSelection?.budget?.title} Budget
            </h2>
            <h2 className="px-3 py-1 bg-red-100 rounded-full text-gray-500 font-serif text-sm sm:text-base">
              👨‍👩‍👧‍👦 {trip?.userSelection?.travelWith?.title}
            </h2>
          </div>
        </div>

        {/* Share button aligned right for medium+ screens */}
        <div className="self-start md:self-center">
          <Button className="flex items-center gap-2">
            <IoMdShare className="text-lg" />
            <span className="hidden sm:inline font-serif">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InformationPart;
