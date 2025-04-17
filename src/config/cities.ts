export const SUPPORTED_CITIES = [
  { value: "newyork", label: "New York", region: "nyc" },
  { value: "sfbay", label: "San Francisco Bay Area", region: "sfo" },
  { value: "seattle", label: "Seattle", region: "sea" },
  { value: "portland", label: "Portland", region: "pdx" },
  { value: "boston", label: "Boston", region: "bos" },
  { value: "chicago", label: "Chicago", region: "chi" },
  { value: "miami", label: "Miami", region: "mia" },
  { value: "austin", label: "Austin", region: "atx" },
  { value: "denver", label: "Denver", region: "den" },
] as const;

export type SupportedCity = typeof SUPPORTED_CITIES[number];
export type CityValue = SupportedCity["value"];
export type CityRegion = SupportedCity["region"];
