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

const backGroundImages = [
  "/place-5.jpg",
  "/place-7.avif",
  "/place-8.webp",
  "/place-9.jpg",
  "/place-10.webp",
];

function CreateTrip() {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((i) => (i + 1) % backGroundImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (t) =>
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${t.access_token}`
        )
        .then((resp) => {
          localStorage.setItem("user", JSON.stringify(resp.data));
          setOpenDialogueForLogin(false);
          onGenerateTrip();
        })
        .catch(() => toast.error("Google login failed.")),
    onError: console.error,
  });

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
    const formattedDate = formData.preferredDate.toISOString().split("T")[0];
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location.name)
      .replace(/{days}/g, formData.days)
      .replace("{travelWith}", formData.travelWith.title)
      .replace("{budget}", formData.budget.title)
      .replace("{preferredDate}", formattedDate);

    try {
      const res = await generateTrip(FINAL_PROMPT);
      const match = res.match(/```json\s*([\s\S]*?)```|({[\s\S]*})/);
      if (!match) throw new Error("No JSON found");
      const parsed = JSON.parse(match[1] || match[2]);
      const tripId = Date.now().toString();
      await setDoc(doc(db, "AIGeneratedTrips", tripId), {
        id: tripId,
        userSelection: formData,
        tripData: parsed,
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
    <div className="relative w-full min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${backGroundImages[bgIndex]})` }}
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 sm:px-6 md:px-10 lg:px-20 xl:px-32">
        <div className="w-full max-w-3xl bg-black/30 rounded-lg backdrop-blur-md p-6 sm:p-10 shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center">
            Tell us your <span className="text-red-200">Travel Preference</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-100 text-center">
            Share destination, dates & budget — we’ll build your trip plan!
          </p>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Destination */}
            <div>
              <h3 className="text-lg sm:text-xl font-serif text-white mb-2">
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
                <p className="mt-2 text-gray-200 text-sm">
                  {selectedDestination.display_name}
                </p>
              )}
            </div>

            {/* Days */}
            <div>
              <h3 className="text-lg sm:text-xl font-serif text-white mb-2">
                Days (max 7)
              </h3>
              <Input
                type="number"
                value={formData.days}
                onChange={(e) => handleInputChange("days", e.target.value)}
                placeholder="1–7"
                className="w-full sm:w-64 rounded-xl border-red-400 bg-white text-gray-800 px-3 py-2 text-lg sm:text-xl"
              />
            </div>

            {/* Date */}
            <div>
              <h3 className="text-lg sm:text-xl font-serif text-white mb-2">
                Start Date
              </h3>
              <DatePicker
                selected={formData.preferredDate}
                onChange={(date) => handleInputChange("preferredDate", date)}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="w-full sm:w-full rounded-xl border-red-400 bg-white px-3 py-2 text-gray-800 text-lg sm:text-xl"
              />
            </div>

            {/* Budget & Travel With */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-serif text-white mb-2">
                  Budget
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SelectBudgetOptions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleInputChange("budget", item)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.budget?.id === item.id
                          ? "border-red-400 bg-white/10"
                          : "border-white/40"
                      }`}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="text-white font-serif">{item.title}</div>
                      <div className="text-xs text-gray-200">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-serif text-white mb-2">
                  Travel With
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SelectTravelList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleInputChange("travelWith", item)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.travelWith?.id === item.id
                          ? "border-red-400 bg-white/10"
                          : "border-white/40"
                      }`}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div className="text-white font-serif">{item.title}</div>
                      <div className="text-xs text-gray-200">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={onGenerateTrip}
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-lg sm:text-xl font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <AiOutlineLoading3Quarters className="animate-spin text-white text-2xl" />
                    Planning your trip...
                  </span>
                ) : (
                  "Generate Trip"
                )}
              </Button>

              {/* Loading Overlay */}
              {loading && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white px-4 sm:px-8">
                  <AiOutlineLoading3Quarters className="text-4xl sm:text-5xl animate-spin mb-6 text-red-400" />

                  <div className="bg-white/10 rounded-lg p-6 text-left text-gray-100 text-base space-y-3 font-mono shadow-xl backdrop-blur-sm max-w-lg w-full">
                    <p>
                      🧭 Searching for hidden gems in{" "}
                      <strong>{formData.location?.name}</strong>...
                    </p>
                    <p>🏨 Comparing hotels for the best stay...</p>
                    <p>🌦️ Checking weather history for optimal planning...</p>
                    <p>🚗 Calculating travel time and best routes...</p>
                    <p>🧠 Curating the perfect plan just for you...</p>
                  </div>

                  <p className="mt-6 text-xs text-gray-300">
                    Sit tight! Your itinerary is on its way ✈️
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black"
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