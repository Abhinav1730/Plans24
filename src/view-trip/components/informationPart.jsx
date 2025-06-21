import { Button } from "../../components/ui/button";
import React from "react";
import { IoMdShare } from "react-icons/io";

function InformationPart({ trip }) {
  return (
    <div>
      <img
        src="/place-1.jpg"
        alt=""
        className="h-[340px] w-full object-cover rounded-xl"
      />
      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-5 items-start">
          <h2 className="font-bold font-serif text-4xl">
            {trip?.userSelection?.location?.name}
          </h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-red-100 rounded-full text-gray-500 font-serif text-xs md:text-lg">
              🗓️ {trip?.userSelection?.days} Day Trip
            </h2>
            <h2 className="p-1 px-3 bg-red-100 rounded-full text-gray-500 text-xs md:text-lg font-serif">
              💱 {trip?.userSelection?.budget?.title} Budget
            </h2>
            <h2 className="p-1 px-3 bg-red-100 rounded-full text-gray-500 text-xs md:text-lg font-serif">
              👨‍👩‍👧‍👦 {trip?.userSelection?.travelWith?.title}
            </h2>
          </div>
        </div>
        <Button>
          <IoMdShare />
        </Button>
      </div>
    </div>
  );
}

export default InformationPart;
