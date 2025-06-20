import React, { useState, useEffect } from "react";
import OSMSearchBox from "./OSMSearchBox";
import { Input } from "../components/ui/input.jsx";
import { SelectBudgetOptions, SelectTravelList } from "../constants/options";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const backGroundImages = [
  "/place-5.jpg",
  "/place-7.avif",
  "/place-8.webp",
  "/place-9.jpg",
  "/place-10.webp",
];

function CreateTrip() {
  const [currentBackGroundImageIndex, setCurrentBackGroundImageIndex] =
    useState(0);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // formData will hold all inputs in a single object
  const [formData, setFormData] = useState({
    location: null,
    days: "",
    budget: null,
    travelWith: null,
  });

  // Universal handler for form inputs
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Debug: log form data changes
  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  // Background image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackGroundImageIndex((prevIndex) =>
        prevIndex === backGroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const onGenerateTrip = () => {
    if (!formData.location) {
      toast.error("Please enter a location where you want to go!");
      return;
    }

    if (!formData.days || parseInt(formData.days) <= 0) {
      toast.error("Please enter a valid number of days for your trip.");
      return;
    }

    if (parseInt(formData.days) > 7) {
      toast.error("Please enter a trip duration of 7 days or fewer.");
      return;
    }

    if (!formData.budget || !formData.travelWith) {
      toast.error("Please select your budget and travel preference.");
      return;
    }

    // Success message
    toast.success("All details are valid! Generating your trip...");
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center gap-9 transition-all duration-1000 ease-in-out rounded-2xl"
      style={{
        backgroundImage: `url(${backGroundImages[currentBackGroundImageIndex]})`,
      }}
    >
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
        <h2 className="font-bold text-white bg-transparent text-3xl">
          Tell us your{" "}
          <span className="text-red-100 font-serif">Travel Preference</span>
        </h2>
        <p className="mt-3 text-gray-100 bg-transparent text-xl">
          Tell us your destination, travel dates, budget, and interests — we’ll
          craft the perfect itinerary tailored just for you!
        </p>

        <div className="mt-20 flex flex-col gap-9">
          {/* Destination */}
          <div>
            <h2 className="text-2xl my-3 font-medium text-white font-serif">
              What is your Destination?
            </h2>
            <OSMSearchBox
              onSelect={(place) => {
                setSelectedDestination(place);
                handleInputChange("location", place);
              }}
            />
            {selectedDestination && (
              <p className="mt-3 text-white bg-transparent text-xl font-serif">
                You Selected : {selectedDestination.display_name}
              </p>
            )}
          </div>

          {/* Number of days */}
          <div>
            <h2 className="text-2xl my-3 font-medium text-white font-serif">
              How Many Days are you Planning the Trip?
            </h2>
            <Input
              placeholder={"Example: 3"}
              type="number"
              value={formData.days}
              onChange={(e) => handleInputChange("days", e.target.value)}
              className="rounded-3xl text-black border border-black bg-white text-2xl"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="mt-10">
          <h2 className="text-2xl my-3 font-medium text-white font-serif">
            What is your Budget?
          </h2>
          <h3 className="text-xl my-3 font-medium text-white font-serif">
            The Budget is exclusively for activities and dining purposes.
          </h3>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item)}
                className={`p-4 border rounded-lg hover:shadow-xl cursor-pointer ${
                  formData.budget?.title === item.title
                    ? "border-red-400 shadow-lg"
                    : ""
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-white text-lg font-serif">
                  {item.title}
                </h2>
                <h2 className="text-sm text-white font-serif">
                  {item.description}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Travel With */}
        <div className="mt-10">
          <h2 className="text-2xl my-3 font-medium text-white font-serif">
            With whom do you plan on travelling with on your next Adventure?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("travelWith", item)}
                className={`p-4 border rounded-lg hover:shadow-xl cursor-pointer ${
                  formData.travelWith?.title === item.title
                    ? "border-red-400 shadow-lg"
                    : ""
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-white font-serif text-lg">
                  {item.title}
                </h2>
                <h2 className="text-sm text-white font-serif">
                  {item.description}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="my-10 justify-end flex">
        <Button className="text-xl font-serif" onClick={onGenerateTrip}>
          Generate the Trip
        </Button>
      </div>
    </div>
  );
}

export default CreateTrip;
