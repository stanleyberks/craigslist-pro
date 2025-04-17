"use client";
import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAlerts } from "@/hooks/use-alerts";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { cities } from "@/data/cities";
const categories = [
    { value: "gigs", label: "Gigs" },
    { value: "jobs", label: "Jobs" },
    { value: "housing", label: "Housing" },
    { value: "for-sale", label: "For Sale" },
    { value: "services", label: "Services" },
    { value: "community", label: "Community" },
    { value: "resumes", label: "Resumes" },
    { value: "events", label: "Events" },
];
const formSchema = z.object({
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
});
export function SearchForm() {
    const { createAlert } = useAlerts();
    const { subscription, canCreateAlert } = useSubscription();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            keywords: "",
            cities: [],
            category: "",
        },
    });
    async function onSubmit(values) {
        if (!canCreateAlert()) {
            toast({
                title: "Alert Limit Reached",
                description: "Upgrade your plan to create more alerts.",
                variant: "destructive",
            });
            return;
        }
        try {
            setIsSubmitting(true);
            // Clean up keywords
            const cleanKeywords = values.keywords
                .split(',')
                .map(k => k.trim())
                .filter(k => k.length > 0)
                .join(', ');
            // Normalize cities
            const response = await fetch('/api/cities/normalize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cities: values.cities }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to normalize cities');
            }
            const { allMatches: normalizedCities } = await response.json();
            if (normalizedCities.length === 0) {
                throw new Error('No valid cities found. Please check your city selections.');
            }
            // Create alert with normalized cities
            await createAlert({
                ...values,
                keywords: cleanKeywords,
                cities: normalizedCities,
                user_id: "", // This will be set by the server
                is_active: true,
            });
            form.reset();
            toast({
                title: "Alert Created",
                description: `Alert created for ${normalizedCities.length} ${normalizedCities.length === 1 ? 'city' : 'cities'}. We'll notify you when new matches are found.`,
            });
        }
        catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create alert. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    }
    return (<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem>
              <FormLabel>Alert Name</FormLabel>
              <FormControl>
                <Input placeholder="NYC Camera Gear" {...field}/>
              </FormControl>
              <FormDescription>
                A name to help you identify this alert.
              </FormDescription>
              <FormMessage />
            </FormItem>)}/>
        <FormField control={form.control} name="keywords" render={({ field }) => (<FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input placeholder="vintage bike, macbook pro" {...field}/>
              </FormControl>
              <FormDescription>
                Enter keywords to search for. Separate multiple keywords with commas.
              </FormDescription>
              <FormMessage />
            </FormItem>)}/>
        <FormField control={form.control} name="cities" render={({ field }) => (<FormItem>
              <FormLabel>Cities</FormLabel>
              <FormControl>
                <MultiSelect options={cities} selected={field.value} onChange={field.onChange} placeholder="Select cities..."/>
              </FormControl>
              <FormDescription>
                Select one or more cities to search in.
              </FormDescription>
              <FormMessage />
            </FormItem>)}/>
        <FormField control={form.control} name="category" render={({ field }) => (<FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Combobox options={categories} value={field.value} onValueChange={field.onChange} placeholder="Select a category..."/>
              </FormControl>
              <FormDescription>
                Choose a category to narrow down your search.
              </FormDescription>
              <FormMessage />
            </FormItem>)}/>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (<>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Creating Alert...
            </>) : ("Create Alert")}
        </Button>
      </form>
    </Form>);
}
