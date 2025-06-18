import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";
import { Search } from "lucide-react";
import Link from "next/link";

type DataItem = Record<string, any> | string | number;

interface SearchComponentProps {
  data?: DataItem[];
  placeholder?: string;
  displayKey?: string | string[];
  debounceDelay?: number;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  data = [],
  placeholder = "Search...",
  displayKey = "name",
  debounceDelay = 300,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DataItem[]>(data);

  useEffect(() => {
    setResults(data);
  }, [data]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!query) {
        setResults(data);
      } else {
        setResults(
          data.filter((item) => {
            if (typeof item === "object" && item !== null) {
              if (Array.isArray(displayKey)) {
                const joined = displayKey
                  .map((key) => item[key])
                  .join(" ")
                  .toLowerCase();
                return joined.includes(query.toLowerCase());
              }
              return (
                item[displayKey] &&
                item[displayKey]
                  .toString()
                  .toLowerCase()
                  .includes(query.toLowerCase())
              );
            }
            return item?.toString().toLowerCase().includes(query.toLowerCase());
          })
        );
      }
    }, debounceDelay);
    return () => clearTimeout(debounce);
  }, [query, data, displayKey, debounceDelay]);

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <Input
        type="text"
        placeholder={placeholder}
        icon={<Search className="w-4 h-4" />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {results.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                No results found.
              </div>
            ) : (
              results.map((item, idx) => {
                let displayText = "";
                if (typeof item === "object" && item !== null) {
                  displayText = Array.isArray(displayKey)
                    ? displayKey.map((key) => item[key]).join(" | ")
                    : item[displayKey];
                } else {
                  displayText = item as string;
                }

                const url =
                  typeof item === "object" && item !== null && item.url
                    ? item.url
                    : undefined;

                return (
                  <SidebarMenuItem key={displayText + idx}>
                    <SidebarMenuButton asChild>
                      {url ? (
                        <Link href={url}>{displayText}</Link>
                      ) : (
                        <span>{displayText}</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </div>
  );
};

export default SearchComponent;
