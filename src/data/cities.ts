export interface CityOption {
  value: string;
  label: string;
  region: string;
}

interface City {
  value: string;
  label: string;
  region: string;
  state?: string;
  stateCode?: string;
  aliases?: string[];
}

export const cities: City[] = [
  // Northeast US
  { value: "newyork", label: "New York", region: "Northeast", state: "New York", stateCode: "NY", aliases: ["NYC", "New York City", "Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"] },
  { value: "boston", label: "Boston", region: "Northeast", state: "Massachusetts", stateCode: "MA" },
  { value: "philadelphia", label: "Philadelphia", region: "Northeast", state: "Pennsylvania", stateCode: "PA", aliases: ["Philly"] },
  { value: "washingtondc", label: "Washington DC", region: "Northeast", state: "District of Columbia", stateCode: "DC", aliases: ["DC", "Washington"] },
  { value: "baltimore", label: "Baltimore", region: "Northeast", state: "Maryland", stateCode: "MD" },
  { value: "pittsburgh", label: "Pittsburgh", region: "Northeast", state: "Pennsylvania", stateCode: "PA" },
  { value: "buffalo", label: "Buffalo", region: "Northeast", state: "New York", stateCode: "NY" },
  { value: "albany", label: "Albany", region: "Northeast", state: "New York", stateCode: "NY" },

  // Midwest US
  { value: "chicago", label: "Chicago", region: "Midwest", state: "Illinois", stateCode: "IL", aliases: ["Chi-town", "Windy City"] },
  { value: "detroit", label: "Detroit", region: "Midwest", state: "Michigan", stateCode: "MI", aliases: ["Motor City"] },
  { value: "cleveland", label: "Cleveland", region: "Midwest", state: "Ohio", stateCode: "OH" },
  { value: "minneapolis", label: "Minneapolis", region: "Midwest", state: "Minnesota", stateCode: "MN", aliases: ["Twin Cities", "Minneapolis-St. Paul"] },
  { value: "milwaukee", label: "Milwaukee", region: "Midwest", state: "Wisconsin", stateCode: "WI" },
  { value: "stlouis", label: "St. Louis", region: "Midwest", state: "Missouri", stateCode: "MO" },
  { value: "cincinnati", label: "Cincinnati", region: "Midwest", state: "Ohio", stateCode: "OH" },
  { value: "indianapolis", label: "Indianapolis", region: "Midwest", state: "Indiana", stateCode: "IN", aliases: ["Indy"] },

  // South US
  { value: "atlanta", label: "Atlanta", region: "South", state: "Georgia", stateCode: "GA", aliases: ["ATL"] },
  { value: "miami", label: "Miami", region: "South", state: "Florida", stateCode: "FL", aliases: ["South Florida", "Miami-Dade"] },
  { value: "dallas", label: "Dallas", region: "South", state: "Texas", stateCode: "TX", aliases: ["DFW", "Dallas-Fort Worth"] },
  { value: "houston", label: "Houston", region: "South", state: "Texas", stateCode: "TX", aliases: ["HTX"] },
  { value: "austin", label: "Austin", region: "South", state: "Texas", stateCode: "TX", aliases: ["ATX"] },
  { value: "nashville", label: "Nashville", region: "South", state: "Tennessee", stateCode: "TN", aliases: ["Music City"] },
  { value: "charlotte", label: "Charlotte", region: "South", state: "North Carolina", stateCode: "NC", aliases: ["CLT"] },
  { value: "neworleans", label: "New Orleans", region: "South", state: "Louisiana", stateCode: "LA", aliases: ["NOLA"] },
  { value: "tampa", label: "Tampa", region: "South", state: "Florida", stateCode: "FL", aliases: ["Tampa Bay"] },
  { value: "orlando", label: "Orlando", region: "South", state: "Florida", stateCode: "FL" },

  // West Coast US
  { value: "sfbay", label: "San Francisco", region: "West Coast", state: "California", stateCode: "CA", aliases: ["SF", "Bay Area", "Silicon Valley", "San Francisco Bay Area"] },
  { value: "losangeles", label: "Los Angeles", region: "West Coast", state: "California", stateCode: "CA", aliases: ["LA", "LAX", "SoCal"] },
  { value: "seattle", label: "Seattle", region: "West Coast", state: "Washington", stateCode: "WA", aliases: ["SEA", "Emerald City"] },
  { value: "portland", label: "Portland", region: "West Coast", state: "Oregon", stateCode: "OR", aliases: ["PDX"] },
  { value: "sacramento", label: "Sacramento", region: "West Coast", state: "California", stateCode: "CA", aliases: ["Sac"] },
  { value: "sandiego", label: "San Diego", region: "West Coast", state: "California", stateCode: "CA", aliases: ["SD"] },
  { value: "sanjose", label: "San Jose", region: "West Coast", state: "California", stateCode: "CA" },
  { value: "fresno", label: "Fresno", region: "West Coast", state: "California", stateCode: "CA" },

  // Southwest US
  { value: "phoenix", label: "Phoenix", region: "Southwest", state: "Arizona", stateCode: "AZ", aliases: ["PHX", "Valley of the Sun"] },
  { value: "lasvegas", label: "Las Vegas", region: "Southwest", state: "Nevada", stateCode: "NV", aliases: ["Vegas", "LAS"] },
  { value: "albuquerque", label: "Albuquerque", region: "Southwest", state: "New Mexico", stateCode: "NM", aliases: ["ABQ"] },
  { value: "tucson", label: "Tucson", region: "Southwest", state: "Arizona", stateCode: "AZ" },
  { value: "elpaso", label: "El Paso", region: "Southwest", state: "Texas", stateCode: "TX" },

  // Mountain US
  { value: "denver", label: "Denver", region: "Mountain", state: "Colorado", stateCode: "CO", aliases: ["Mile High City", "DEN"] },
  { value: "saltlakecity", label: "Salt Lake City", region: "Mountain", state: "Utah", stateCode: "UT", aliases: ["SLC"] },
  { value: "boise", label: "Boise", region: "Mountain", state: "Idaho", stateCode: "ID" },
  { value: "coloradosprings", label: "Colorado Springs", region: "Mountain", state: "Colorado", stateCode: "CO" },

  // Canadian Major Cities
  { value: "toronto", label: "Toronto", region: "Canada East", state: "Ontario", aliases: ["GTA", "Greater Toronto Area"] },
  { value: "montreal", label: "Montreal", region: "Canada East", state: "Quebec", aliases: ["MTL"] },
  { value: "ottawa", label: "Ottawa", region: "Canada East", state: "Ontario", aliases: ["YOW"] },
  { value: "calgary", label: "Calgary", region: "Canada West" },
  { value: "edmonton", label: "Edmonton", region: "Canada West" },
  { value: "winnipeg", label: "Winnipeg", region: "Canada Central" },
  { value: "vancouver", label: "Vancouver", region: "Canada West" }
];
