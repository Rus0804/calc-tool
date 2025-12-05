export const mass = {
  'pounds (lb)': {
    'kilogram (kg)': 0.453592,
    'metric ton': 0.000453592,
    'short ton': 0.0005,
    'gram (g)': 453.592,
  },
  'kilogram (kg)': {
    'pounds (lb)': 2.20462,
    'gram (g)': 1000,
    'metric ton': 0.001,
    'short ton': 0.00110231
  },
  'metric ton': {
    'kilogram (kg)': 1000,
    'pounds (lb)': 2204.62,
    'short ton': 1.10231,
    'gram (g)': 1000000,
  },
  'short ton': {
    'kilogram (kg)': 907.18474,
    'pounds (lb)': 2000,
    'metric ton': 0.90718474,
    'gram (g)': 907184.74
  },
  'gram (g)': {
    'kilogram (kg)': 0.001,
    'pounds (lb)': 0.00220462,
    'metric ton': 0.000001,
    'short ton': 0.00000110231,
  }
};

export const volume = {
  'gallon (gal, US)': {
    'liter (L)': 3.78541,
    'barrel (bbl)': 0.0238095,
    'cubic meter (m3)': 0.00378541253,
    'standard cubic foot (scf)': 0.13368047619,
    'cubic foot (ft3)': 0.13368047619,
  },
  'liter (L)': {
    'gallon (gal, US)': 0.264172,
    'barrel (bbl)' : 0.00628982243,
    'cubic meter (m3)': 0.001,
    'standard cubic foot (scf)': 0.03531472482,
    'cubic foot (ft3)': 0.03531472482
  },
  'barrel (bbl)': {
    'gallon (gal, US)': 42,
    'liter (L)': 158.987,
    'cubic meter (m3)': 0.158987,
    'standard cubic foot (scf)': 5.61458,
    'cubic foot (ft3)': 5.61458
  },
  'cubic meter (m3)': {
    'liter (L)': 1000,
    'gallon (gal, US)': 264.172,
    'barrel (bbl)': 6.28981,
    'standard cubic foot (scf)': 35.3147248277,
    'cubic foot': 35.3147248277,
  },
  'standard cubic foot (scf)': {
    'cubic foot (ft3)': 1,
    'cubic meter (m3)': 0.0283168,
    'liter (L)': 28.3168,
    'gallon (gal, US)': 7.48052392164,
    'barrel (bbl)': 0.17810771242
  },
  'cubic foot (ft3)': {
    'standard cubic foot (scf)': 1,
    'cubic meter (m3)': 0.0283168,
    'liter (L)': 28.3168,
    'gallon (gal, US)': 7.48052392164,
    'barrel (bbl)': 0.17810771242
  }
};

export const energy = {
  'Btu': {
    'kilojoule (kJ)': 1.05506,
    'megajoule (MJ)': 0.00105506,
    'million Btu (MMBtu)': 1e-6,
    'therm': 9.4804e-6
  },
  'kilojoule (kJ)': {
    'Btu': 0.947817,
    'megajoule (MJ)': 0.001,
    'calorie (cal)': 239.006
  },
  'megajoule (MJ)': {
    'kilojoule (kJ)': 1000,
    'Btu': 947.817,
    'therm': 0.0094804
  },
  'million Btu (MMBtu)': {
    'Btu': 1000000
  },
  'therm': {
    'Btu': 100000,
    'million Btu (MMBtu)': 0.1
  }
};

export const distance = {
  'mile (mi)': {
    'kilometer (km)': 1.60934,
    'meter (m)': 1609.34
  },
  'kilometer (km)': {
    'mile (mi)': 0.621371,
    'meter (m)': 1000
  },
  'meter (m)': {
    'kilometer (km)': 0.001,
    'mile (mi)': 0.000621371
  }
};

export const others = {
  'hours (hr)': {
    'seconds (s)': 3600,
    'minutes (min)': 60
  },
  'seconds (s)': {
    'hours (hr)': 0.000277778,
    'minutes (min)': 0.0166667
  },
  'minutes (min)': {
    'hours (hr)': 0.0166667,
    'seconds (s)': 60
  }
};

// Unit conversion function
export function convertUnit(value, fromUnit, toUnit) {
  // If units are the same, return original value
  if (fromUnit === toUnit) return value;
  
  // Check mass conversions
  if (mass[fromUnit] && mass[fromUnit][toUnit]) {
    return value * mass[fromUnit][toUnit];
  }
  
  // Check volume conversions
  if (volume[fromUnit] && volume[fromUnit][toUnit]) {
    return value * volume[fromUnit][toUnit];
  }
  
  // Check energy conversions
  if (energy[fromUnit] && energy[fromUnit][toUnit]) {
    return value * energy[fromUnit][toUnit];
  }
  
  // If no conversion found, return original value
  console.warn(`No conversion available from ${fromUnit} to ${toUnit}`);
  return value;
}

// Unit options for each fuel category
export const fuelUnitOptions = {
  solid: ['short ton', 'metric ton', 'pounds (lb)', 'kilogram (kg)', 'gram (g)'],
  gas: ['standard cubic foot (scf)', 'cubic foot (ft3)', 'cubic meter (m3)', 'liter (L)'],
  liquid: ['gallon (gal, US)', 'liter (L)', 'barrel (bbl)']
};

// Map fuel types to categories
export const fuelTypeCategoryMap = {
  // Solid fuels
  "Anthracite Coal": 'solid',
  "Bituminous Coal": 'solid',
  "Sub-bituminous Coal": 'solid',
  "Lignite Coal": 'solid',
  "Mixed Commercial Coal": 'solid',
  "Mixed Electric Power Coal": 'solid',
  "Mixed Industrial Coal": 'solid',
  "Mixed Industrial Coking Coal": 'solid',
  "Coal Coke": 'solid',
  "Municipal Solid Waste": 'solid',
  "Petroleum Coke Solid": 'solid',
  "Plastics": 'solid',
  "Tires": 'solid',
  "Agricultural Byproducts": 'solid',
  "Peat": 'solid',
  "Solid Byproducts": 'solid',
  "Wood and Wood Residuals": 'solid',
  
  // Gaseous fuels
  "Natural Gas": 'gas',
  "Propane Gas": 'gas',
  "Landfill Gas": 'gas',
  
  // Liquid fuels
  "Distillate Fuel Oil No. 2": 'liquid',
  "Residual Fuel Oil No. 6": 'liquid',
  "Kerosene": 'liquid',
  "Liquefied Petroleum Gases LPG": 'liquid',
  "Biodiesel 100": 'liquid',
  "Ethanol 100": 'liquid',
  "Rendered Animal Fat": 'liquid',
  "Vegetable Oil": 'liquid'
};
