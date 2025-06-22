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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getWeatherForecast } from "../services/WeatherApi";

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

  const [formData, setFormData] = useState({
    location: null,
    days: "",
    budget: null,
    travelWith: null,
    preferredDate: null,
  });

  // Background image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackGroundImageIndex(
        (prev) => (prev + 1) % backGroundImages.length
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Google login success handler
  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`
      )
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialogueForLogin(false);
        onGenerateTrip();
      })
      .catch(() => toast.error("Google login failed."));
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: GetUserProfile,
    onError: (err) => console.error(err),
  });

  // Main function to generate trip and fetch weather
  const onGenerateTrip = async () => {
    if (!localStorage.getItem("user")) return setOpenDialogueForLogin(true);
    if (!formData.location) return toast.error("Enter a location");
    if (!formData.days || +formData.days <= 0)
      return toast.error("Enter valid days");
    if (+formData.days > 7) return toast.error("Max 7 days allowed");
    if (!formData.budget || !formData.travelWith)
      return toast.error("Select budget & travel preference");
    if (!formData.preferredDate) return toast.error("Pick a start date");

    toast.success("Generating your trip...");
    setLoading(true);

    // Format date for API & prompt
    const formattedDate = formData.preferredDate.toISOString().split("T")[0];
    let weatherData = null;

    // Fetch hourly weather for the start date
    try {
      weatherData = await getWeatherForecast(
        formData.location.lat,
        formData.location.lon,
        formattedDate
      );
    } catch (err) {
      console.error("Weather fetch error:", err);
      toast.error("Failed to fetch weather");
    }

    // Prepare AI prompt
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location.name)
      .replace(/{days}/g, formData.days)
      .replace("{travelWith}", formData.travelWith.title)
      .replace("{budget}", formData.budget.title)
      .replace("{preferredDate}", formattedDate);

    try {
      // Call AI model to generate trip JSON
      const res = await generateTrip(FINAL_PROMPT);
      const json = res.match(/```json\s*([\s\S]*?)```|({[\s\S]*})/);
      if (!json) throw new Error("No JSON found");
      const parsed = JSON.parse(json[1] || json[2]);

      // Attach weather data to trip data
      const tripDataWithWeather = { ...parsed, weather: weatherData };
      const tripId = Date.now().toString();

      // Save trip in Firestore
      await setDoc(doc(db, "AIGeneratedTrips", tripId), {
        id: tripId,
        userSelection: formData,
        tripData: tripDataWithWeather,
        userEmail: JSON.parse(localStorage.getItem("user")).email,
      });

      setLoading(false);
      toast.success("Trip ready! Redirecting...");
      navigate(`/view-trip/${tripId}`);
    } catch (err) {
      console.error(err);
      toast.error("Trip generation failed.");
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32"
      style={{
        backgroundImage: `url(${backGroundImages[currentBackGroundImageIndex]})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-6xl py-10 sm:py-12 px-2 sm:px-6 bg-black/30 rounded-lg backdrop-blur-md shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center">
          Tell us your <span className="text-red-200">Travel Preference</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-100 font-sans text-center mt-2">
          Share your destination, dates, budget & interests. We'll build a trip
          plan!
        </p>

        <div className="mt-10 space-y-8">
          {/* Destination */}
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-white font-serif mb-2">
              Destination
            </h3>
            <OSMSearchBox
              onSelect={(pl) => {
                setSelectedDestination(pl);
                handleInputChange("location", {
                  name: pl.display_name,
                  lat: pl.lat,
                  lon: pl.lon,
                });
              }}
            />
            {selectedDestination && (
              <p className="mt-2 text-white font-serif text-sm">
                {selectedDestination.display_name}
              </p>
            )}
          </div>

          {/* Days */}
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-white font-serif mb-2">
              Days (max 7)
            </h3>
            <div className="flex justify-center">
              <Input
                type="number"
                value={formData.days}
                onChange={(e) => handleInputChange("days", e.target.value)}
                placeholder="1–7"
                className="w-full sm:w-64 md:w-72 lg:w-80 rounded-xl border-red-400 bg-white text-gray-800 text-lg sm:text-xl px-3 py-2"
              />
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-white font-serif mb-2">
              Start Date
            </h3>
            <DatePicker
              selected={formData.preferredDate}
              onChange={(date) => handleInputChange("preferredDate", date)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="w-full max-w-md rounded-xl border-red-400 px-3 py-2 text-gray-800 text-lg sm:text-xl"
              placeholderText="Select start date"
            />
          </div>

          {/* Budget */}
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-white font-serif mb-2">
              Budget
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {SelectBudgetOptions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleInputChange("budget", item)}
                  className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                    formData.budget?.id === item.id
                      ? "border-red-400 bg-white/10 shadow-lg"
                      : "border-white/40"
                  }`}
                >
                  <h2 className="text-3xl sm:text-4xl">{item.icon}</h2>
                  <p className="text-white font-serif text-lg">{item.title}</p>
                  <p className="text-white font-serif text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Travel With */}
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-white font-serif mb-2">
              Travel With
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {SelectTravelList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleInputChange("travelWith", item)}
                  className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                    formData.travelWith?.id === item.id
                      ? "border-red-400 bg-white/10 shadow-lg"
                      : "border-white/40"
                  }`}
                >
                  <h2 className="text-3xl sm:text-4xl">{item.icon}</h2>
                  <p className="text-white font-serif text-lg">{item.title}</p>
                  <p className="text-white font-serif text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={onGenerateTrip}
              disabled={loading}
              className="px-6 py-3 text-lg sm:text-xl font-semibold bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-white text-2xl" />
              ) : (
                "Generate Trip"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Google Login Dialog */}
      <Dialog open={openDialogForLogin} onOpenChange={setOpenDialogueForLogin}>
        <DialogContent className="max-w-sm sm:max-w-md bg-white rounded-lg">
          <DialogHeader>
            <DialogDescription className="text-center">
              <img
                src="/logo-plans24.png"
                alt="Logo"
                className="mx-auto w-20 sm:w-24"
              />
              <h2 className="mt-4 font-serif font-bold text-lg sm:text-xl">
                Sign in with Google
              </h2>
              <Button
                onClick={loginWithGoogle}
                className="mt-4 w-full justify-center flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-black"
              >
                <FcGoogle className="text-2xl" /> Sign In
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
