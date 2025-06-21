import React from "react";
import PlacesCard from "./PlacesCard";

function Itenary({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-2xl mt-5 font-serif flex items-start">
        Your Recommended Itenary
      </h2>
      <div>
        {trip?.tripData?.travelPlan?.itinerary?.map((item, index) => (
          <div key={index}>
            <h2 className="font-extrabold font-serif text-lg mt-5">
              Day {item?.day}
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {item?.plan?.map((plan, index) => (
                <div className="my-3" key={index}>
                  <h2 className="font-medium text-sm font-serif text-red-600">
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
