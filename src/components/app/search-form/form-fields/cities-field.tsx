import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";
import { AlertFormValues } from "@/lib/schemas/alert-schema";
import { cities } from "@/data/cities";

interface CitiesFieldProps {
  form: UseFormReturn<AlertFormValues>;
}

export function CitiesField({ form }: CitiesFieldProps) {
  return (
    <FormField
      control={form.control}
      name="cities"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cities</FormLabel>
          <FormControl>
            <MultiSelect
              options={cities}
              selected={field.value}
              onChange={(values) => {
                if (values.length <= 5) {
                  field.onChange(values);
                }
              }}
              placeholder="Select cities..."
            />
          </FormControl>
          <FormDescription>
            Select up to 5 cities to search in.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
