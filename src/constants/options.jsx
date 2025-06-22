export const SelectTravelList = [
  {
    id: 1,
    title: "Solo",
    description: "A solo traveler fond of exploration and fun alone.",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    description: "Exploring together brings couples closer than ever.",
    icon: "🥂",
    people: "2",
  },
  {
    id: 3,
    title: "Family",
    description:
      "A Group of fun loving people who love adventure and exploration.",
    icon: "🏠",
    people: "3 to 5 People",
  },
  {
    id: 4,
    title: "Friends",
    description: "Friends who travel together create the best memories.",
    icon: "🤝",
    people: "5 to 10 People",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Economical",
    description: "Budget friendly and conscious to your pocket",
    icon: "💵",
  },
  {
    id: 2,
    title: "Moderate",
    description: "Keeping cost on the average side",
    icon: "🪙",
  },
  {
    id: 3,
    title: "Luxury",
    description: "No worries about the cost, enjoyment matters",
    icon: "💰",
  },
];

export const AI_PROMPT = `
Generate a detailed Travel Plan in JSON format for the following inputs:
Location: {location}
Duration: {days} days
Travel With: {travelWith}
Budget: {budget}

Your JSON output MUST contain the following top-level keys:
- location (string): The location name
- duration_days (number): Number of days
- travel_style (string): Travel style or travelWith value
- budget (string): Budget description
- hotelOptions (array): List of hotel objects with keys:
  * hotelName (string)
  * hotelAddress (string)
  * priceRange (string)
  * hotelImageUrl (string)
  * geoCoordinates (object with lat and lng)
  * rating (number)
  * description (string)
- itinerary (array): Array of day objects with keys:
  * day (number)
  * plan (array): Each plan item with keys:
    - placeName (string)
    - placeDetails (string)
    - placeImageUrl (string)
    - geoCoordinates (object with lat and lng)
    - ticketPricing (string)
    - timeToTravel (number, in minutes)
    - timeSlot (string in the format: "HH A.M. - HH A.M." or "HH P.M. - HH P.M.")
    - bestTimeToVisit (string)

IMPORTANT:
- All timeSlot values must be strictly formatted as either "HH A.M. - HH A.M." or "HH P.M. - HH P.M." (e.g., "09 A.M. - 11 A.M.", "02 P.M. - 04 P.M.")
- DO NOT include any keys outside of those specified.
- DO NOT wrap the output in any variable or outer object.
- ONLY return a valid JSON object matching the structure above.
`;

