import { Button } from "../../components/ui/button";
import React, { useEffect, useState } from "react";
import { IoMdShare } from "react-icons/io";
import { GetPlaceImage } from "../../services/GlobalApi";

function InformationPart({ trip }) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const location = trip?.userSelection?.location;
    if (location?.name) {
      // Prefer full display_name if available, else fallback to name
      const query = location.display_name || location.name;
      GetPlacePhoto(query);
    }
  }, [trip]);

  const GetPlacePhoto = async (placeName) => {
    try {
      const response = await GetPlaceImage(`${placeName} travel`); // 📌 add keyword for relevance
      const imageUrl = response.data.results?.[0]?.urls?.regular;

      if (imageUrl) {
        setImageUrl(imageUrl);
      } else {
        setImageUrl(""); // fallback
      }
    } catch (error) {
      console.error("Failed to fetch place photo:", error);
      setImageUrl("");
    }
  };

  return (
    <div>
      <img
        src={imageUrl || ""}
        alt={trip?.userSelection?.location?.name || "Place"}
        className="h-[340px] w-full object-cover rounded-xl"
      />
      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col gap-5 items-start">
          <h2 className="font-serif font-bold text-4xl">
            {trip?.userSelection?.location?.name}
          </h2>
          <div className="flex gap-5 flex-wrap">
            <h2 className="p-1 px-3 bg-red-100 rounded-full text-gray-500 font-serif text-xs md:text-lg">
              🗓️ {trip?.userSelection?.days} Day Trip
            </h2>
            <h2 className="p-1 px-3 bg-red-100 rounded-full text-gray-500 font-serif text-xs md:text-lg">
              💱 {trip?.userSelection?.budget?.title} Budget
            </h2>
            <h2 className="p-1 px-3 bg-red-100 rounded-full text-gray-500 font-serif text-xs md:text-lg">
              👨‍👩‍👧‍👦 {trip?.userSelection?.travelWith?.title}
            </h2>
          </div>
        </div>
        <Button>
          <IoMdShare className="text-xl" />
        </Button>
      </div>
    </div>
  );
}

export default InformationPart;

