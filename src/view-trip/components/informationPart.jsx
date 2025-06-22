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
      setImageUrl(imageUrl || "");
    } catch (error) {
      console.error("Failed to fetch place photo:", error);
      setImageUrl("");
    }
  };

  const handleShare = async () => {
    const locationName = trip?.userSelection?.location?.name;
    const days = trip?.userSelection?.days;
    const budget = trip?.userSelection?.budget?.title;
    const travelWith = trip?.userSelection?.travelWith?.title;

    const shareText = `Check out this ${days}-day trip plan to ${locationName}!\nBudget: ${budget}\nTravel With: ${travelWith}`;

    // for mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trip to ${locationName}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      // 2. Fallback share options
      const encodedText = encodeURIComponent(
        shareText + "\n" + window.location.href
      );

      const options = [
        {
          name: "WhatsApp",
          url: `https://wa.me/?text=${encodedText}`,
        },
        {
          name: "Telegram",
          url: `https://t.me/share/url?url=${encodedText}`,
        },
        {
          name: "SMS",
          url: `sms:?body=${encodedText}`,
        },
        {
          name: "Email",
          url: `mailto:?subject=Trip to ${locationName}&body=${encodedText}`,
        },
      ];

      const selected = prompt(
        "Share via:\n1. WhatsApp\n2. Telegram\n3. SMS\n4. Email\n\nEnter number (1-4):"
      );

      const index = parseInt(selected) - 1;
      if (index >= 0 && index < options.length) {
        window.open(options[index].url, "_blank");
      }
    }
  };

  return (
    <div className="w-full">
      <img
        src={imageUrl || ""}
        alt={trip?.userSelection?.location?.name || "Place"}
        className="w-full h-[250px] sm:h-[320px] md:h-[360px] lg:h-[400px] object-cover rounded-xl"
      />

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

        <div className="self-start md:self-center">
          <Button className="flex items-center gap-2" onClick={handleShare}>
            <IoMdShare className="text-lg" />
            <span className="hidden sm:inline font-serif">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InformationPart;
