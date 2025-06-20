"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DataItem = Record<string, any> | string | number;

interface CustomFilterProps {
  data: DataItem[];
  filterFields: [string]; // ONLY one field allowed
  onFilter: (filtered: DataItem[]) => void;
}

export const CustomFilter: React.FC<CustomFilterProps> = ({
  data,
  filterFields,
  onFilter,
}) => {
  const field = filterFields[0]; // we only support one filter field
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const getUniqueValues = (): string[] => {
    const values = data
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return item[field]?.toString();
        }
        return undefined;
      })
      .filter(Boolean) as string[];

    return Array.from(new Set(values));
  };

  // Apply filter whenever selectedValue changes
  React.useEffect(() => {
    if (!selectedValue) {
      onFilter(data); // reset
    } else {
      const filtered = data.filter((item) => {
        if (typeof item === "object" && item !== null) {
          const val = item[field];
          return val?.toString().toLowerCase() === selectedValue.toLowerCase();
        }
        return true;
      });
      onFilter(filtered);
    }
  }, [selectedValue, data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[200px] justify-between">
          {selectedValue || `Filter by ${field}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0 ">
        <Command>
          <CommandInput placeholder={`Search ${field}...`} />
          <CommandList>
            <CommandEmpty>No value found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="__clear__"
                className="text-red-600"
                onSelect={() => {
                  setSelectedValue("");
                  setOpen(false);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Filter
              </CommandItem>

              {getUniqueValues().map((val) => (
                <CommandItem
                  key={val}
                  value={val}
                  onSelect={() => {
                    setSelectedValue(val);
                    setOpen(false);
                  }}
                >
                  {val}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedValue === val ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
