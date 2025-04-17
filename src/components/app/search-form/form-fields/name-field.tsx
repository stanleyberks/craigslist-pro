import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AlertFormValues } from "@/lib/schemas/alert-schema";

interface NameFieldProps {
  form: UseFormReturn<AlertFormValues>;
}

export function NameField({ form }: NameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Alert Name</FormLabel>
          <FormControl>
            <Input placeholder="My Alert" {...field} />
          </FormControl>
          <FormDescription>
            Give your alert a descriptive name.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
