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
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a destination"
        className="w-full px-4 py-2 border rounded-2xl border-black"
      />
      {loading && (
        <div className="absolute top-full mt-1 text-sm text-gray-500 px-2">
          Loading...
        </div>
      )}
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 shadow rounded max-h-60 overflow-y-auto">
          {results.map((place, idx) => (
            <li
              key={idx}
              onClick={() => {
                setQuery(place.display_name);
                setResults([]);
                onSelect(place);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
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
