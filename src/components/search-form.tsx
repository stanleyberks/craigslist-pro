"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import { SUPPORTED_CITIES, type SupportedCity } from "@/config/cities";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MultiCitySelector } from "@/components/ui/multi-city-selector"
import { useToast } from "./ui/use-toast"

// Craigslist categories
const categories = [
  { value: "all", label: "All Categories" },
  { value: "for-sale", label: "For Sale" },
  { value: "housing", label: "Housing" },
  { value: "jobs", label: "Jobs" },
  { value: "services", label: "Services" },
  { value: "community", label: "Community" },
  { value: "events", label: "Events" },
] as const

const searchFormSchema = z.object({
  name: z.string().min(1, "Alert name is required"),
  keywords: z.string().min(1, "Keywords are required"),
  cities: z.array(z.custom<SupportedCity>((val) => {
    return SUPPORTED_CITIES.some(city => 
      city.value === (val as SupportedCity).value && 
      city.region === (val as SupportedCity).region
    );
  }, "Invalid city selection")).min(1, "At least one city is required"),
  category: z.enum(["all", "for-sale", "housing", "jobs", "services", "community", "events"]),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

interface SearchFormProps {
  onSubmit: (data: SearchFormValues) => Promise<void>
  defaultValues?: Partial<SearchFormValues>
}

export function SearchForm({ onSubmit, defaultValues }: SearchFormProps) {
  const { toast } = useToast()
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      name: "",
      keywords: "",
      cities: [],
      category: "all",
      minPrice: "",
      maxPrice: "",
      ...defaultValues
    },
  })

  async function handleSubmit(data: SearchFormValues) {
    try {
      await onSubmit(data)
      form.reset()
      toast({
        title: "Alert created",
        description: "Your alert has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., NYC Vintage Bikes" {...field} />
              </FormControl>
              <FormDescription>
                A name to help you identify this alert
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input placeholder="e.g., vintage bike, schwinn" {...field} />
              </FormControl>
              <FormDescription>
                Enter keywords to search for, separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cities</FormLabel>
              <FormControl>
                <MultiCitySelector
                  selectedCities={field.value}
                  onChange={field.onChange}
                  maxSelections={5}
                />
              </FormControl>
              <FormDescription>
                Select up to 5 cities to search in
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a category to narrow your search
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="minPrice"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Min Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxPrice"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Max Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Any" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Create Alert</Button>
      </form>
    </Form>
  )
}
