import React from "react";
import PlacesCard from "./PlacesCard";

function Itenary({ trip }) {
  return (
    <div className="font-poppins">
      <h2 className="font-serif font-bold text-2xl mt-5 flex items-start">
        Your Recommended Itenary
      </h2>
      <div>
        {trip?.tripData?.itinerary?.map((item, index) => (
          <div key={index}>
            <h2 className="font-serif font-extrabold text-lg mt-5">
              Day {item?.day}
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {item?.plan?.map((plan, planIndex) => (
                <div className="my-3" key={planIndex}>
                  <h2 className="font-serif font-medium text-sm text-red-600">
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

export default Itenary;

