import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AlertFormValues } from "@/lib/schemas/alert-schema";
import { ChangeEvent } from "react";

interface PriceFieldsProps {
  form: UseFormReturn<AlertFormValues>;
}

export function PriceFields({ form }: PriceFieldsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="min_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="0"
                min="0"
                value={field.value?.toString() ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value === '' ? null : Number(e.target.value);
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
                name={field.name}
              />
            </FormControl>
            <FormDescription>
              Optional: Set a minimum price filter.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="max_price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Price</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Any"
                min="0"
                value={field.value?.toString() ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value === '' ? null : Number(e.target.value);
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
                name={field.name}
              />
            </FormControl>
            <FormDescription>
              Optional: Set a maximum price filter.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
