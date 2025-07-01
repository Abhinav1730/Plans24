import React from "react";
import PlacesCard from "./PlacesCard";

function Itenary({ trip }) {
  return (
    <div className="font-poppins px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <h2 className="font-serif font-bold text-2xl mt-5 flex items-start">
        Your Recommended Itinerary
      </h2>

      <div>
        {trip?.tripData?.itinerary?.map((item, index) => (
          <div key={index} className="mt-6">
            <h2 className="font-serif font-extrabold text-lg mb-3">
              Day {item?.day}
            </h2>

            {/* Essentials and Medical Advice container */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-3 md:space-y-0 mb-4">
              {/* Essentials to Carry */}
              {item.essentialsToCarry && item.essentialsToCarry.length > 0 && (
                <div className="flex-1 bg-yellow-50 border border-yellow-300 rounded-md p-2 text-xs text-yellow-800 max-w-md min-w-0">
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <span role="img" aria-label="backpack">
                      🎒
                    </span>{" "}
                    Essentials:
                  </h4>
                  <ul className="list-disc list-inside space-y-0.5 max-h-24 overflow-y-auto">
                    {item.essentialsToCarry.map((ess, idx) => (
                      <li key={idx}>{ess}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Medical Advice */}
              {item.medicalAdvice && (
                <div className="flex-1 bg-red-50 border border-red-300 rounded-md p-2 text-xs text-red-800 max-w-md min-w-0">
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <span role="img" aria-label="medical">
                      🩺
                    </span>{" "}
                    Medical Advice:
                  </h4>
                  <p className="max-h-24 overflow-y-auto leading-tight">
                    {item.medicalAdvice}
                  </p>
                </div>
              )}
            </div>

            {/* Plans grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {item?.plan?.map((plan, planIndex) => (
                <div className="my-1" key={planIndex}>
                  <h2 className="font-serif font-medium text-sm text-red-600 mb-1 truncate">
                    {plan?.timeSlot}
                  </h2>

                  <PlacesCard plan={plan} weather={item.weather} />
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
