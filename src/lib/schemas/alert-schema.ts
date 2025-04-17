import * as z from "zod";
import { cities } from "@/data/cities";
import { categories } from "@/lib/categories";

export const alertFormSchema = z.object({
  // Honeypot fields
  website: z.string().max(0, { message: 'This field should be empty' }).optional(),
  email2: z.string().max(0, { message: 'This field should be empty' }).optional(),
  _gotcha: z.string().max(0, { message: 'This field should be empty' }).optional(),
  
  // Form fields
  name: z.string().min(2, {
    message: "Alert name must be at least 2 characters.",
  }).max(50, {
    message: "Alert name cannot be longer than 50 characters.",
  }),
  keywords: z.string().min(2, {
    message: "Keywords must be at least 2 characters.",
  }).max(200, {
    message: "Keywords cannot be longer than 200 characters.",
  }).refine((val) => val.split(',').length <= 10, {
    message: "You can only specify up to 10 keywords.",
  }),
  cities: z.array(z.string().refine((val) => cities.some(city => city.value === val), {
    message: "Invalid city selected.",
  })).min(1, {
    message: "Select at least one city.",
  }).max(5, {
    message: "You can only select up to 5 cities.",
  }),
  category: z.string().refine((val) => categories.some(cat => cat.value === val), {
    message: "Invalid category selected.",
  }),
  min_price: z.number().nullable(),
  max_price: z.number().nullable()
}).refine((data) => {
  const { min_price, max_price } = data;
  if (!min_price || !max_price) return true;
  return max_price >= min_price;
}, {
  message: "Maximum price must be greater than minimum price."
});

export type AlertFormValues = z.infer<typeof alertFormSchema>;
