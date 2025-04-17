"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxOption {
  value: string
  label: string
  region?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | string[]
  onValueChange: (value: string | string[]) => void
  placeholder?: string
  emptyMessage?: string
  multiple?: boolean
  groupByRegion?: boolean
  searchPlaceholder?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  emptyMessage = "No options found.",
  multiple = false,
  groupByRegion = false,
  searchPlaceholder,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedValues = multiple ? (value as string[] || []) : [value as string || ""]
  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label)
    .join(", ")

  interface OptionGroup {
    region?: string
    options: ComboboxOption[]
  }

  const filteredOptions = React.useMemo<OptionGroup[]>(() => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (groupByRegion) {
      const regions = Array.from(new Set(filtered.map((option) => option.region)))
      return regions.map((region) => ({
        region,
        options: filtered.filter((option) => option.region === region),
      }))
    }

    return [{ options: filtered }]
  }, [options, searchQuery, groupByRegion])

  const handleSelect = (currentValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(currentValue)
        ? selectedValues.filter((val) => val !== currentValue)
        : [...selectedValues, currentValue]
      onValueChange(newValues)
    } else {
      onValueChange(currentValue === selectedValues[0] ? "" : currentValue)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLabels || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder || placeholder}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          {filteredOptions.map((group, index) => (
            <CommandGroup key={index} heading={group.region}>
              {group.options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
