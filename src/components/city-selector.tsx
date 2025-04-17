"use client"

import * as React from "react"
import { Combobox } from "@/components/ui/combobox"
import { cities } from "@/data/cities"

export interface CitySelectorProps {
  selectedCities: string[]
  onSelect: (cities: string[]) => void
  maxCities?: number
}

export function CitySelector({
  selectedCities,
  onSelect,
  maxCities = 5,
}: CitySelectorProps) {
  const handleSelect = (values: string | string[]) => {
    if (Array.isArray(values)) {
      // Limit the number of selected cities based on maxCities
      onSelect(values.slice(0, maxCities))
    }
  }

  return (
    <div className="w-full">
      <Combobox
        options={cities}
        value={selectedCities}
        onValueChange={handleSelect}
        placeholder="Select cities..."
        emptyMessage="No cities found."
        searchPlaceholder="Search cities..."
        multiple={true}
        groupByRegion={true}
      />
      {selectedCities.length >= maxCities && (
        <p className="mt-2 text-sm text-muted-foreground">
          Maximum {maxCities} cities allowed
        </p>
      )}
    </div>
  )
}
