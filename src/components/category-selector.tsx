"use client"

import * as React from "react"
import { Combobox } from "@/components/ui/combobox"
import { categories } from "@/lib/categories"

export interface CategorySelectorProps {
  selectedCategory: string
  onSelect: (value: string | string[]) => void
}

export function CategorySelector({
  selectedCategory,
  onSelect,
}: CategorySelectorProps) {
  const handleSelect = (value: string | string[]) => {
    // Since we're using single select, value will always be string
    // but we need to handle the type to match Combobox's interface
    if (typeof value === 'string') {
      onSelect(value);
    }
  };

  return (
    <div className="w-full">
      <Combobox
        options={categories}
        value={selectedCategory}
        onValueChange={handleSelect}
        placeholder="Select category..."
        emptyMessage="No categories found."
        searchPlaceholder="Search categories..."
        multiple={false}
        groupByRegion={true}
      />
    </div>
  )
}
