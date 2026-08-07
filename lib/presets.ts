export interface Preset {
  id: string;
  label: string;
  icon: string;
  image?: string;
  amount: number;
  year: number;
  description: string;
  sourceNote: string;
}

export const builtInPresets: Preset[] = [
  {
    id: "rice",
    label: "1 Derica of Rice",
    icon: "🍚",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Mushqbudji_rice_grains_close-up.jpg/250px-Mushqbudji_rice_grains_close-up.jpg",
    amount: 630,
    year: 2017,
    description: "About 1.5kg of imported loose rice",
    sourceNote: "NBS Food Price Watch, March 2017",
  },
  {
    id: "petrol",
    label: "1 Litre of Petrol",
    icon: "⛽",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Modern_gas_station_column.jpg/250px-Modern_gas_station_column.jpg",
    amount: 65,
    year: 2011,
    description: "Official pump price before 2012 subsidy removal",
    sourceNote: "GIZ International Fuel Price Database / NBS",
  },
  {
    id: "uni",
    label: "Federal Uni Tuition",
    icon: "🎓",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/University_of_Ibadan_gate%2C_Ibadan4.jpg/250px-University_of_Ibadan_gate%2C_Ibadan4.jpg",
    amount: 35000,
    year: 2015,
    description: "Typical session fee for a federal university",
    sourceNote: "Aggregated from Legit.ng, Nairaland (mid-range)",
  },
  {
    id: "eggs",
    label: "Crate of Eggs",
    icon: "🥚",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Egg_cartons_with_chicken_eggs_03.jpg/250px-Egg_cartons_with_chicken_eggs_03.jpg",
    amount: 1200,
    year: 2020,
    description: "30-piece crate of eggs at retail",
    sourceNote: "Naijasabi.com egg price history",
  },
  {
    id: "wage",
    label: "Minimum Wage",
    icon: "💰",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Nigerian_naira_note_%2880773%29.jpg/250px-Nigerian_naira_note_%2880773%29.jpg",
    amount: 18000,
    year: 2011,
    description: "National minimum monthly salary",
    sourceNote: "National Minimum Wage (Amendment) Act, 2011",
  },
  {
    id: "soda",
    label: "Bottle of Soda",
    icon: "🥤",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/15-09-26-RalfR-WLC-0098_-_Coca-Cola_glass_bottle_%28Germany%29.jpg/250px-15-09-26-RalfR-WLC-0098_-_Coca-Cola_glass_bottle_%28Germany%29.jpg",
    amount: 50,
    year: 2010,
    description: "35cl Coca-Cola or Fanta at retail",
    sourceNote: "Niger State Bureau of Statistics retail prices",
  },
];