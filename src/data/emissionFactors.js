// src/data/emissionFactors.js

export const stationaryCombustion = {
  "Anthracite Coal":        { co2: 2602, ch4: 276,  n2o: 40,  unit: "short ton" },
  "Bituminous Coal":        { co2: 2325, ch4: 274,  n2o: 40,  unit: "short ton" },
  "Sub-bituminous Coal":    { co2: 1676, ch4: 190,  n2o: 28,  unit: "short ton" },
  "Lignite Coal":           { co2: 1389, ch4: 156,  n2o: 23,  unit: "short ton" },
  "Mixed Commercial Coal":  { co2: 2016, ch4: 235,  n2o: 34,  unit: "short ton" },
  "Mixed Electric Power Coal": { co2: 1885, ch4: 217, n2o: 32, unit: "short ton" },
  "Mixed Industrial Coal":  { co2: 2116, ch4: 246,  n2o: 36,  unit: "short ton" },
  "Mixed Industrial Coking Coal": { co2: 2468, ch4: 289, n2o: 42, unit: "short ton" },
  "Coal Coke":              { co2: 2819, ch4: 273,  n2o: 40,  unit: "short ton" },
  "Municipal Solid Waste":  { co2: 902,  ch4: 318,  n2o: 42,  unit: "short ton" },
  "Petroleum Coke Solid":   { co2: 3072, ch4: 960,  n2o: 126, unit: "short ton" },
  "Plastics":               { co2: 2850, ch4: 1216, n2o: 160, unit: "short ton" },
  "Tires":                  { co2: 2407, ch4: 896,  n2o: 118, unit: "short ton" },
  "Agricultural Byproducts":{ co2: 975,  ch4: 264,  n2o: 35,  unit: "short ton" },
  "Peat":                   { co2: 895,  ch4: 256,  n2o: 34,  unit: "short ton" },
  "Solid Byproducts":       { co2: 1096, ch4: 332,  n2o: 44,  unit: "short ton" },
  "Wood and Wood Residuals":{ co2: 1640, ch4: 126,  n2o: 63,  unit: "short ton" },

  // Gaseous fuels
  "Natural Gas":            { co2: 0.05444, ch4: 0.00103, n2o: 0.0001, unit: "scf" },
  "Propane Gas":            { co2: 0.15463, ch4: 0.007548, n2o: 0.00151, unit: "scf" },
  "Landfill Gas":           { co2: 0.025254, ch4: 0.001552, n2o: 0.000306, unit: "scf" },

  // Liquid fuels
  "Distillate Fuel Oil No. 2":   { co2: 10.21, ch4: 0.41,  n2o: 0.08,  unit: "gallon" },
  "Residual Fuel Oil No. 6":     { co2: 11.27, ch4: 0.45,  n2o: 0.09,  unit: "gallon" },
  "Kerosene":                    { co2: 10.15, ch4: 0.41,  n2o: 0.08,  unit: "gallon" },
  "Liquefied Petroleum Gases LPG": { co2: 5.68, ch4: 0.28, n2o: 0.06, unit: "gallon" },
  "Biodiesel 100":               { co2: 9.45,  ch4: 0.14,  n2o: 0.01,  unit: "gallon" },
  "Ethanol 100":                 { co2: 5.75,  ch4: 0.09,  n2o: 0.01,  unit: "gallon" },
  "Rendered Animal Fat":         { co2: 8.88,  ch4: 0.14,  n2o: 0.01,  unit: "gallon" },
  "Vegetable Oil":               { co2: 9.79,  ch4: 0.13,  n2o: 0.01,  unit: "gallon" }
};


// Mobile Combustion Emission Factors
// Source: EPA Simplified GHG Emissions Calculator, June 2024

export const mobileCombustion = {
  // On-Road Gasoline CH₄/N₂O (grams per mile) by vehicle type and year range
  onRoadGasolineEmissions: {
    "Passenger Cars - Gasoline": {
      "1984-1993": { CH4: 0.15, N2O: 0.08 },
      "1994-1997": { CH4: 0.10, N2O: 0.06 },
      "1998-2000": { CH4: 0.09, N2O: 0.08 },
      "2001-2003": { CH4: 0.09, N2O: 0.06 },
      "2004-2005": { CH4: 0.09, N2O: 0.05 },
      "2006-2016": { CH4: 0.07, N2O: 0.04 },
      "2017-2024": { CH4: 0.04, N2O: 0.03 }
    },
    "Light Duty Trucks - Gasoline": {
      "1987-1993": { CH4: 0.23, N2O: 0.12 },
      "1994-1999": { CH4: 0.14, N2O: 0.09 },
      "2000-2003": { CH4: 0.13, N2O: 0.08 },
      "2004-2007": { CH4: 0.13, N2O: 0.07 },
      "2008-2012": { CH4: 0.10, N2O: 0.06 },
      "2013-2024": { CH4: 0.07, N2O: 0.04 }
    },
    "Motorcycles": {
      "1960-1995": { CH4: 0.90, N2O: 0.19 },
      "1996-2005": { CH4: 0.25, N2O: 0.09 },
      "2006-2024": { CH4: 0.09, N2O: 0.02 }
    }
  },

  // On-Road Diesel CH₄/N₂O (grams per mile) by vehicle type/year
  onRoadDieselEmissions: {
    "Heavy Duty Trucks - Diesel": {
      "1985-2006": { CH4: 0.0051, N2O: 0.0048 },
      "2007-2024": { CH4: 0.0095, N2O: 0.0431 }
    },
    "Buses": {
      "1980-2006": { CH4: 0.0050, N2O: 0.0047 },
      "2007-2024": { CH4: 0.0092, N2O: 0.0419 }
    }
  },

  // Fuel emission factors (CO2 per 1000 units, usageUnit) for the main on-road vehicle types
  fuelTypes: {
    "Motor Gasoline": {
      CO2: 8887, // kg CO2 per 1000 gallons
      usageUnit: "gallons"
    },
    "Diesel Fuel": {
      CO2: 10155, // kg CO2 per 1000 gallons
      usageUnit: "gallons"
    },
    "Residual Fuel Oil": {
      CO2: 10434,
      usageUnit: "gallons"
    },
    "Aviation Gasoline": {
      CO2: 8760,
      usageUnit: "gallons"
    },
    "Kerosene-Type Jet Fuel": {
      CO2: 9330,
      usageUnit: "gallons"
    },
    "Liquefied Petroleum Gases (LPG)": {
      CO2: 6267,
      usageUnit: "gallons"
    },
    Ethanol: {
      CO2: 5678,
      usageUnit: "gallons"
    },
    Biodiesel: {
      CO2: 9433,
      usageUnit: "gallons"
    },
    "Liquefied Natural Gas (LNG)": {
      CO2: 4274,
      usageUnit: "gallons"
    },
    "Compressed Natural Gas (CNG)": {
      CO2: 53.06,
      usageUnit: "scf"
    }
  },

  // Reference: Average fuel economy (mpg) for each vehicle type
  vehicleFuelEconomy: {
    "Passenger Cars - Gasoline": { avgMPG: 24.8, unit: "mpg" },
    "Light Duty Trucks - Gasoline": { avgMPG: 18.1, unit: "mpg" },
    "Heavy Duty Trucks - Diesel": { avgMPG: 7.9, unit: "mpg" },
    "Motorcycles": { avgMPG: 44, unit: "mpg" },
    "Buses": { avgMPG: 7.4, unit: "mpg" },
  },

  offRoadEmissions: {
    "Ships and Boats": {
      "Residual Fuel Oil": { CO2: 10434, unit: "gallons" },
      "Gasoline (2 stroke)": { CO2: 8900, unit: "gallons" },
      "Gasoline (4 stroke)": { CO2: 8800, unit: "gallons" },
      "Diesel": { CO2: 10155, unit: "gallons" }
    },
    "Locomotives": {
      "Diesel": { CO2: 10155, unit: "gallons" }
    },
    "Aircraft": {
      "Kerosene-Type Jet Fuel": { CO2: 9330, unit: "gallons" },
      "Aviation Gasoline": { CO2: 8760, unit: "gallons" }
    },
    "Agricultural Equipment": {
      "Gasoline (2 stroke)": { CO2: 8900, unit: "gallons" },
      "Gasoline (4 stroke)": { CO2: 8800, unit: "gallons" },
      "Diesel Equipment": { CO2: 10155, unit: "gallons" },
      "LPG": { CO2: 6267, unit: "gallons" }
    },
    "Construction Equipment": {
      "Gasoline (2 stroke)": { CO2: 8900, unit: "gallons" },
      "Gasoline (4 stroke)": { CO2: 8800, unit: "gallons" },
      "Diesel Equipment": { CO2: 10155, unit: "gallons" },
      "LPG": { CO2: 6267, unit: "gallons" }
    },
    "Lawn and Garden Equipment": {
      "Gasoline (2 stroke)": { CO2: 8900, unit: "gallons" },
      "Gasoline (4 stroke)": { CO2: 8800, unit: "gallons" },
      "Diesel": { CO2: 10155, unit: "gallons" },
      "LPG": { CO2: 6267, unit: "gallons" }
    },
    "Airport Equipment": {
      "Gasoline": { CO2: 8800, unit: "gallons" },
      "Diesel": { CO2: 10155, unit: "gallons" },
      "LPG": { CO2: 6267, unit: "gallons" }
    },
    "Industrial Equipment": {
      "Gasoline (2 stroke)": { CO2: 8900, unit: "gallons" },
      "Gasoline (4 stroke)": { CO2: 8800, unit: "gallons" },
      "Diesel": { CO2: 10155, unit: "gallons" },
      "LPG": { CO2: 6267, unit: "gallons" }
    },
    "Logging Equipment": {
      "Gasoline (2 stroke)": { CO2: 8900, unit: "gallons" },
      "Gasoline (4 stroke)": { CO2: 8800, unit: "gallons" },
      "Diesel": { CO2: 10155, unit: "gallons" }
    },
    "Railroad Equipment": {
      "Gasoline": { CO2: 8800, unit: "gallons" },
      "Diesel": { CO2: 10155, unit: "gallons" },
      "LPG": { CO2: 6267, unit: "gallons" }
    },
    "Recreational Equipment": {
      "Gasoline (2 stroke)": { CO2: 8900, unit: "gallons" },
      "Gasoline (4 stroke)": { CO2: 8800, unit: "gallons" },
      "Diesel": { CO2: 10155, unit: "gallons" },
      "LPG": { CO2: 6267, unit: "gallons" }
    }
  },
};


export const electricityEmissionFactors = {
  "HICC Miscellaneous": { co2: 1155.486, ch4: 0.124, n2o: 0.019 }
};

export const refrigerantGWP = {
  "HFC-32": 677,
  "HFC-125": 3170,
  "HFC-134a": 1300,
  "HFC-143a": 4470,
  "HFC-152a": 124,
  "HFC-227ea": 3220,
  "HFC-236fa": 9810,
  "PFC-CF4": 7390,
  "PFC-C2F6": 12200,
  "PFC-C3F8": 8840,
  "SF6": 23500,
  "CO2": 1,
  // Add additional gases as needed
};


export const wasteFactors = {
  "Copper Wire": {
    Landfilled: 0.02,
    Recycled: 0.18,
    Combusted: 0.01,
    unit: "metric ton"
  }
};

export const steamFactors = {
  "District Steam": 0.053,
  "District Hot Water": 0.045
};

export const businessTravelFactors = {
  "Air Travel - Short Haul": 0.15,
  "Air Travel - Long Haul": 0.11,
  "Rail": 0.04
};

export const commutingFactors = {
  "Passenger Car": 0.25,
  "Bus": 0.15,
  "Train": 0.08
};

export const upstreamTransportFactors = {
  "Truck": 0.15,
  "Rail": 0.04,
  "Ship": 0.02
};

export const purchasedGasesFactors = {
  "Carbon dioxide (CO2)": {
    baseUnit: "lb",
    co2eFactor: 1,
    units: { lb: 1, kg: 2.20462 },
  },
  "Methane (CH4)": {
    baseUnit: "lb",
    co2eFactor: 25,
    units: { lb: 1, kg: 2.20462 },
  },
  "Nitrous oxide (N2O)": {
    baseUnit: "lb",
    co2eFactor: 298,
    units: { lb: 1, kg: 2.20462 },
  },
  "HFC-23": {
    baseUnit: "lb",
    co2eFactor: 12400,
    units: { lb: 1, kg: 2.20462 },
  },
  "HFC-125": {
    baseUnit: "lb",
    co2eFactor: 3170,
    units: { lb: 1, kg: 2.20462 },
  },
  "HFC-134a": {
    baseUnit: "lb",
    co2eFactor: 1300,
    units: { lb: 1, kg: 2.20462 },
  },
  "HFC-227ea": {
    baseUnit: "lb",
    co2eFactor: 3350,
    units: { lb: 1, kg: 2.20462 },
  },
  "HFC-236fa": {
    baseUnit: "lb",
    co2eFactor: 8060,
    units: { lb: 1, kg: 2.20462 },
  },
  "PFC-14": {
    baseUnit: "lb",
    co2eFactor: 6630,
    units: { lb: 1, kg: 2.20462 },
  },
  "PFC-31-10": {
    baseUnit: "lb",
    co2eFactor: 9200,
    units: { lb: 1, kg: 2.20462 },
  },
  "Sulfur hexafluoride (SF6)": {
    baseUnit: "lb",
    co2eFactor: 23500,
    units: { lb: 1, kg: 2.20462 },
  },
  "Nitrogen trifluoride (NF3)": {
    baseUnit: "lb",
    co2eFactor: 17300,
    units: { lb: 1, kg: 2.20462 },
  },
};

export const fireSuppressionGWP = {
  "CO2": 1,
  "HFC-23": 12400,
  "HFC-125": 3170,
  "HFC-134a": 1300,
  "HFC-227ea": 3350,
  "HFC-236fa": 8060,
  "PFC-14": 6630,
  "PFC-31-10": 9200,
  "Halon 1301": 7140,
  "Halon 1211": 1890,
};


export const offsetFactors = {
  "Renewable Energy Credits": -1,
  "Carbon Offsets": -1
};
