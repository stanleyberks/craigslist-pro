import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { UseFormReturn } from "react-hook-form";
import { AlertFormValues } from "@/lib/schemas/alert-schema";
import { categories } from "@/lib/categories";

interface CategoryFieldProps {
  form: UseFormReturn<AlertFormValues>;
}

export function CategoryField({ form }: CategoryFieldProps) {
  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl>
            <Combobox
              options={categories}
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select a category..."
              searchPlaceholder="Search categories..."
              emptyMessage="No categories found."
              multiple={false}
              groupByRegion={true}
            />
          </FormControl>
          <FormDescription>
            Choose a category to narrow down your search.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
