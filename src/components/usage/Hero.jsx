import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    //for entire screen background
    <div
      className="w-full h-screen bg-cover bg-center flex flex-col items-center justify-center gap-9 rounded-2xl"
      style={{ backgroundImage: "url('/public/place-1.jpg')" }}
    >
      {/* the inside content of the page */}
      <div className="flex flex-col items-center mx-56 gap-9">
        <h1 className="font-sans text-[35px] text-center mt-16 border-red-100 rounded-3xl p-2 border bg-transparent text-white">
          Plan your perfect trip effortlessly with our AI travel planner –
          <span className="text-red-100 font-serif">smart, fast, </span> and{" "}
          <span className="text-red-100 font-serif">
            tailored to your preferences and budget
          </span>
          .
        </h1>
        <p className="text-xl bg-transparent text-center text-gray-100 border border-red-100 rounded-3xl p-2 font-serif">
          Discover destinations, create custom itineraries, and explore smarter
          — all powered by AI to make your travel planning seamless and fun.
        </p>

        <Link to={"/create-trip"}>
          <Button className="bg-transparent text-white font-sans hover:border-red-800 hover:bg-transparent border border-white text-xl">
            Click here to Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
