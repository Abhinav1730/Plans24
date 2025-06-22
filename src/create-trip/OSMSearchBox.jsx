import React, { useState, useRef } from "react";

const LOCATIONIQ_TOKEN = import.meta.env.VITE_LOCATION_IQ_API_KEY;

function OSMSearchBox({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (value.length >= 3) fetchResults(value);
      else setResults([]);
    }, 400);
  };

  const fetchResults = async (value) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_TOKEN}&q=${encodeURIComponent(
          value
        )}&format=json&limit=5`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a destination"
        className="w-full px-4 py-3 rounded-2xl border border-gray-400 font-body text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition"
      />
      {loading && (
        <div className="absolute top-full mt-1 bg-white px-3 py-1 rounded-b text-sm text-gray-500">
          Loading...
        </div>
      )}
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 shadow-lg rounded-b-md max-h-60 overflow-y-auto">
          {results.map((place, idx) => (
            <li
              key={idx}
              onClick={() => {
                setQuery(place.display_name);
                setResults([]);
                onSelect(place);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-body text-base sm:text-lg"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OSMSearchBox;

