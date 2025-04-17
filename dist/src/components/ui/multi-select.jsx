"use client";
import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList, CommandInput } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
export function MultiSelect({ options, selected, onChange, placeholder = "Select options...", className, }) {
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const handleUnselect = React.useCallback((option) => {
        onChange(selected.filter((s) => s !== option));
    }, [onChange, selected]);
    const handleKeyDown = React.useCallback((e) => {
        const input = inputRef.current;
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "" && selected.length > 0) {
                    handleUnselect(selected[selected.length - 1]);
                }
            }
            if (e.key === "Escape") {
                input.blur();
            }
        }
    }, [selected, handleUnselect]);
    const selectables = options.filter((option) => !selected.includes(option.value));
    return (<Command onKeyDown={handleKeyDown} className={className}>
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((selectedValue) => {
            const option = options.find((o) => o.value === selectedValue);
            if (!option)
                return null;
            return (<Badge key={option.value} variant="secondary">
                {option.label}
                <button className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleUnselect(option.value);
                    }
                }} onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }} onClick={() => handleUnselect(option.value)}>
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground"/>
                </button>
              </Badge>);
        })}
          <CommandPrimitive.Input ref={inputRef} value={inputValue} onValueChange={setInputValue} onBlur={() => setOpen(false)} onFocus={() => setOpen(true)} placeholder={selected.length === 0 ? placeholder : undefined} className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"/>
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (<div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandInput placeholder={placeholder}/>
              <CommandGroup>
                {selectables.map((option) => (<CommandItem key={option.value} onSelect={() => {
                    onChange([...selected, option.value]);
                    setInputValue("");
                }}>
                    {option.label}
                    {option.region && (<span className="ml-2 text-xs text-muted-foreground">
                        {option.region}
                      </span>)}
                  </CommandItem>))}
              </CommandGroup>
            </CommandList>
          </div>) : null}
      </div>
    </Command>);
}
