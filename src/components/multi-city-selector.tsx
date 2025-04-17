"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

// Craigslist cities with their display names and region codes
const cities = [
  { value: "newyork", label: "New York", region: "nyc" },
  { value: "sfbay", label: "San Francisco Bay Area", region: "sfo" },
  { value: "losangeles", label: "Los Angeles", region: "lax" },
  { value: "chicago", label: "Chicago", region: "chi" },
  { value: "boston", label: "Boston", region: "bos" },
  { value: "seattle", label: "Seattle", region: "sea" },
  { value: "portland", label: "Portland", region: "pdx" },
  { value: "denver", label: "Denver", region: "den" },
  { value: "austin", label: "Austin", region: "aus" },
  { value: "miami", label: "Miami", region: "mia" },
] as const

export type CityOption = typeof cities[number]

interface MultiCitySelectorProps {
  selectedCities: CityOption[]
  onChange: (cities: CityOption[]) => void
  maxSelections?: number
}

export function MultiCitySelector({
  selectedCities,
  onChange,
  maxSelections = 5,
}: MultiCitySelectorProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = React.useCallback((city: CityOption) => {
    onChange(selectedCities.filter((s) => s.value !== city.value))
  }, [selectedCities, onChange])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selectedCities.length > 0) {
          handleUnselect(selectedCities[selectedCities.length - 1])
        }
      }
      if (e.key === "Escape") {
        input.blur()
      }
    }
  }, [selectedCities, handleUnselect])

  const selectables = cities.filter(
    (city) => !selectedCities.find((s) => s.value === city.value)
  )

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selectedCities.map((city) => (
            <Badge
              key={city.value}
              variant="secondary"
              className="hover:bg-secondary"
            >
              {city.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(city)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleUnselect(city)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select cities..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            disabled={selectedCities.length >= maxSelections}
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup>
                {selectables.map((city) => (
                  <CommandItem
                    key={city.value}
                    onSelect={() => {
                      setInputValue("")
                      onChange([...selectedCities, city])
                    }}
                    className="cursor-pointer"
                  >
                    {city.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
