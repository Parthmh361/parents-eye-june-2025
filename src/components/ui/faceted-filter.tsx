import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import React from "react";

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FacetedFilterProps {
  title: string;
  column: any;
  options: Option[];
}

export function DataTableFacetedFilter({
  title,
  column,
  options,
}: FacetedFilterProps) {
  const selectedValues = new Set(column.getFilterValue() as string[] || []);
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {title}
          {selectedValues.size > 0 && (
            <span className="ml-2 font-semibold text-muted-foreground">
              ({selectedValues.size})
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Filter ${title}...`} />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = selectedValues.has(option.value);
              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newValues = isSelected
                      ? [...selectedValues].filter((v) => v !== option.value)
                      : [...selectedValues, option.value];
                    column.setFilterValue(newValues.length ? newValues : undefined);
                  }}
                >
                  <Checkbox checked={isSelected} className="mr-2" />
                  {option.icon}
                  <span>{option.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
