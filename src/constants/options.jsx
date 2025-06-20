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
    description: "A Group of fun loving people who love adventure and exploration.",
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

export const AI_PROMPT = `Generate Travel Plan for Location : {location}, for {days} days for {travelWith} with a {budget} budget. 
Give me a Hotels options list with HotelName, Hotel address, Price, Hotel image url, geo Coordinates, rating, description 
and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time to travel each of the location 
for {days} days with each day plan with best time to visit in JSON format.`;
