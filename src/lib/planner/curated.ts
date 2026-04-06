import type { PlannerResponse } from "./types";

export const CURATED_ADDIS_PLAN: PlannerResponse = {
  tripSummary: {
    destination: "Addis Ababa",
    days: 3,
    travelStyle: "Best of Addis (Curated)",
    budget: "mid-range",
    assumptions: ["Recommended duration for first-time visitors", "Balanced pace of culture and relaxation"],
  },
  arrivalSupport: {
    airportPickupRecommended: true,
    simRecommended: true,
    currencyExchangeRecommended: true,
    notes: [
      "Bole Airport is busy; we recommend pre-booking a pickup.",
      "Get an Ethio Telecom SIM card at the airport arrival hall.",
      "Use official bank exchange desks for Ethiopian Birr (ETB)."
    ]
  },
  days: [
    {
      dayNumber: 1,
      theme: "History & Heritage",
      blocks: [
        {
          time: "morning",
          type: "attraction",
          title: "National Museum of Ethiopia",
          area: "Arat Kilo",
          reason: "Home to Lucy, the oldest human ancestor. Essential for understanding Ethiopia's place in history.",
          confidence: "high",
          trustBadges: ["Verified", "Must See"],
          isGrounded: true,
          slug: "national-museum-ethiopia"
        },
        {
          time: "lunch",
          type: "dining",
          title: "Lucy Restaurant & Grill",
          area: "Arat Kilo",
          reason: "Excellent garden dining right next to the museum. Famous for both local and international dishes.",
          confidence: "high",
          trustBadges: ["Popular Choice", "Verified"],
          isGrounded: true,
          slug: "lucy-lounge-restaurant"
        },
        {
          time: "afternoon",
          type: "attraction",
          title: "Tomoca Coffee (Piazza)",
          area: "Piazza",
          reason: "The oldest and most iconic coffee roaster in Addis. Experience the authentic standing coffee culture.",
          confidence: "high",
          trustBadges: ["Historical", "Verified"],
          isGrounded: true,
          slug: "tomoca-coffee"
        }
      ],
      alternatives: []
    },
    {
      dayNumber: 2,
      theme: "Markets & Heights",
      blocks: [
        {
          time: "morning",
          type: "attraction",
          title: "Addis Mercato",
          area: "Mercato",
          reason: "Explore absolute local life in Africa's largest open-air market. Best visited with a guide.",
          confidence: "high",
          trustBadges: ["Verified", "Local Favorite"],
          isGrounded: true,
          slug: "addis-mercato"
        },
        {
          time: "afternoon",
          type: "attraction",
          title: "Entoto Park",
          area: "Entoto",
          reason: "Breathtaking views of the city from the hills. Great for walking and enjoying the eucalyptus forests.",
          confidence: "high",
          trustBadges: ["Verified", "Nature"],
          isGrounded: true,
          slug: "entoto-park"
        }
      ],
      alternatives: []
    }
  ],
  warnings: ["This is a curated baseline plan as the AI was unable to generate a custom one."],
  confidenceSummary: {
    overall: "high",
    coverageNotes: ["Using manually verified top-tier locations"],
    groundedPlaceCount: 5,
    totalSlots: 5
  }
};
