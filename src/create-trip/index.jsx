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
  DialogTitle,
  DialogTrigger,
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
  const [currentBackGroundImageIndex, setCurrentBackGroundImageIndex] =
    useState(0);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialogForLogin, setOpenDialogueForLogin] = useState(false);
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
    console.log("formData updated:", formData);
  }, [formData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackGroundImageIndex((prevIndex) =>
        prevIndex === backGroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  //method to generate trip from AI Model
  const onGenerateTrip = async () => {
    //checking for the user if logined or not
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
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.name
    )
      .replace(/{days}/g, formData?.days)
      .replace("{travelWith}", formData?.travelWith?.title)
      .replace("{budget}", formData?.budget?.title);

    console.log("Prompt to Gemini:", FINAL_PROMPT);

    try {
      const result = await generateTrip(FINAL_PROMPT);
      console.log("AI response:", result);
      setLoading(false);
      SaveAITrip(result);
      toast.success("Trip generated successfully!");
    } catch (error) {
      console.error("Error from Gemini:", error);
      toast.error("Failed to generate the trip.");
    }
  };

  //Method to save Generated Trip in Firebase
 const SaveAITrip = async (TripData) => {
  setLoading(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const docId = Date.now().toString();

  let parsedTripData = TripData;

  // If it's a string (i.e., contains markdown or raw JSON text)
  if (typeof TripData === "string") {
    try {
      // Clean markdown-style code fencing if present
      const cleanedJson = TripData
        .replace(/^```(json)?/i, "") // remove ```json or ```
        .replace(/```$/, "") // remove ending ```
        .trim();

      parsedTripData = JSON.parse(cleanedJson);
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


  //Method to get user details from google
  const GetUserProfile = (tokenInformation) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInformation?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInformation?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        localStorage.setItem("user", JSON.stringify(response.data));
        setOpenDialogueForLogin(false);
        onGenerateTrip();
      });
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

      <div className="my-10 justify-end flex">
        <Button
          disabled={loading}
          className="text-xl font-serif"
          onClick={onGenerateTrip}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate the Trip"
          )}
        </Button>
      </div>
      <Dialog open={openDialogForLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img
                className="w-24 rounded-full"
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
                className="w-full mt-5 font-serif flex items-center"
              >
                {" "}
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
