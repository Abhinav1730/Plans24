import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-32 text-white text-center"
      style={{ backgroundImage: "url('/place-1.jpg')" }}
    >
      <div className="flex flex-col items-center gap-6 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-10 bg-black/40 p-4 rounded-2xl">
          Plan your perfect trip effortlessly with our AI travel planner —{" "}
          <span className="text-red-100 font-serif">smart, fast, </span>
          and{" "}
          <span className="text-red-100 font-serif">
            tailored to your preferences and budget
          </span>
          .
        </h1>

        <p className="text-base sm:text-lg md:text-xl bg-black/30 p-4 rounded-2xl font-serif text-gray-100">
          Discover destinations, create custom itineraries, and explore smarter
          — all powered by AI to make your travel planning seamless and fun.
        </p>

        <Link to={"/create-trip"}>
          <Button className="bg-transparent text-white border border-white hover:border-red-500 text-lg sm:text-xl px-6 py-3 rounded-lg transition">
            Click here to Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
