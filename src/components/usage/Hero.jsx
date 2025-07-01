import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 text-white text-center"
      style={{ backgroundImage: "url('/place-1.jpg')" }}
    >
      <div className="flex flex-col items-center gap-6 max-w-2xl mt-10 bg-black/50 p-6 rounded-xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline leading-tight">
          Plan your perfect trip effortlessly with our AI travel planner —{" "}
          <span className="text-red-200">smart, fast,</span> and{" "}
          <span className="text-red-200">
            tailored to your preferences and budget
          </span>
          .
        </h1>

        <p className="text-base sm:text-lg font-body text-gray-100">
          Discover destinations, create custom itineraries, and explore smarter
          — all powered by AI.
        </p>

        <Link to="/create-trip" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-lg sm:text-xl px-6 py-4 rounded-lg transition font-button font-semibold">
            Plan a Trip
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;