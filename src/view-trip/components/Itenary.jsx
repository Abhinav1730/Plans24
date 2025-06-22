 import React from "react";
import PlacesCard from "./PlacesCard";

function Itenary({ trip }) {
  return (
    <div className="font-poppins px-4 sm:px-6 md:px-10">
      <h2 className="font-serif font-bold text-2xl mt-5 flex items-start">
        Your Recommended Itinerary
      </h2>

      <div>
        {trip?.tripData?.itinerary?.map((item, index) => (
          <div key={index} className="mt-6">
            <h2 className="font-serif font-extrabold text-lg mb-3">
              Day {item?.day}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {item?.plan?.map((plan, planIndex) => (
                <div className="my-1" key={planIndex}>
                  <h2 className="font-serif font-medium text-sm text-red-600 mb-1">
                    {plan?.timeSlot}
                  </h2>
                  <PlacesCard plan={plan} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Itenary