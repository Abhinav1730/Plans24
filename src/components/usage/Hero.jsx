import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col items-center mx-56 gap-9">
      <h1 className="font-sans text-[35px] text-center mt-16">
        Plan your perfect trip effortlessly with our AI travel planner –
        <span className="text-red-700">smart, fast, </span> and{" "}
        <span className="text-red-700">
          tailored to your preferences and budget
        </span>
        .
      </h1>
      <p className="text-xl text-rose-500 text-center">
        Discover destinations, create custom itineraries, and explore smarter —
        all powered by AI to make your travel planning seamless and fun.
      </p>

      <Link to={"/create-trip"}>
        <Button className="bg-rose-300 text-black font-sans hover:bg-red-700 hover:text-white">
          Get Started
        </Button>
      </Link>
    </div>
  );
}

export default Hero;
