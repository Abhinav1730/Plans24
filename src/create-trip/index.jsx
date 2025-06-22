import React, { useState, useEffect } from "react";
import OSMSearchBox from "./OSMSearchBox";
import { Input } from "../components/ui/input.jsx";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "../constants/options";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { generateTrip } from "../services/AIModel";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const backGroundImages = [
  "/place-5.jpg",
  "/place-7.avif",
  "/place-8.webp",
  "/place-9.jpg",
  "/place-10.webp",
];

function CreateTrip() {
  const navigate = useNavigate();
  const [currentBackGroundImageIndex, setCurrentBackGroundImageIndex] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialogForLogin, setOpenDialogueForLogin] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const [formData, setFormData] = useState({
    location: null,
    days: "",
    budget: null,
    travelWith: null,
  });

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (error) => console.log(error),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentBackGroundImageIndex((prevIndex) =>
          prevIndex === backGroundImages.length - 1 ? 0 : prevIndex + 1
        );
        setIsFading(false);
      }, 500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialogueForLogin(true);
      return;
    }
    if (!formData.location) return toast.error("Please enter a location!");
    if (!formData.days || parseInt(formData.days) <= 0)
      return toast.error("Please enter valid number of days.");
    if (parseInt(formData.days) > 7)
      return toast.error("Trip duration cannot exceed 7 days.");
    if (!formData.budget || !formData.travelWith)
      return toast.error("Select your budget and travel preference.");

    toast.success("All details valid! Generating your trip...");
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location?.name)
      .replace(/{days}/g, formData?.days)
      .replace("{travelWith}", formData?.travelWith?.title)
      .replace("{budget}", formData?.budget?.title);

    try {
      const result = await generateTrip(FINAL_PROMPT);
      const match = result.match(/```json\s*([\s\S]*?)```|({[\s\S]*})/);
      const jsonString = match ? match[1] || match[2] : null;
      if (!jsonString) throw new Error("No valid JSON found in AI response");
      const parsedData = JSON.parse(jsonString);
      setLoading(false);
      SaveAITrip(parsedData);
      toast.success("Trip generated successfully!");
    } catch (error) {
      console.error("JSON parsing failed:", error);
      toast.error("Failed to parse AI response.");
      setLoading(false);
    }
  };

  const SaveAITrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    let parsedTripData = TripData;
    if (typeof TripData === "string") {
      try {
        const match = TripData.match(/```json\s*([\s\S]*?)```|({[\s\S]*})/);
        const jsonString = match ? match[1] || match[2] : null;
        if (!jsonString) throw new Error("No valid JSON found in AI response");
        parsedTripData = JSON.parse(jsonString);
      } catch (err) {
        console.error("JSON parsing failed:", err);
        toast.error("AI response format is invalid.");
        setLoading(false);
        return;
      }
    }

    await setDoc(doc(db, "AIGeneratedTrips", docId), {
      userSelection: formData,
      tripData: parsedTripData,
      userEmail: user?.email,
      id: docId,
    });

    setLoading(false);
    navigate("/view-trip/" + docId);
  };

  const GetUserProfile = (tokenInformation) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInformation?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInformation?.access_token}`,
          Accept: "Application/json",
        },
      })
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setOpenDialogueForLogin(false);
        onGenerateTrip();
      })
      .catch((error) => {
        console.error("Google profile fetch failed:", error);
        toast.error("Failed to fetch Google profile.");
      });
  };

  return (
    <div
      className={`w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center gap-9 transition-all duration-1000 ease-in-out rounded-2xl px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundImage: `url(${backGroundImages[currentBackGroundImageIndex]})`,
      }}
    >
      <div className="max-w-7xl w-full mt-10">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Tell us your <span className="text-red-100">Travel Preference</span>
        </h2>
        <p className="text-base sm:text-xl text-gray-100 font-sans">
          Tell us your destination, travel dates, budget, and interests — we’ll craft the perfect itinerary tailored just for you!
        </p>

        <div className="mt-20 flex flex-col gap-9 max-w-4xl mx-auto">
          {/* Destination input */}
          <div>
            <h2 className="text-xl sm:text-2xl my-3 font-medium text-white font-serif">
              What is your Destination?
            </h2>
            <OSMSearchBox
              onSelect={(place) => {
                setSelectedDestination(place);
                handleInputChange("location", {
                  name: place.display_name,
                  lat: place.lat,
                  lon: place.lon,
                });
              }}
            />
            {selectedDestination && (
              <p className="mt-3 text-white text-base sm:text-lg font-serif break-words">
                You Selected: {selectedDestination.display_name}
              </p>
            )}
          </div>

          {/* Days input */}
          <div className="w-full flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl my-3 font-medium text-white font-serif text-center">
              How Many Days are you Planning the Trip?
            </h2>
            <div className="w-full max-w-md">
              <Input
                placeholder={"Example: 3"}
                type="number"
                value={formData.days}
                onChange={(e) => handleInputChange("days", e.target.value)}
                className="rounded-xl border-red-500 bg-white text-gray-400 w-full text-lg sm:text-xl"
              />
            </div>
          </div>
        </div>

        {/* Budget selection */}
        <div className="mt-10 max-w-5xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl my-3 font-medium text-white font-serif">
            What is your Budget?
          </h2>
          <h3 className="text-base sm:text-xl my-3 font-medium text-white font-serif">
            The Budget is exclusively for activities and dining purposes.
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item)}
                className={`p-4 border rounded-lg hover:shadow-xl cursor-pointer transition-all ${
                  formData.budget?.title === item.title
                    ? "border-red-400 shadow-lg"
                    : "border-white"
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

        {/* Travel with selection */}
        <div className="mt-10 max-w-5xl mx-auto px-2">
          <h2 className="text-xl sm:text-2xl my-3 font-medium text-white font-serif">
            With whom do you plan on travelling with on your next Adventure?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("travelWith", item)}
                className={`p-4 border rounded-lg hover:shadow-xl cursor-pointer transition-all ${
                  formData.travelWith?.title === item.title
                    ? "border-red-400 shadow-lg"
                    : "border-white"
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

      <div className="my-10 justify-center flex w-full max-w-7xl px-2">
        <Button
          disabled={loading}
          className="text-lg sm:text-xl font-poppins px-6 py-3 w-full max-w-xs"
          onClick={onGenerateTrip}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate the Trip"
          )}
        </Button>
      </div>

      {/* Dialog for Google Sign-in */}
      <Dialog open={openDialogForLogin} onOpenChange={setOpenDialogueForLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="text-center">
              <img
                className="w-24 rounded-full mx-auto"
                src="/logo-plans24.png"
                alt=""
              />
              <h2 className="font-bold text-lg font-serif mt-7">
                Sign In With Google
              </h2>
              <p>Sign Into the Plans24 using Google Authentication securely</p>
              <Button
                disabled={loading}
                onClick={loginWithGoogle}
                className="w-full mt-5 font-serif flex items-center justify-center gap-2"
              >
                <FcGoogle className="h-7 w-7" /> Sign In
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;

