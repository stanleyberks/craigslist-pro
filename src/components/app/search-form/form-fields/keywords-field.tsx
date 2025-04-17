import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AlertFormValues } from "@/lib/schemas/alert-schema";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface KeywordsFieldProps {
  form: UseFormReturn<AlertFormValues>;
}

export function KeywordsField({ form }: KeywordsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="keywords"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <div className="flex items-center gap-2">
            <FormLabel>Keywords</FormLabel>
            <HoverCard openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">Keyword Tips</h4>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li>Use specific terms for better matches</li>
                    <li>Separate multiple keywords with commas</li>
                    <li>Include variations (e.g., "bike, bicycle")</li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <FormControl>
            <Input 
              placeholder="vintage bike, macbook pro" 
              {...field} 
              aria-describedby={`${field.name}-description`}
            />
          </FormControl>
          <FormDescription id={`${field.name}-description`}>
            Enter keywords to search for. Separate multiple keywords with commas.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
