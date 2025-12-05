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
  "ASCC Alaska Grid": { co2: 1052.1, ch4: 0.088, n2o: 0.012 },
  "ASCC Miscellaneous": { co2: 495.8, ch4: 0.023, n2o: 0.004 },
  "WECC Southwest": { co2: 776.0, ch4: 0.051, n2o: 0.007 },
  "WECC California": { co2: 497.4, ch4: 0.030, n2o: 0.004 },
  "ERCOT All": { co2: 771.1, ch4: 0.049, n2o: 0.007 },
  "FRCC All": { co2: 813.8, ch4: 0.048, n2o: 0.006 },
  "HICC Miscellaneous": { co2: 1155.5, ch4: 0.124, n2o: 0.019 },
  "HICC Oahu": { co2: 1575.4, ch4: 0.163, n2o: 0.025 },
  "MRO East": { co2: 1479.6, ch4: 0.133, n2o: 0.019 },
  "MRO West": { co2: 936.5, ch4: 0.102, n2o: 0.015 },
  "NPCC New England": { co2: 536.4, ch4: 0.063, n2o: 0.008 },
  "WECC Northwest": { co2: 602.1, ch4: 0.056, n2o: 0.008 },
  "NPCC NYC/Westchester": { co2: 885.2, ch4: 0.023, n2o: 0.003 },
  "NPCC Long Island": { co2: 1200.7, ch4: 0.135, n2o: 0.018 },
  "NPCC Upstate NY": { co2: 274.6, ch4: 0.015, n2o: 0.002 },
  "Puerto Rico Miscellaneous": { co2: 1593.5, ch4: 0.087, n2o: 0.014 },
  "RFC East": { co2: 657.4, ch4: 0.045, n2o: 0.006 },
  "RFC Michigan": { co2: 1216.4, ch4: 0.116, n2o: 0.016 },
  "RFC West": { co2: 1000.1, ch4: 0.087, n2o: 0.012 },
  "WECC Rockies": { co2: 1124.9, ch4: 0.101, n2o: 0.014 },
  "SPP North": { co2: 952.6, ch4: 0.100, n2o: 0.014 },
  "SPP South": { co2: 970.4, ch4: 0.072, n2o: 0.010 },
  "SERC Mississippi Valley": { co2: 801.0, ch4: 0.040, n2o: 0.006 },
  "SERC Midwest": { co2: 1369.9, ch4: 0.151, n2o: 0.022 },
  "SERC South": { co2: 893.3, ch4: 0.064, n2o: 0.009 },
  "SERC Tennessee Valley": { co2: 933.1, ch4: 0.082, n2o: 0.012 },
  "SERC Virginia/Carolina": { co2: 623.0, ch4: 0.047, n2o: 0.007 },
  "US Average": { co2: 823.1, ch4: 0.066, n2o: 0.009 }
};

export const wasteFactors = {
  "Aluminum Cans": {
    Recycled: 0.06,
    Landfilled: 0.02,
    Combusted: 0.01,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Aluminum Ingot": {
    Recycled: 0.04,
    Landfilled: 0.02,
    Combusted: 0.01,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Steel Cans": {
    Recycled: 0.32,
    Landfilled: 0.02,
    Combusted: 0.01,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Copper Wire": {
    Recycled: 0.18,
    Landfilled: 0.02,
    Combusted: 0.01,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Glass": {
    Recycled: 0.05,
    Landfilled: 0.02,
    Combusted: 0.01,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "HDPE": {
    Recycled: 0.21,
    Landfilled: 0.02,
    Combusted: 2.80,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "LDPE": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: 2.80,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "PET": {
    Recycled: 0.23,
    Landfilled: 0.02,
    Combusted: 2.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "LLDPE": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: 2.80,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "PP": {
    Recycled: 0.20,
    Landfilled: 0.02,
    Combusted: 2.80,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "PS": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: 3.02,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "PVC": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: 1.26,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "PLA": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: 0.01,
    Composted: 0.13,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Corrugated Containers": {
    Recycled: 0.11,
    Landfilled: 1.0,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Magazines and Third class mail": {
    Recycled: 0.02,
    Landfilled: 0.46,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Newspaper": {
    Recycled: 0.02,
    Landfilled: 0.39,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Office Paper": {
    Recycled: 0.02,
    Landfilled: 1.41,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Phonebooks": {
    Recycled: 0.04,
    Landfilled: 0.39,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Textbooks": {
    Recycled: 0.04,
    Landfilled: 1.41,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Dimensional Lumber": {
    Recycled: null,
    Landfilled: 0.17,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Medium density Fiberboard": {
    Recycled: null,
    Landfilled: 0.07,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Food Waste non meat": {
    Recycled: null,
    Landfilled: 0.67,
    Combusted: 0.05,
    Composted: 0.11,
    AnaerobicDigestionDry: 0.14,
    AnaerobicDigestionWet: 0.11
  },
  "Food Waste meat only": {
    Recycled: null,
    Landfilled: 0.69,
    Combusted: 0.05,
    Composted: 0.11,
    AnaerobicDigestionDry: 0.14,
    AnaerobicDigestionWet: 0.11
  },
  "Beef": {
    Recycled: null,
    Landfilled: 0.64,
    Combusted: 0.05,
    Composted: 0.11,
    AnaerobicDigestionDry: 0.14,
    AnaerobicDigestionWet: 0.11
  },
  "Poultry": {
    Recycled: null,
    Landfilled: 0.73,
    Combusted: 0.05,
    Composted: 0.11,
    AnaerobicDigestionDry: 0.14,
    AnaerobicDigestionWet: 0.11
  },
  "Grains": {
    Recycled: null,
    Landfilled: 2.06,
    Combusted: 0.05,
    Composted: 0.11,
    AnaerobicDigestionDry: 0.14,
    AnaerobicDigestionWet: 0.11
  },
  "Bread": {
    Recycled: null,
    Landfilled: 1.49,
    Combusted: 0.05,
    Composted: 0.11,
    AnaerobicDigestionDry: 0.14,
    AnaerobicDigestionWet: 0.11
  },
  "Fruits and Vegetables": {
    Recycled: null,
    Landfilled: 0.28,
    Combusted: 0.05,
    Composted: 0.11,
    AnaerobicDigestionDry: 0.14,
    AnaerobicDigestionWet: 0.11
  },
  "Dairy Products": {
    Recycled: null,
    Landfilled: 0.72,
    Combusted: 0.05,
    Composted: 0.11,
    AnaerobicDigestionDry: 0.14,
    AnaerobicDigestionWet: 0.11
  },
  "Yard Trimmings": {
    Recycled: null,
    Landfilled: 0.36,
    Combusted: 0.05,
    Composted: 0.14,
    AnaerobicDigestionDry: 0.11,
    AnaerobicDigestionWet: null
  },
  "Grass": {
    Recycled: null,
    Landfilled: 0.28,
    Combusted: 0.05,
    Composted: 0.14,
    AnaerobicDigestionDry: 0.09,
    AnaerobicDigestionWet: null
  },
  "Leaves": {
    Recycled: null,
    Landfilled: 0.28,
    Combusted: 0.05,
    Composted: 0.14,
    AnaerobicDigestionDry: 0.12,
    AnaerobicDigestionWet: null
  },
  "Branches": {
    Recycled: null,
    Landfilled: 0.58,
    Combusted: 0.05,
    Composted: 0.14,
    AnaerobicDigestionDry: 0.15,
    AnaerobicDigestionWet: null
  },
  "Mixed Paper general": {
    Recycled: 0.07,
    Landfilled: 0.89,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Mixed Paper primarily residential": {
    Recycled: 0.07,
    Landfilled: 0.86,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Mixed Paper primarily from offices": {
    Recycled: 0.03,
    Landfilled: 0.84,
    Combusted: 0.05,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Mixed Metals": {
    Recycled: 0.23,
    Landfilled: 0.02,
    Combusted: 0.01,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Mixed Plastics": {
    Recycled: 0.22,
    Landfilled: 0.02,
    Combusted: 2.34,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Mixed Recyclables": {
    Recycled: 0.09,
    Landfilled: 0.75,
    Combusted: 0.11,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Food Waste": {
    Recycled: null,
    Landfilled: 0.68,
    Combusted: 0.05,
    Composted: 0.11,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Mixed Organics": {
    Recycled: null,
    Landfilled: 0.54,
    Combusted: 0.05,
    Composted: 0.13,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Mixed MSW municipal solid waste": {
    Recycled: null,
    Landfilled: 0.58,
    Combusted: 0.43,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Carpet": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: 1.68,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Desktop CPUs": {
    Recycled: 0.01,
    Landfilled: 0.02,
    Combusted: 0.40,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Portable Electronic Devices": {
    Recycled: 0.02,
    Landfilled: 0.02,
    Combusted: 0.89,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Flat panel Displays": {
    Recycled: 0.02,
    Landfilled: 0.02,
    Combusted: 0.74,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "CRT Displays": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: 0.64,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Electronic Peripherals": {
    Recycled: 0.05,
    Landfilled: 0.02,
    Combusted: 2.23,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Hard copy Devices": {
    Recycled: 0.01,
    Landfilled: 0.02,
    Combusted: 1.92,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Mixed Electronics": {
    Recycled: 0.02,
    Landfilled: 0.02,
    Combusted: 0.96,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Clay Bricks": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: null,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Concrete": {
    Recycled: 0.01,
    Landfilled: 0.02,
    Combusted: null,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Fly Ash": {
    Recycled: 0.01,
    Landfilled: 0.02,
    Combusted: null,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Tires": {
    Recycled: 0.10,
    Landfilled: 0.02,
    Combusted: 2.21,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Asphalt Concrete": {
    Recycled: 0.004,
    Landfilled: 0.02,
    Combusted: null,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Asphalt Shingles": {
    Recycled: 0.03,
    Landfilled: 0.02,
    Combusted: 0.70,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Drywall": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: null,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Fiberglass Insulation": {
    Recycled: 0.05,
    Landfilled: 0.02,
    Combusted: null,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Structural Steel": {
    Recycled: 0.04,
    Landfilled: 0.02,
    Combusted: null,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Vinyl Flooring": {
    Recycled: null,
    Landfilled: 0.02,
    Combusted: 0.29,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  },
  "Wood Flooring": {
    Recycled: null,
    Landfilled: 0.18,
    Combusted: 0.08,
    Composted: null,
    AnaerobicDigestionDry: null,
    AnaerobicDigestionWet: null
  }
}

export const steamFactors = {
  "District Steam": 0.053,
  "District Hot Water": 0.045
};

export const businessTravelFactors = {
  // Vehicle-miles (e.g., personal car, rental, taxi)
  "Passenger Car": {
    co2: 0.306,  // kg CO2/vehicle-mile
    ch4: 0.009, // g CH4/vehicle-mile  
    n2o: 0.006   // g N2O/vehicle-mile
  },
  "Light-Duty Truck": {
    co2: 0.405,  // kg CO2/vehicle-mile
    ch4: 0.011, // g CH4/vehicle-mile
    n2o: 0.010   // g N2O/vehicle-mile
  },
  "Motorcycle": {
    co2: 0.376,  // kg CO2/vehicle-mile
    ch4: 0.091,  // g CH4/vehicle-mile
    n2o: 0.019   // g N2O/vehicle-mile
  },

  // Passenger-miles (e.g., rail, bus)
  "Intercity Rail - Northeast Corridor": {
    co2: 0.058,  // kg CO2/passenger-mile
    ch4: 0.0055,  // g CH4/passenger-mile
    n2o: 0.0007   // g N2O/passenger-mile
  },
  "Intercity Rail - Other Routes": {
    co2: 0.150,  // kg CO2/passenger-mile
    ch4: 0.0117,  // g CH4/passenger-mile
    n2o: 0.0038   // g N2O/passenger-mile
  },
  "Intercity Rail - National Average": {
    co2: 0.113,  // kg CO2/passenger-mile
    ch4: 0.0092,  // g CH4/passenger-mile
    n2o: 0.0026   // g N2O/passenger-mile
  },
  "Commuter Rail": {
    co2: 0.133,  // kg CO2/passenger-mile
    ch4: 0.0105, // g CH4/passenger-mile
    n2o: 0.0026   // g N2O/passenger-mile
  },
  "Transit Rail (Subway/Tram)": {
    co2: 0.093,  // kg CO2/passenger-mile
    ch4: 0.0075,  // g CH4/passenger-mile
    n2o: 0.001   // g N2O/passenger-mile
  },
  "Bus": {
    co2: 0.071,  // kg CO2/passenger-mile
    ch4: 0.005,  // g CH4/passenger-mile
    n2o: 0.0021   // g N2O/passenger-mile
  },

  // Passenger-miles (air, no radiative forcing multiplier)
  "Air - Short Haul (<300 miles)": {
    co2: 0.207,  // kg CO2/passenger-mile
    ch4: 0.0064,  // g CH4/passenger-mile
    n2o: 0.0066   // g N2O/passenger-mile
  },
  "Air - Medium Haul (300-2300 miles)": {
    co2: 0.129,  // kg CO2/passenger-mile
    ch4: 0.0006, // g CH4/passenger-mile
    n2o: 0.0041   // g N2O/passenger-mile
  },
  "Air - Long Haul (>2300 miles)": {
    co2: 0.163,  // kg CO2/passenger-mile
    ch4: 0.0006,  // g CH4/passenger-mile
    n2o: 0.0052   // g N2O/passenger-mile
  }
};

export const isPassengerMileMode = (mode) => {
  return ["Intercity Rail", "Commuter Rail", "Transit Rail", "Bus", "Air"].some((prefix) =>
    mode.startsWith(prefix)
  );
};

export const commutingFactors = {
  // Vehicle-miles (e.g., personal car, rental, taxi)
  "Passenger Car": {
    co2: 0.306,  // kg CO2/vehicle-mile
    ch4: 0.009, // g CH4/vehicle-mile  
    n2o: 0.006   // g N2O/vehicle-mile
  },
  "Light-Duty Truck": {
    co2: 0.405,  // kg CO2/vehicle-mile
    ch4: 0.011, // g CH4/vehicle-mile
    n2o: 0.010   // g N2O/vehicle-mile
  },
  "Motorcycle": {
    co2: 0.376,  // kg CO2/vehicle-mile
    ch4: 0.091,  // g CH4/vehicle-mile
    n2o: 0.019   // g N2O/vehicle-mile
  },

  // Passenger-miles (e.g., rail, bus)
  "Intercity Rail - Northeast Corridor": {
    co2: 0.058,  // kg CO2/passenger-mile
    ch4: 0.0055,  // g CH4/passenger-mile
    n2o: 0.0007   // g N2O/passenger-mile
  },
  "Intercity Rail - Other Routes": {
    co2: 0.150,  // kg CO2/passenger-mile
    ch4: 0.0117,  // g CH4/passenger-mile
    n2o: 0.0038   // g N2O/passenger-mile
  },
  "Intercity Rail - National Average": {
    co2: 0.113,  // kg CO2/passenger-mile
    ch4: 0.0092,  // g CH4/passenger-mile
    n2o: 0.0026   // g N2O/passenger-mile
  },
  "Commuter Rail": {
    co2: 0.133,  // kg CO2/passenger-mile
    ch4: 0.0105, // g CH4/passenger-mile
    n2o: 0.0026   // g N2O/passenger-mile
  },
  "Transit Rail (Subway/Tram)": {
    co2: 0.093,  // kg CO2/passenger-mile
    ch4: 0.0075,  // g CH4/passenger-mile
    n2o: 0.001   // g N2O/passenger-mile
  },
  "Bus": {
    co2: 0.071,  // kg CO2/passenger-mile
    ch4: 0.005,  // g CH4/passenger-mile
    n2o: 0.0021   // g N2O/passenger-mile
  },
};

export const upstreamTransportFactors = {
  // On-road by vehicle-mile (full truckload, etc.)
  "Medium- and Heavy-Duty Truck (vm)": {
    basis: "vehicle-mile",     // activity in miles
    co2: 1.360,                
    ch4: 0.012,                
    n2o: 0.038                 
  },
  "Passenger Car": {
    basis: "vehicle-mile",
    co2: 0.306,               
    ch4: 0.009,                
    n2o: 0.006                
  },
  "Light-Duty Truck": {
    basis: "vehicle-mile",
    co2: 0.405,                
    ch4: 0.011,               
    n2o: 0.010                 
  },

  "Medium- and Heavy-Duty Truck (tm)": {
    basis: "ton-mile",        
    co2: 0.168,               
    ch4: 0.0015,               
    n2o: 0.0047              
  },
  "Rail": {
    basis: "ton-mile",
    co2: 0.022,          
    ch4: 0.0017,               
    n2o: 0.0005               
  },
  "Waterborne Craft": {
    basis: "ton-mile",
    co2: 0.082,                
    ch4: 0.0326,               
    n2o: 0.0021                
  },
  "Aircraft": {
    basis: "ton-mile",
    co2: 0.905,                
    ch4: 0,                    
    n2o: 0.0279                
  }
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
