import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { SUPPORTED_CITIES, type SupportedCity } from "@/config/cities";

interface MultiCitySelectorProps {
  selectedCities: SupportedCity[];
  onChange: (value: SupportedCity[]) => void;
  maxSelections?: number;
}

export function MultiCitySelector({
  selectedCities,
  onChange,
  maxSelections = 5,
}: MultiCitySelectorProps) {
  const [open, setOpen] = React.useState(false);

  const toggleCity = (city: SupportedCity) => {
    const isSelected = selectedCities.some((c) => c.value === city.value);
    if (isSelected) {
      onChange(selectedCities.filter((c) => c.value !== city.value));
    } else if (selectedCities.length < maxSelections) {
      onChange([...selectedCities, city]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {selectedCities.length > 0 ? (
              selectedCities.map((city) => (
                <Badge key={city.value} variant="secondary">
                  {city.label}
                </Badge>
              ))
            ) : (
              <span>Select cities...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search cities..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandGroup>
            {SUPPORTED_CITIES.map((city) => {
              const isSelected = selectedCities.some(
                (c) => c.value === city.value
              );
              return (
                <CommandItem
                  key={city.value}
                  value={city.value}
                  onSelect={() => toggleCity(city)}
                  disabled={
                    !isSelected &&
                    selectedCities.length >= maxSelections
                  }
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
