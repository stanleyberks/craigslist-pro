export interface Category {
  value: string
  label: string
  section: string
  code: string
}

export const categories: Category[] = [
  // For Sale
  { value: "antiques", label: "Antiques", section: "For Sale", code: "ata" },
  { value: "appliances", label: "Appliances", section: "For Sale", code: "ppa" },
  { value: "arts-crafts", label: "Arts & Crafts", section: "For Sale", code: "ara" },
  { value: "auto-parts", label: "Auto Parts", section: "For Sale", code: "pta" },
  { value: "baby-kids", label: "Baby & Kid", section: "For Sale", code: "baa" },
  { value: "beauty-hlth", label: "Beauty & Health", section: "For Sale", code: "haa" },
  { value: "bikes", label: "Bikes", section: "For Sale", code: "bia" },
  { value: "boats", label: "Boats", section: "For Sale", code: "boo" },
  { value: "books", label: "Books", section: "For Sale", code: "bka" },
  { value: "cars-trucks", label: "Cars & Trucks", section: "For Sale", code: "cta" },
  { value: "electronics", label: "Electronics", section: "For Sale", code: "ela" },
  { value: "furniture", label: "Furniture", section: "For Sale", code: "fua" },
  
  // Housing
  { value: "apts-housing", label: "Apartments & Housing", section: "Housing", code: "apa" },
  { value: "rooms", label: "Rooms & Shares", section: "Housing", code: "roo" },
  { value: "sublets", label: "Sublets & Temporary", section: "Housing", code: "sub" },
  { value: "vacation-rentals", label: "Vacation Rentals", section: "Housing", code: "vac" },
  { value: "parking-storage", label: "Parking & Storage", section: "Housing", code: "prk" },
  { value: "office-commercial", label: "Office & Commercial", section: "Housing", code: "off" },
  { value: "real-estate", label: "Real Estate For Sale", section: "Housing", code: "rea" },

  // Jobs
  { value: "accounting", label: "Accounting & Finance", section: "Jobs", code: "acc" },
  { value: "admin", label: "Admin & Office", section: "Jobs", code: "ofc" },
  { value: "arch-engineering", label: "Architect & Engineering", section: "Jobs", code: "egr" },
  { value: "art-media-design", label: "Art & Media", section: "Jobs", code: "med" },
  { value: "biotech-science", label: "Biotech & Science", section: "Jobs", code: "sci" },
  { value: "business", label: "Business & Mgmt", section: "Jobs", code: "bus" },
  { value: "customer-service", label: "Customer Service", section: "Jobs", code: "csr" },
  { value: "education", label: "Education", section: "Jobs", code: "edu" },
  { value: "food-bev-hosp", label: "Food & Hospitality", section: "Jobs", code: "fbh" },
  { value: "general-labor", label: "General Labor", section: "Jobs", code: "lab" },
  { value: "government", label: "Government", section: "Jobs", code: "gov" },
  { value: "healthcare", label: "Healthcare", section: "Jobs", code: "hea" },
  { value: "legal", label: "Legal", section: "Jobs", code: "lgl" },
  { value: "manufacturing", label: "Manufacturing", section: "Jobs", code: "mnu" },
  { value: "marketing", label: "Marketing & PR", section: "Jobs", code: "mar" },
  { value: "nonprofit", label: "Nonprofit", section: "Jobs", code: "npo" },
  { value: "real-estate-jobs", label: "Real Estate", section: "Jobs", code: "rej" },
  { value: "retail", label: "Retail", section: "Jobs", code: "ret" },
  { value: "sales", label: "Sales", section: "Jobs", code: "sls" },
  { value: "salon-spa-fitness", label: "Salon & Spa", section: "Jobs", code: "spa" },
  { value: "security", label: "Security", section: "Jobs", code: "sec" },
  { value: "skilled-trades", label: "Skilled Trades", section: "Jobs", code: "trd" },
  { value: "software", label: "Software & QA", section: "Jobs", code: "sof" },
  { value: "systems-network", label: "Systems & Network", section: "Jobs", code: "sad" },
  { value: "technical-support", label: "Technical Support", section: "Jobs", code: "tch" },
  { value: "transport", label: "Transport", section: "Jobs", code: "trp" },
  { value: "tv-film-video", label: "TV, Film, & Video", section: "Jobs", code: "tfr" },
  { value: "web-html-info-design", label: "Web & Info Design", section: "Jobs", code: "web" },
  { value: "writing-editing", label: "Writing & Editing", section: "Jobs", code: "wri" },

  // Services
  { value: "automotive", label: "Automotive", section: "Services", code: "aos" },
  { value: "beauty", label: "Beauty", section: "Services", code: "bts" },
  { value: "computer", label: "Computer", section: "Services", code: "cps" },
  { value: "creative", label: "Creative", section: "Services", code: "crs" },
  { value: "event", label: "Event", section: "Services", code: "evs" },
  { value: "financial", label: "Financial", section: "Services", code: "fns" },
  { value: "legal", label: "Legal", section: "Services", code: "lgs" },
  { value: "lessons", label: "Lessons", section: "Services", code: "lss" },
  { value: "pet", label: "Pet", section: "Services", code: "pts" },
] as const;

export type CategoryKey = typeof categories[number]["value"];

export function getCategoryCode(category: CategoryKey): string {
  return categories.find(c => c.value === category)?.code || category;
}
